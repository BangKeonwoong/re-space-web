import React, { useEffect, useMemo, useState } from 'react'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { adminRequest, uploadAdminFile } from '../../lib/adminApi'
import ProductFormModal from './components/ProductFormModal'
import ProductListView from './components/ProductListView'
import ProductPreviewModal from './components/ProductPreviewModal'
import ProductToolbar from './components/ProductToolbar'

const ProductManager = () => {
  const PRODUCT_BUCKET = import.meta.env.VITE_SUPABASE_PRODUCT_BUCKET || 'product-images'
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
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [viewMode, setViewMode] = useState('list')
  const [previewImage, setPreviewImage] = useState(null)

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
    setUploadError(null)
    setUploading(false)
  }

  const fetchProducts = () => {
    let mounted = true
    setStatus({ loading: true, error: null })

    adminRequest('/api/admin/products', accessToken)
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

  const handleFileUpload = async (file) => {
    if (!file) return
    if (!file.type?.startsWith('image/')) {
      setUploadError('이미지 파일만 업로드 가능합니다.')
      return
    }

    if (!accessToken) {
      setUploadError('로그인이 필요합니다. 관리자 로그인 후 다시 시도하세요.')
      return
    }

    setUploading(true)
    setUploadError(null)

    try {
      const data = await uploadAdminFile({ accessToken, file })
      if (!data?.publicUrl) {
        throw new Error('UPLOAD_FAILED')
      }
      setForm((prev) => ({ ...prev, image_url: data.publicUrl }))
    } catch (error) {
      const message = error?.message || '이미지 업로드에 실패했습니다.'
      if (message.toLowerCase().includes('bucket not found')) {
        setUploadError(`버킷을 찾을 수 없습니다. Supabase Storage에 ${PRODUCT_BUCKET} 버킷을 생성하세요.`)
      } else {
        setUploadError(message)
      }
    } finally {
      setUploading(false)
    }
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
        await adminRequest(`/api/admin/products/${form.id}`, accessToken, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        })
      } else {
        await adminRequest('/api/admin/products', accessToken, {
          method: 'POST',
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
      <ProductToolbar
        viewMode={viewMode}
        onViewChange={setViewMode}
        onCreate={() => {
          resetForm()
          setShowForm(true)
        }}
      />

      <ProductFormModal
        open={showForm}
        onClose={() => setShowForm(false)}
        isEditing={isEditing}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onUploadFile={handleFileUpload}
        uploading={uploading}
        formError={formError}
        uploadError={uploadError}
        saving={saving}
        onCancelEdit={resetForm}
      />

      <ProductPreviewModal image={previewImage} onClose={() => setPreviewImage(null)} />

      {status.error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
          {status.error}
        </div>
      )}

      <ProductListView
        viewMode={viewMode}
        products={products}
        loading={status.loading}
        onEdit={handleEdit}
        onPreview={(image) => setPreviewImage(image)}
      />
    </div>
  )
}

export default ProductManager
