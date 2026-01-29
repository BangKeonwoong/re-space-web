import React from 'react'
import { resolveAssetUrl } from '../../../lib/assets'
import { getCategoryLabel } from '../../../lib/catalog'

const ProductListView = ({ viewMode, products, loading, onEdit, onPreview }) => {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading && (
          <div className="col-span-full text-center text-gray-400 py-12">상품 정보를 불러오는 중...</div>
        )}
        {!loading && products.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-12">등록된 상품이 없습니다.</div>
        )}
        {!loading &&
          products.map((product) => (
            <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <button
                type="button"
                onClick={() => onPreview(resolveAssetUrl(product.image_url))}
                className="w-full h-44 rounded-xl overflow-hidden bg-gray-100"
              >
                <img
                  src={resolveAssetUrl(product.image_url)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </button>
              <div className="mt-4">
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  {getCategoryLabel(product.category)}
                </p>
                <h3 className="text-lg font-bold mt-1">{product.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mt-2">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-semibold">₩{product.price_krw.toLocaleString()}</span>
                  <button
                    onClick={() => onEdit(product)}
                    className="text-sm font-semibold text-gray-500 hover:text-black"
                  >
                    수정
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    )
  }

  return (
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
          {loading && (
            <tr>
              <td colSpan="6" className="p-6 text-center text-gray-400">
                상품 정보를 불러오는 중...
              </td>
            </tr>
          )}
          {!loading && products.length === 0 && (
            <tr>
              <td colSpan="6" className="p-6 text-center text-gray-400">
                등록된 상품이 없습니다.
              </td>
            </tr>
          )}
          {!loading &&
            products.map((product) => (
              <tr key={product.id}>
                <td className="p-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onPreview(resolveAssetUrl(product.image_url))}
                    className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100"
                  >
                    <img
                      src={resolveAssetUrl(product.image_url)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-gray-400 line-clamp-1">{product.description}</p>
                  </div>
                </td>
                <td className="p-4 text-gray-500">{getCategoryLabel(product.category)}</td>
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
                  <button onClick={() => onEdit(product)} className="text-gray-400 hover:text-black">
                    수정
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductListView
