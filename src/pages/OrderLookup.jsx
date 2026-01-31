import React, { useState } from 'react'
import { apiRequest } from '../lib/api'
import { resolveAssetUrl } from '../lib/assets'

const statusLabel = {
  pending: '결제 대기',
  ready: '입금 대기',
  paid: '결제 완료',
  cancelled: '취소',
  partial_cancelled: '부분 취소',
  failed: '실패',
}

const currencyLabel = (value) => (typeof value === 'number' ? value.toLocaleString() : value)

const OrderLookup = () => {
  const [form, setForm] = useState({ orderNumber: '', email: '' })
  const [status, setStatus] = useState({ loading: false, error: null })
  const [order, setOrder] = useState(null)

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ loading: true, error: null })
    setOrder(null)

    try {
      const data = await apiRequest('/api/orders/lookup', {
        method: 'POST',
        body: JSON.stringify({
          orderNumber: form.orderNumber.trim(),
          email: form.email.trim(),
        }),
      })
      setOrder(data.order)
      setStatus({ loading: false, error: null })
    } catch (error) {
      const detailError = error?.details?.fieldErrors
        ? Object.values(error.details.fieldErrors).flat().filter(Boolean)[0]
        : null
      setStatus({
        loading: false,
        error: detailError || error.message || '주문 조회에 실패했습니다.',
      })
    }
  }

  return (
    <div className="pt-24 md:pt-32 pb-20 px-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 font-heading">주문 조회</h1>
      <p className="text-gray-500 mb-10">
        주문번호와 주문 시 입력한 이메일로 주문 상태를 확인할 수 있습니다.
      </p>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10">
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-3xl p-8 space-y-4">
          <input
            type="text"
            value={form.orderNumber}
            onChange={handleChange('orderNumber')}
            placeholder="주문번호 (예: ORD-20260129-XXXXXX)"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200"
          />
          <input
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="이메일"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200"
          />

          {status.error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
              {status.error}
            </div>
          )}

          <button
            type="submit"
            disabled={status.loading}
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-900 transition-colors disabled:opacity-60"
          >
            {status.loading ? '조회 중...' : '주문 조회'}
          </button>
        </form>

        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm min-h-[260px]">
          {!order && (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              주문 정보를 조회하면 여기에 표시됩니다.
            </div>
          )}

          {order && (
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">Order</p>
                <h2 className="text-2xl font-bold mt-2">{order.order_number}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {order.customer_name} · {order.customer_email}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <span className="px-3 py-1 rounded-full bg-lime-100 text-lime-800 text-sm font-semibold">
                  {statusLabel[order.status] || order.status}
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold">
                  {order.currency} {order.total_price_krw?.toLocaleString()}
                </span>
                {order.product?.name && (
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold">
                    {order.product.name}
                  </span>
                )}
              </div>

              {order.items?.length > 0 && (
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <p className="font-semibold text-gray-700">주문 상품</p>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={`${item.product?.name || 'item'}-${index}`} className="flex items-center gap-3">
                        <img
                          src={resolveAssetUrl(item.product?.image_url)}
                          alt={item.product?.name || 'product'}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{item.product?.name || '상품'}</p>
                          <p className="text-xs text-gray-500">
                            수량 {item.quantity} · ₩{currencyLabel(item.total_price_krw)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {order.payments?.length > 0 && (
                <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-500">
                  <p className="font-semibold text-gray-700">결제 내역</p>
                  {order.payments.map((payment) => (
                    <div key={`${payment.provider}-${payment.created_at}`} className="flex justify-between">
                      <span>{payment.provider}</span>
                      <span>{statusLabel[payment.status] || payment.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderLookup
