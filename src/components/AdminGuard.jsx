import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import { useAdminAuth } from '../contexts/AdminAuthContext'

const AdminGuard = () => {
  const location = useLocation()
  const { loading, isAdmin } = useAdminAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        관리자 권한 확인 중...
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return <AdminLayout />
}

export default AdminGuard
