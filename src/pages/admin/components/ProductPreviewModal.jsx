import React from 'react'

const ProductPreviewModal = ({ image, onClose }) => {
  if (!image) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-6" onClick={onClose}>
      <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-3xl w-full" onClick={(event) => event.stopPropagation()}>
        <img src={image} alt="preview" className="w-full max-h-[70vh] object-contain rounded-xl" />
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold hover:border-black"
        >
          닫기
        </button>
      </div>
    </div>
  )
}

export default ProductPreviewModal
