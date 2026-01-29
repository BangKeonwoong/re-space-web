import React, { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import { useAdminAuth } from '../contexts/AdminAuthContext'

const AdminGuard = () => {
  const location = useLocation()
  const { loading, isAdmin, error } = useAdminAuth()
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    if (!loading) {
      setTimedOut(false)
      return
    }
    const timer = setTimeout(() => {
      setTimedOut(true)
    }, 6000)

    return () => clearTimeout(timer)
  }, [loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        <div className="text-center space-y-3">
          <p>관리자 권한 확인 중...</p>
          {timedOut && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-600 shadow-sm">
              <p className="font-semibold text-gray-800 mb-2">권한 확인이 지연되고 있습니다.</p>
              <p className="mb-3">잠시 후 다시 시도하거나 로그인 페이지로 이동해주세요.</p>
              <Link to="/admin/login" className="text-black font-semibold underline">
                관리자 로그인으로 이동
              </Link>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return <AdminLayout />
}

export default AdminGuard
