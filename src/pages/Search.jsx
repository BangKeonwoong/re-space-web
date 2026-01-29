import React, { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCatalog from '../components/ProductCatalog'

const Search = () => {
  const [params, setParams] = useSearchParams()
  const initial = params.get('q') || ''
  const [keyword, setKeyword] = useState(initial)

  const searchQuery = useMemo(() => params.get('q') || '', [params])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (keyword.trim()) {
      setParams({ q: keyword.trim() })
    } else {
      setParams({})
    }
  }

  return (
    <div>
      <div className="pt-28 pb-6 px-6 max-w-7xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold font-heading">검색</h1>
            <p className="text-sm text-gray-500 mt-2">
              원하는 상품을 검색하거나 카테고리로 탐색하세요.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex w-full md:w-auto gap-3">
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="상품명 또는 설명으로 검색"
              className="flex-1 md:w-80 px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none"
            />
            <button className="px-5 py-3 bg-black text-white rounded-xl font-semibold">검색</button>
          </form>
        </div>
      </div>

      <ProductCatalog
        title={searchQuery ? `"${searchQuery}" 검색 결과` : '전체 상품'}
        description={searchQuery ? '검색 결과를 확인하세요.' : '모든 상품을 확인하세요.'}
        initialCategory="all"
        searchQuery={searchQuery}
      />
    </div>
  )
}

export default Search
