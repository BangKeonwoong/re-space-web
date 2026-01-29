import React from 'react'

const ProductToolbar = ({ viewMode, onViewChange, onCreate }) => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold font-heading">상품 관리</h1>
        <p className="text-sm text-gray-500 mt-1">리스트/그리드 보기로 전환할 수 있습니다.</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => onViewChange('list')}
            className={`px-3 py-2 text-sm font-semibold ${
              viewMode === 'list' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
            }`}
          >
            리스트
          </button>
          <button
            onClick={() => onViewChange('grid')}
            className={`px-3 py-2 text-sm font-semibold ${
              viewMode === 'grid' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
            }`}
          >
            그리드
          </button>
        </div>
        <button
          onClick={onCreate}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          + 상품 등록
        </button>
      </div>
    </div>
  )
}

export default ProductToolbar
