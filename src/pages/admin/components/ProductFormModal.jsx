import React, { useRef, useState } from 'react'
import { resolveAssetUrl } from '../../../lib/assets'
import { CATEGORY_OPTIONS } from '../../../lib/catalog'

const ProductFormModal = ({
  open,
  onClose,
  isEditing,
  form,
  onChange,
  onSubmit,
  onUploadFile,
  uploading,
  formError,
  uploadError,
  saving,
  onCancelEdit,
}) => {
  const fileInputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)

  if (!open) return null

  const handleDrop = (event) => {
    event.preventDefault()
    setDragActive(false)
    const file = event.dataTransfer?.files?.[0]
    if (file) onUploadFile(file)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setDragActive(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-8 relative">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
          닫기
        </button>
        <h2 className="text-xl font-bold mb-6">{isEditing ? '상품 수정' : '상품 등록'}</h2>

        <form onSubmit={onSubmit}>
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex-1 min-w-[240px] space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">상품명</label>
                <input
                  value={form.name}
                  onChange={onChange('name')}
                  placeholder="상품명을 입력하세요"
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">상품 설명</label>
                <textarea
                  value={form.description}
                  onChange={onChange('description')}
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
                  onChange={onChange('price_krw')}
                  placeholder="가격을 입력하세요"
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">카테고리</label>
                <select
                  value={form.category}
                  onChange={onChange('category')}
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none"
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">상품 이미지</label>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`mt-2 w-full border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                    dragActive ? 'border-black bg-gray-50' : 'border-gray-200'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => onUploadFile(event.target.files?.[0])}
                  />
                  <p className="text-sm text-gray-600">
                    {uploading ? '업로드 중...' : '드래그 앤 드롭 또는 클릭하여 업로드'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    JPG/PNG/SVG 권장, Supabase Storage에 저장됩니다.
                  </p>
                </div>
                <input
                  value={form.image_url}
                  onChange={onChange('image_url')}
                  placeholder="또는 이미지 URL 직접 입력"
                  className="mt-3 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none"
                />
                {form.image_url && (
                  <img
                    src={resolveAssetUrl(form.image_url)}
                    alt="preview"
                    className="mt-3 w-full h-36 rounded-xl object-cover bg-gray-100"
                  />
                )}
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={form.is_active} onChange={onChange('is_active')} />
                판매 활성화
              </label>
            </div>
          </div>

          {formError && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
              {formError}
            </div>
          )}
          {uploadError && (
            <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
              {uploadError}
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving || uploading}
              className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 disabled:opacity-60"
            >
              {saving ? '저장 중...' : isEditing ? '상품 수정' : '상품 등록'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold hover:border-black"
              >
                수정 취소
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductFormModal
