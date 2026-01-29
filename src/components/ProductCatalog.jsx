import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../lib/api'
import { useCart } from '../contexts/CartContext'
import { resolveAssetUrl } from '../lib/assets'

const categories = [
  { key: 'all', label: '전체' },
  { key: 'new', label: '신상품' },
  { key: 'premium-refurb', label: '프리미엄 리퍼브' },
  { key: 'refurb', label: '리퍼브' },
  { key: 'vintage', label: '빈티지' },
]

const ProductCatalog = ({ title, description, initialCategory = 'all' }) => {
  const { addItem } = useCart()
  const [category, setCategory] = useState(initialCategory)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)

  const categoryMap = useMemo(
    () =>
      categories.reduce((acc, item) => {
        acc[item.key] = item.label
        return acc
      }, {}),
    [],
  )

  const categoryLabel = useMemo(
    () => categories.find((item) => item.key === category)?.label || '전체',
    [category],
  )

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    const query = category && category !== 'all' ? `?category=${category}` : ''
    apiRequest(`/api/products${query}`)
      .then((data) => {
        if (mounted) setProducts(data.products || [])
      })
      .catch((err) => {
        if (mounted) setError(err.message || '상품을 불러오지 못했습니다.')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [category])

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold mb-3 font-heading">{title}</h1>
          {description && <p className="text-gray-500 max-w-2xl">{description}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          {categories.map((item) => (
            <button
              key={item.key}
              onClick={() => setCategory(item.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                category === item.key
                  ? 'bg-black text-white border-black'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-black hover:text-black'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-gray-50 rounded-2xl p-6 animate-pulse">
              <div className="h-40 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-5 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              {categoryLabel} 상품 {products.length}개
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <Link to={`/products/${product.id}`} className="block mb-5">
                  <img
                    src={resolveAssetUrl(product.image_url)}
                    alt={product.name}
                    className="h-44 w-full object-cover rounded-xl"
                  />
                </Link>
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  {categoryMap[product.category] || product.category}
                </p>
                <Link to={`/products/${product.id}`} className="block">
                  <h3 className="text-xl font-bold mt-2 mb-2 hover:text-lime-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">₩{product.price_krw.toLocaleString()}</span>
                  <button
                    onClick={() => addItem(product, 1)}
                    className="text-xs font-semibold bg-black text-white px-3 py-2 rounded-full hover:bg-gray-800"
                  >
                    장바구니 담기
                  </button>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div className="col-span-full text-center text-gray-400 py-16">
                해당 카테고리에 상품이 없습니다.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductCatalog
