import React, { useEffect, useMemo, useState } from 'react'
import * as PortOne from '@portone/browser-sdk/v2'
import { useLocation } from 'react-router-dom'
import { apiRequest } from '../lib/api'
import { useCart } from '../contexts/CartContext'
import { resolveAssetUrl } from '../lib/assets'

const Checkout = () => {
  const { items, totalPrice: cartTotal, clear } = useCart()
  const location = useLocation()
  const [product, setProduct] = useState(null)
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [productError, setProductError] = useState(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    quantity: 1,
    payMethod: 'CARD',
  })
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: null,
  })

  const hasCart = items.length > 0
  const productId = useMemo(() => {
    const value = new URLSearchParams(location.search).get('productId')
    return value ? value.trim() : ''
  }, [location.search])

  useEffect(() => {
    let mounted = true
    if (hasCart) {
      setProduct(null)
      setLoadingProduct(false)
      setProductError(null)
      return () => {
        mounted = false
      }
    }

    setLoadingProduct(true)
    setProductError(null)
    const endpoint = productId ? `/api/products/${productId}` : '/api/products/active'
    apiRequest(endpoint)
      .then((data) => {
        if (mounted) setProduct(data.product)
      })
      .catch(() => {
        if (mounted) {
          setProduct(null)
          setProductError(
            productId ? '선택한 상품을 찾을 수 없습니다.' : '상품 정보를 불러오지 못했습니다.',
          )
        }
      })
      .finally(() => {
        if (mounted) setLoadingProduct(false)
      })
    return () => {
      mounted = false
    }
  }, [hasCart, productId])

  const totalPrice = useMemo(() => {
    if (hasCart) return cartTotal
    if (!product) return 0
    return product.price_krw * Number(form.quantity || 1)
  }, [hasCart, cartTotal, product, form.quantity])

  const handleChange = (field) => (event) => {
    const value = field === 'quantity' ? Number(event.target.value) : event.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ loading: true, error: null, success: null })

    try {
      if (!form.name.trim() || !form.email.trim()) {
        throw new Error('이름과 이메일을 입력해주세요.')
      }
      if (!hasCart && (!form.quantity || Number(form.quantity) < 1)) {
        throw new Error('수량은 1개 이상이어야 합니다.')
      }
      if (!hasCart && !product?.id) {
        throw new Error('상품 정보를 불러오지 못했습니다.')
      }

      const orderPayload = {
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
      }
      if (hasCart) {
        if (items.length === 0) {
          throw new Error('장바구니가 비어있습니다.')
        }
        orderPayload.items = items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        }))
      } else if (product?.id) {
        orderPayload.productId = product.id
        orderPayload.quantity = Number(form.quantity || 1)
      }

      const orderResult = await apiRequest('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload),
      })

      const orderId = orderResult.order?.id
      if (!orderId) {
        throw new Error('ORDER_CREATE_FAILED')
      }

      const prepareResult = await apiRequest('/api/payments/portone/prepare', {
        method: 'POST',
        body: JSON.stringify({
          orderId,
          payMethod: form.payMethod,
        }),
      })

      const { paymentId, request } = prepareResult
      if (!paymentId || !request) {
        throw new Error('PAYMENT_PREPARE_FAILED')
      }

      const response = await PortOne.requestPayment(request)
      if (response?.code) {
        throw new Error(response.message || 'PAYMENT_CANCELLED')
      }

      await apiRequest('/api/payments/portone/complete', {
        method: 'POST',
        body: JSON.stringify({ paymentId, orderId }),
      })

      setStatus({
        loading: false,
        error: null,
        success: `주문이 완료되었습니다. 주문번호: ${orderResult.order.order_number}`,
      })
      if (hasCart) {
        clear()
      }
    } catch (error) {
      const detailError = error?.details?.fieldErrors
        ? Object.values(error.details.fieldErrors).flat().filter(Boolean)[0]
        : null
      setStatus({
        loading: false,
        error: detailError || error.message || '결제 처리 중 오류가 발생했습니다.',
        success: null,
      })
    }
  }

  return (
    <div className="pt-24 md:pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4 font-heading">구매하기</h1>
          <p className="text-gray-500 mb-8">
            {hasCart
              ? '장바구니에 담긴 상품을 확인하고 결제를 진행하세요.'
              : '단일 상품 구매를 위한 간단한 결제 흐름입니다. 카드/계좌이체/가상계좌를 선택할 수 있습니다.'}
          </p>

          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
            {hasCart ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400">Cart Items</p>
                    <h2 className="text-2xl font-bold mt-2">장바구니 상품 {items.length}개</h2>
                  </div>
                  <span className="text-sm px-3 py-1 rounded-full bg-lime-100 text-lime-800 font-semibold">
                    Cart
                  </span>
                </div>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={resolveAssetUrl(item.image_url)}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover bg-gray-100"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          수량 {item.quantity} · ₩{(item.price_krw * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400">Product</p>
                    <h2 className="text-2xl font-bold mt-2">
                      {loadingProduct ? '상품 정보를 불러오는 중...' : product?.name || 'Re:Space Single Product'}
                    </h2>
                  </div>
                  <span className="text-sm px-3 py-1 rounded-full bg-lime-100 text-lime-800 font-semibold">
                    Single Item
                  </span>
                </div>
                {productError && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                    {productError}
                  </div>
                )}
                <p className="text-gray-500 mb-6">
                  {product?.description || '프리미엄 리퍼브 단일 상품입니다. 상태 확인 후 결제하세요.'}
                </p>
                <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                  <span className="text-gray-500 font-medium">단가</span>
                  <span className="text-xl font-bold">
                    {product ? `₩${product.price_krw.toLocaleString()}` : '₩0'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="w-full md:w-[380px]">
          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-3xl p-8 space-y-5">
            <h3 className="text-xl font-bold">주문 정보</h3>

            <input
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              placeholder="이름"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none"
            />
            <input
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="이메일"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none"
            />
            <input
              type="tel"
              value={form.phone}
              onChange={handleChange('phone')}
              placeholder="연락처 (선택)"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none"
            />
            {!hasCart && (
              <input
                type="number"
                min="1"
                value={form.quantity}
                onChange={handleChange('quantity')}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none"
              />
            )}

            <select
              value={form.payMethod}
              onChange={handleChange('payMethod')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none"
            >
              <option value="CARD">카드 결제</option>
              <option value="TRANSFER">계좌이체</option>
              <option value="VIRTUAL_ACCOUNT">가상계좌</option>
            </select>

            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <span className="text-gray-500 font-medium">총 결제금액</span>
              <span className="text-xl font-bold">₩{totalPrice.toLocaleString()}</span>
            </div>

            {status.error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                {status.error}
              </div>
            )}
            {status.success && (
              <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl p-3">
                {status.success}
              </div>
            )}

            <button
              type="submit"
              disabled={status.loading}
              className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-900 transition-colors disabled:opacity-60"
            >
              {status.loading ? '결제 진행 중...' : '결제하기'}
            </button>
            <p className="text-xs text-gray-400 leading-relaxed">
              결제 진행 시 PortOne 결제창이 열립니다. 결제 완료 후 자동으로 주문이 확정됩니다.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Checkout
