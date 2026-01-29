import React, { useEffect, useState } from 'react'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { adminRequest } from '../../lib/adminApi'

const CustomerManager = () => {
  const { accessToken } = useAdminAuth()
  const [users, setUsers] = useState([])
  const [status, setStatus] = useState({ loading: true, error: null })
  const [query, setQuery] = useState('')

  const fetchUsers = async (search = '') => {
    if (!accessToken) return
    setStatus({ loading: true, error: null })
    try {
      const params = new URLSearchParams()
      if (search) params.set('q', search)
      const data = await adminRequest(`/api/admin/users${params.toString() ? `?${params}` : ''}`, accessToken)
      setUsers(data.users || [])
      setStatus({ loading: false, error: null })
    } catch (error) {
      setStatus({ loading: false, error: error.message || '회원 목록을 불러오지 못했습니다.' })
    }
  }

  useEffect(() => {
    if (!accessToken) return
    fetchUsers()
  }, [accessToken])

  const handleSubmit = (event) => {
    event.preventDefault()
    fetchUsers(query.trim())
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading">회원 관리</h1>
          <p className="text-sm text-gray-500 mt-1">회원 계정을 조회하고 관리하세요.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="이메일 검색"
            className="px-4 py-2 rounded-xl border border-gray-200 focus:border-black focus:outline-none"
          />
          <button className="px-4 py-2 bg-black text-white rounded-xl font-semibold">검색</button>
        </form>
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
              <th className="p-4 font-medium text-gray-500">이메일</th>
              <th className="p-4 font-medium text-gray-500">가입일</th>
              <th className="p-4 font-medium text-gray-500">최근 로그인</th>
              <th className="p-4 font-medium text-gray-500">이메일 인증</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {status.loading && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-400">
                  회원 정보를 불러오는 중...
                </td>
              </tr>
            )}
            {!status.loading && users.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-400">
                  등록된 회원이 없습니다.
                </td>
              </tr>
            )}
            {!status.loading &&
              users.map((user) => (
                <tr key={user.id}>
                  <td className="p-4 font-medium">{user.email}</td>
                  <td className="p-4 text-gray-500">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="p-4 text-gray-500">
                    {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.email_confirmed_at ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {user.email_confirmed_at ? '확인됨' : '미확인'}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CustomerManager
