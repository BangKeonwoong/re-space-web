import React, { useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../../lib/api'
import { useAdminAuth } from '../../contexts/AdminAuthContext'

const categoryLabels = {
  new: '신상품',
  'premium-refurb': '프리미엄 리퍼브',
  refurb: '리퍼브',
  vintage: '빈티지',
}

const categoryOptions = [
  { value: 'new', label: '신상품' },
  { value: 'premium-refurb', label: '프리미엄 리퍼브' },
  { value: 'refurb', label: '리퍼브' },
  { value: 'vintage', label: '빈티지' },
]

const ProductManager = () => {
  const { accessToken } = useAdminAuth()
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState({ loading: true, error: null })
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    id: null,
    name: '',
    description: '',
    price_krw: '',
    category: 'new',
    image_url: '',
    is_active: true,
  })
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)

  const isEditing = useMemo(() => Boolean(form.id), [form.id])

  const resetForm = () => {
    setForm({
      id: null,
      name: '',
      description: '',
      price_krw: '',
      category: 'new',
      image_url: '',
      is_active: true,
    })
    setFormError(null)
  }

  const fetchProducts = () => {
    let mounted = true
    setStatus({ loading: true, error: null })

    apiRequest('/api/admin/products', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
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
  }

  useEffect(() => {
    if (!accessToken) return
    const cleanup = fetchProducts()
    return cleanup
  }, [accessToken])

  const handleChange = (field) => (event) => {
    const value = field === 'is_active' ? event.target.checked : event.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError(null)

    const priceValue = Number(form.price_krw)
    if (!form.name.trim()) {
      setFormError('상품명을 입력해주세요.')
      return
    }
    if (Number.isNaN(priceValue) || priceValue < 0) {
      setFormError('가격은 0 이상 숫자여야 합니다.')
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price_krw: priceValue,
        category: form.category,
        image_url: form.image_url.trim(),
        is_active: form.is_active,
      }

      if (isEditing) {
        await apiRequest(`/api/admin/products/${form.id}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        })
      } else {
        await apiRequest('/api/admin/products', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        })
      }

      resetForm()
      setShowForm(false)
      fetchProducts()
    } catch (error) {
      setFormError(error.message || '상품 저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (product) => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price_krw: product.price_krw,
      category: product.category,
      image_url: product.image_url || '',
      is_active: product.is_active,
    })
    setFormError(null)
    setShowForm(true)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold font-heading">상품 관리</h1>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          + 상품 등록
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-8 relative">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              닫기
            </button>
            <h2 className="text-xl font-bold mb-6">{isEditing ? '상품 수정' : '상품 등록'}</h2>

            <form onSubmit={handleSubmit}>
              <div className="flex items-start justify-between gap-6 flex-wrap">
                <div className="flex-1 min-w-[240px] space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">상품명</label>
                    <input
                      value={form.name}
                      onChange={handleChange('name')}
                      placeholder="상품명을 입력하세요"
                      className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">상품 설명</label>
                    <textarea
                      value={form.description}
                      onChange={handleChange('description')}
                      rows="3"
                      placeholder="상품 설명을 입력하세요"
                      className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none"
                    />
                  </div>
                </div>

                <div className="w-full md:w-[320px] space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">가격 (KRW)</label>
                    <input
                      type="number"
                      min="0"
                      value={form.price_krw}
                      onChange={handleChange('price_krw')}
                      placeholder="가격을 입력하세요"
                      className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">카테고리</label>
                    <select
                      value={form.category}
                      onChange={handleChange('category')}
                      className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none"
                    >
                      {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">이미지 URL</label>
                    <input
                      value={form.image_url}
                      onChange={handleChange('image_url')}
                      placeholder="/products/xxx.svg"
                      className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input type="checkbox" checked={form.is_active} onChange={handleChange('is_active')} />
                    판매 활성화
                  </label>
                </div>
              </div>

              {formError && (
                <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                  {formError}
                </div>
              )}

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 disabled:opacity-60"
                >
                  {saving ? '저장 중...' : isEditing ? '상품 수정' : '상품 등록'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold hover:border-black"
                  >
                    수정 취소
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

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
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-gray-400 hover:text-black"
                    >
                      수정
                    </button>
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
