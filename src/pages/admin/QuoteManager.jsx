import React from 'react'
import { useQuotes } from './hooks/useQuotes'

const statusLabels = {
  new: '신규',
  in_progress: '진행 중',
  done: '완료',
  closed: '종료',
}

const statusOptions = ['new', 'in_progress', 'done', 'closed']

const QuoteManager = () => {
  const { quotes, status, savingId, fetchQuotes, updateStatus } = useQuotes()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading">견적 관리</h1>
          <p className="text-sm text-gray-500 mt-1">신규 문의를 확인하고 상태를 업데이트하세요.</p>
        </div>
        <button
          onClick={fetchQuotes}
          className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:border-black"
        >
          새로고침
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
              <th className="p-4 font-medium text-gray-500">고객</th>
              <th className="p-4 font-medium text-gray-500">연락처</th>
              <th className="p-4 font-medium text-gray-500">수량</th>
              <th className="p-4 font-medium text-gray-500">메모</th>
              <th className="p-4 font-medium text-gray-500">상태</th>
              <th className="p-4 font-medium text-gray-500">접수일</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {status.loading && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-400">
                  견적 정보를 불러오는 중...
                </td>
              </tr>
            )}
            {!status.loading && quotes.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-400">
                  등록된 견적 문의가 없습니다.
                </td>
              </tr>
            )}
            {!status.loading &&
              quotes.map((quote) => (
                <tr key={quote.id}>
                  <td className="p-4">
                    <p className="font-medium">{quote.customer_name}</p>
                    <p className="text-xs text-gray-400">{quote.customer_email}</p>
                  </td>
                  <td className="p-4 text-gray-500">{quote.customer_phone || '-'}</td>
                  <td className="p-4">{quote.quantity}</td>
                  <td className="p-4 text-gray-500 max-w-xs">
                    <p className="line-clamp-2">{quote.message || '-'}</p>
                  </td>
                  <td className="p-4">
                    <select
                      value={quote.status}
                      onChange={(event) => updateStatus(quote.id, event.target.value)}
                      disabled={savingId === quote.id}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {statusLabels[option] || option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-gray-500">
                    {new Date(quote.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default QuoteManager
