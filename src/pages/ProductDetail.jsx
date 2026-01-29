import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiRequest } from '../lib/api'
import { useCart } from '../contexts/CartContext'

const ProductDetail = () => {
  const { id } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [status, setStatus] = useState({ loading: true, error: null })

  useEffect(() => {
    let mounted = true
    apiRequest(`/api/products/${id}`)
      .then((data) => {
        if (mounted) setProduct(data.product)
      })
      .catch((error) => {
        if (mounted) setStatus({ loading: false, error: error.message || '상품을 찾을 수 없습니다.' })
      })
      .finally(() => {
        if (mounted) setStatus((prev) => ({ ...prev, loading: false }))
      })

    return () => {
      mounted = false
    }
  }, [id])

  if (status.loading) {
    return (
      <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <div className="h-72 bg-gray-100 rounded-3xl animate-pulse"></div>
      </div>
    )
  }

  if (status.error || !product) {
    return (
      <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6">
          {status.error || '상품을 찾을 수 없습니다.'}
        </div>
      </div>
    )
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-gray-50 rounded-3xl p-8">
          <img
            src={product.image_url || '/products/placeholder.svg'}
            alt={product.name}
            className="w-full h-72 object-cover rounded-2xl"
          />
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400">{product.category}</p>
            <h1 className="text-4xl font-bold mt-2 font-heading">{product.name}</h1>
            <p className="text-gray-500 mt-4">{product.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold">₩{product.price_krw.toLocaleString()}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => addItem(product, 1)}
              className="px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
            >
              장바구니 담기
            </button>
            <Link
              to="/checkout"
              className="px-6 py-3 border border-gray-200 rounded-full font-semibold hover:border-black transition-colors"
            >
              바로 구매
            </Link>
          </div>
          <div className="text-sm text-gray-400">
            배송/환불 정책은 결제 단계에서 확인 가능합니다.
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
