import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { PaymentClient, Webhook } from '@portone/server-sdk'
import { isUnrecognizedPayment } from '@portone/server-sdk/payment'
import crypto from 'crypto'

dotenv.config()

const app = express()
const port = Number(process.env.PORT) || 8787

const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:4173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({ origin: corsOrigins, credentials: true }))
app.use(
  express.json({
    limit: '2mb',
    verify: (req, _res, buf) => {
      req.rawBody = buf?.toString('utf8')
    },
  }),
)
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
)

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const portoneApiSecret = process.env.PORTONE_API_SECRET
const portoneStoreId = process.env.PORTONE_STORE_ID
const portoneChannelKey = process.env.PORTONE_CHANNEL_KEY
const portoneWebhookSecret = process.env.PORTONE_WEBHOOK_SECRET

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('[server] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

if (!portoneApiSecret || !portoneStoreId || !portoneChannelKey) {
  console.warn('[server] Missing PORTONE_API_SECRET / PORTONE_STORE_ID / PORTONE_CHANNEL_KEY')
}

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    })
  : null
const paymentClient = portoneApiSecret ? PaymentClient({ secret: portoneApiSecret }) : null

const toNumber = (value) => {
  if (value === '' || value === null || value === undefined) return undefined
  const parsed = Number(value)
  return Number.isNaN(parsed) ? value : parsed
}

const quoteSchema = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email(),
  phone: z.string().max(30).optional().or(z.literal('')),
  quantity: z.preprocess(toNumber, z.number().int().min(1).max(999)).optional().default(1),
  message: z.string().max(2000).optional().or(z.literal('')),
})

const orderSchema = z.object({
  productId: z.string().uuid().optional(),
  quantity: z.preprocess(toNumber, z.number().int().min(1).max(999)),
  customerName: z.string().min(1).max(80),
  customerEmail: z.string().email(),
  customerPhone: z.string().max(30).optional().or(z.literal('')),
  userId: z.string().uuid().optional(),
})

const orderLookupSchema = z.object({
  orderNumber: z.string().min(5).max(40),
  email: z.string().email(),
})

const portonePrepareSchema = z.object({
  orderId: z.string().uuid(),
  payMethod: z.string().optional(),
})

const portoneCompleteSchema = z.object({
  paymentId: z.string().min(1),
  orderId: z.string().uuid().optional(),
})

function createOrderNumber() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase()
  return `ORD-${stamp}-${rand}`
}

async function getActiveProduct(productId) {
  if (!supabase) return null

  let query = supabase
    .from('products')
    .select('id, name, description, price_krw, category, is_active')

  if (productId) {
    query = query.eq('id', productId)
  } else {
    query = query.eq('is_active', true).order('created_at', { ascending: true }).limit(1)
  }

  const { data, error } = await query.single()
  if (error) return null
  return data
}

const statusRank = {
  created: 1,
  pending: 1,
  processing: 1,
  ready: 2,
  paid: 3,
  cancelled: 3,
  partial_cancelled: 3,
  failed: 3,
  amount_mismatch: 4,
}

function shouldUpdateStatus(current, next) {
  const currentRank = statusRank[current] ?? 0
  const nextRank = statusRank[next] ?? 0
  return nextRank >= currentRank
}

function mapPortonePaymentStatus(status) {
  switch (status) {
    case 'PAID':
      return { payment: 'paid', order: 'paid' }
    case 'PENDING':
      return { payment: 'pending', order: 'pending' }
    case 'VIRTUAL_ACCOUNT_ISSUED':
      return { payment: 'ready', order: 'ready' }
    case 'CANCELLED':
    case 'CANCELED':
      return { payment: 'cancelled', order: 'cancelled' }
    case 'PARTIAL_CANCELLED':
    case 'PARTIAL_CANCELED':
      return { payment: 'partial_cancelled', order: 'partial_cancelled' }
    case 'FAILED':
      return { payment: 'failed', order: 'failed' }
    case 'PAY_PENDING':
    case 'READY':
      return { payment: 'pending', order: 'pending' }
    default:
      return { payment: 'processing', order: 'pending' }
  }
}

function mapWebhookTypeToStatus(type) {
  switch (type) {
    case 'Transaction.Paid':
      return { payment: 'paid', order: 'paid' }
    case 'Transaction.VirtualAccountIssued':
      return { payment: 'ready', order: 'ready' }
    case 'Transaction.Cancelled':
      return { payment: 'cancelled', order: 'cancelled' }
    case 'Transaction.PartialCancelled':
      return { payment: 'partial_cancelled', order: 'partial_cancelled' }
    case 'Transaction.Failed':
      return { payment: 'failed', order: 'failed' }
    case 'Transaction.PayPending':
      return { payment: 'pending', order: 'pending' }
    default:
      return null
  }
}

async function applyPaymentUpdate({ paymentId, orderId, normalized, amount, rawPayload }) {
  if (!supabase) return { ok: false, error: 'SERVER_NOT_READY' }

  const { data: paymentRow } = await supabase
    .from('payments')
    .select('id, status, order_id')
    .eq('provider_payment_id', paymentId)
    .maybeSingle()

  const resolvedOrderId = orderId || paymentRow?.order_id
  if (!resolvedOrderId) {
    return { ok: false, error: 'ORDER_NOT_FOUND' }
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, status, total_price_krw')
    .eq('id', resolvedOrderId)
    .single()

  if (orderError || !order) {
    return { ok: false, error: 'ORDER_NOT_FOUND' }
  }

  if (typeof amount === 'number' && order.total_price_krw !== amount) {
    if (paymentRow) {
      await supabase
        .from('payments')
        .update({ status: 'amount_mismatch', raw_payload: rawPayload || null })
        .eq('id', paymentRow.id)
    }
    return { ok: false, error: 'AMOUNT_MISMATCH' }
  }

  if (normalized?.order && shouldUpdateStatus(order.status, normalized.order)) {
    await supabase
      .from('orders')
      .update({ status: normalized.order })
      .eq('id', order.id)
  }

  if (paymentRow) {
    if (!normalized?.payment || shouldUpdateStatus(paymentRow.status, normalized.payment)) {
      await supabase
        .from('payments')
        .update({
          status: normalized?.payment || paymentRow.status,
          amount: typeof amount === 'number' ? amount : undefined,
          raw_payload: rawPayload || null,
        })
        .eq('id', paymentRow.id)
    }
  } else {
    await supabase.from('payments').insert({
      order_id: order.id,
      provider: 'portone',
      provider_payment_id: paymentId,
      amount: typeof amount === 'number' ? amount : order.total_price_krw,
      currency: 'KRW',
      status: normalized?.payment || 'created',
      raw_payload: rawPayload || null,
    })
  }

  return { ok: true }
}

async function syncPaymentFromPortone(paymentId, orderId) {
  if (!paymentClient) return { ok: false, error: 'PORTONE_NOT_READY' }

  const payment = await paymentClient.getPayment({ paymentId })
  if (isUnrecognizedPayment(payment)) {
    return { ok: false, error: 'UNRECOGNIZED_PAYMENT' }
  }

  const normalized = mapPortonePaymentStatus(payment.status)
  const amount = payment.amount?.total

  return applyPaymentUpdate({
    paymentId,
    orderId,
    normalized,
    amount: typeof amount === 'number' ? amount : undefined,
    rawPayload: payment,
  })
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() })
})

app.get('/api/products/active', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'SERVER_NOT_READY' })
  }

  const product = await getActiveProduct()
  if (!product) {
    return res.status(404).json({ error: 'PRODUCT_NOT_FOUND' })
  }

  return res.json({ product })
})

app.get('/api/products', async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: 'SERVER_NOT_READY' })
  }

  const category = typeof req.query.category === 'string' ? req.query.category.trim() : ''
  let query = supabase
    .from('products')
    .select('id, name, description, price_krw, category, is_active')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  if (error) {
    return res.status(500).json({ error: 'DB_ERROR', details: error.message })
  }

  return res.json({ products: data || [] })
})

app.post('/api/orders/lookup', async (req, res) => {
  const parsed = orderLookupSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'INVALID_INPUT', details: parsed.error.flatten() })
  }
  if (!supabase) {
    return res.status(500).json({ error: 'SERVER_NOT_READY' })
  }

  const { orderNumber, email } = parsed.data

  const { data: order, error } = await supabase
    .from('orders')
    .select(
      'id, order_number, status, total_price_krw, currency, created_at, customer_name, customer_email, product:products(name), payments:payments(status, provider, amount, created_at)',
    )
    .eq('order_number', orderNumber)
    .eq('customer_email', email)
    .single()

  if (error || !order) {
    return res.status(404).json({ error: 'ORDER_NOT_FOUND' })
  }

  return res.json({ order })
})

app.post('/api/quotes', async (req, res) => {
  const parsed = quoteSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'INVALID_INPUT', details: parsed.error.flatten() })
  }
  if (!supabase) {
    return res.status(500).json({ error: 'SERVER_NOT_READY' })
  }

  const { name, email, phone, quantity, message } = parsed.data
  const { data, error } = await supabase
    .from('quotes')
    .insert({
      customer_name: name,
      customer_email: email,
      customer_phone: phone || null,
      quantity,
      message: message || null,
      status: 'new',
    })
    .select('id, status, created_at')
    .single()

  if (error) {
    return res.status(500).json({ error: 'DB_ERROR', details: error.message })
  }

  return res.status(201).json({ quote: data })
})

app.post('/api/orders', async (req, res) => {
  const parsed = orderSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'INVALID_INPUT', details: parsed.error.flatten() })
  }
  if (!supabase) {
    return res.status(500).json({ error: 'SERVER_NOT_READY' })
  }

  const { productId, quantity, customerName, customerEmail, customerPhone, userId } = parsed.data
  const product = await getActiveProduct(productId)

  if (!product) {
    return res.status(404).json({ error: 'PRODUCT_NOT_FOUND' })
  }

  const unitPrice = product.price_krw
  const totalPrice = unitPrice * quantity
  const guestToken = userId ? null : crypto.randomUUID()

  const { data, error } = await supabase
    .from('orders')
    .insert({
      order_number: createOrderNumber(),
      product_id: product.id,
      quantity,
      unit_price_krw: unitPrice,
      total_price_krw: totalPrice,
      currency: 'KRW',
      status: 'pending',
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || null,
      user_id: userId || null,
      guest_token: guestToken,
    })
    .select('id, order_number, status, total_price_krw, guest_token, created_at')
    .single()

  if (error) {
    return res.status(500).json({ error: 'DB_ERROR', details: error.message })
  }

  return res.status(201).json({ order: data })
})

app.post('/api/payments/portone/prepare', async (req, res) => {
  const parsed = portonePrepareSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'INVALID_INPUT', details: parsed.error.flatten() })
  }
  if (!supabase) {
    return res.status(500).json({ error: 'SERVER_NOT_READY' })
  }
  if (!portoneStoreId || !portoneChannelKey) {
    return res.status(500).json({ error: 'PORTONE_NOT_READY' })
  }

  const { orderId, payMethod } = parsed.data

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, order_number, total_price_krw, status, product:products(name), customer_name, customer_email')
    .eq('id', orderId)
    .single()

  if (orderError || !order) {
    return res.status(404).json({ error: 'ORDER_NOT_FOUND' })
  }

  if (order.status === 'paid') {
    return res.status(409).json({ error: 'ORDER_ALREADY_PAID' })
  }

  const paymentId = `payment-${crypto.randomUUID()}`
  const orderName = order.product?.name
    ? `${order.product.name} (${order.order_number})`
    : `Re:Space Order ${order.order_number}`

  const { error: paymentError } = await supabase
    .from('payments')
    .insert({
      order_id: order.id,
      provider: 'portone',
      provider_payment_id: paymentId,
      amount: order.total_price_krw,
      currency: 'KRW',
      status: 'created',
    })

  if (paymentError) {
    return res.status(500).json({ error: 'DB_ERROR', details: paymentError.message })
  }

  return res.json({
    paymentId,
    request: {
      storeId: portoneStoreId,
      channelKey: portoneChannelKey,
      paymentId,
      orderName,
      totalAmount: order.total_price_krw,
      currency: 'CURRENCY_KRW',
      payMethod: payMethod || 'CARD',
      customer: {
        name: order.customer_name,
        email: order.customer_email,
      },
    },
  })
})

app.post('/api/payments/portone/complete', async (req, res) => {
  const parsed = portoneCompleteSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'INVALID_INPUT', details: parsed.error.flatten() })
  }
  if (!supabase) {
    return res.status(500).json({ error: 'SERVER_NOT_READY' })
  }
  if (!paymentClient) {
    return res.status(500).json({ error: 'PORTONE_NOT_READY' })
  }

  const { paymentId, orderId } = parsed.data

  try {
    const result = await syncPaymentFromPortone(paymentId, orderId)
    if (!result.ok) {
      return res.status(400).json(result)
    }
    return res.json({ ok: true })
  } catch (error) {
    console.error('[portone] complete failed', error)
    return res.status(500).json({ error: 'PORTONE_VERIFY_FAILED' })
  }
})

app.post('/api/webhooks/portone', async (req, res) => {
  if (!portoneWebhookSecret) {
    return res.status(500).json({ error: 'PORTONE_NOT_READY' })
  }

  const payload = req.rawBody ?? JSON.stringify(req.body ?? {})
  const headers = {
    'webhook-id': req.header('webhook-id'),
    'webhook-signature': req.header('webhook-signature'),
    'webhook-timestamp': req.header('webhook-timestamp'),
  }

  try {
    const webhook = await Webhook.verify(portoneWebhookSecret, payload, headers)
    if (Webhook.isUnrecognizedWebhook(webhook)) {
      return res.json({ ok: true })
    }

    const paymentId = webhook.data?.paymentId

    if (!paymentId) {
      return res.json({ ok: true })
    }

    if (paymentClient) {
      await syncPaymentFromPortone(paymentId)
    } else {
      const normalized = mapWebhookTypeToStatus(webhook.type)
      if (!normalized) {
        return res.json({ ok: true })
      }
      await applyPaymentUpdate({
        paymentId,
        normalized,
        rawPayload: webhook,
      })
    }

    return res.json({ ok: true })
  } catch (error) {
    console.error('[webhook] portone verify failed', error)
    return res.status(400).json({ error: 'INVALID_WEBHOOK' })
  }
})

app.use((req, res) => {
  res.status(404).json({ error: 'NOT_FOUND' })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'SERVER_ERROR' })
})

app.listen(port, () => {
  console.log(`[server] listening on port ${port}`)
})
