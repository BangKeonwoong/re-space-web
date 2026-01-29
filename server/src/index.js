import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

dotenv.config()

const app = express()
const port = Number(process.env.PORT) || 8787

const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:4173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({ origin: corsOrigins, credentials: true }))
app.use(express.json({ limit: '2mb' }))
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
)

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('[server] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    })
  : null

const quoteSchema = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email(),
  phone: z.string().max(30).optional().or(z.literal('')),
  quantity: z.number().int().min(1).max(999).optional().default(1),
  message: z.string().max(2000).optional().or(z.literal('')),
})

const orderSchema = z.object({
  productId: z.string().uuid().optional(),
  quantity: z.number().int().min(1).max(999),
  customerName: z.string().min(1).max(80),
  customerEmail: z.string().email(),
  customerPhone: z.string().max(30).optional().or(z.literal('')),
  userId: z.string().uuid().optional(),
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
    .select('id, name, price_krw, is_active')

  if (productId) {
    query = query.eq('id', productId)
  } else {
    query = query.eq('is_active', true).order('created_at', { ascending: true }).limit(1)
  }

  const { data, error } = await query.single()
  if (error) return null
  return data
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() })
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

app.post('/api/payments/portone/prepare', (req, res) => {
  res.status(501).json({
    error: 'NOT_IMPLEMENTED',
    message: 'PortOne integration will be added after PG contract setup.',
  })
})

app.post('/api/webhooks/portone', (req, res) => {
  console.log('[webhook] portone', req.body)
  res.json({ ok: true })
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
