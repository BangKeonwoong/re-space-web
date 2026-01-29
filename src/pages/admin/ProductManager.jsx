import React, { useEffect, useState } from 'react'
import { apiRequest } from '../../lib/api'

const categoryLabels = {
  new: '신상품',
  'premium-refurb': '프리미엄 리퍼브',
  refurb: '리퍼브',
  vintage: '빈티지',
}

const ProductManager = () => {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState({ loading: true, error: null })

  useEffect(() => {
    let mounted = true
    setStatus({ loading: true, error: null })

    apiRequest('/api/products')
      .then((data) => {
        if (mounted) setProducts(data.products || [])
      })
      .catch((error) => {
        if (mounted) setStatus({ loading: false, error: error.message || '상품을 불러오지 못했습니다.' })
      })
      .finally(() => {
        if (mounted) setStatus((prev) => ({ ...prev, loading: false }))
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold font-heading">상품 관리</h1>
        <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
          + 상품 등록
        </button>
      </div>

      {status.error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
          {status.error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-medium text-gray-500">상품 정보</th>
              <th className="p-4 font-medium text-gray-500">카테고리</th>
              <th className="p-4 font-medium text-gray-500">가격</th>
              <th className="p-4 font-medium text-gray-500">상태</th>
              <th className="p-4 font-medium text-gray-500">재고</th>
              <th className="p-4 font-medium text-gray-500">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {status.loading && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-400">
                  상품 정보를 불러오는 중...
                </td>
              </tr>
            )}
            {!status.loading && products.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-400">
                  등록된 상품이 없습니다.
                </td>
              </tr>
            )}
            {!status.loading &&
              products.map((product) => (
                <tr key={product.id}>
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={product.image_url || '/products/placeholder.svg'}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-gray-400 line-clamp-1">{product.description}</p>
                    </div>
                  </td>
                  <td className="p-4 text-gray-500">{categoryLabels[product.category] || product.category}</td>
                  <td className="p-4">₩{product.price_krw.toLocaleString()}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {product.is_active ? '판매중' : '비활성'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">-</td>
                  <td className="p-4">
                    <button className="text-gray-400 hover:text-black">수정</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductManager
