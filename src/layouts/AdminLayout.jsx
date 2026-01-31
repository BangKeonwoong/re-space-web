import React, { useEffect, useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { LayoutDashboard, Package, Users, LogOut, CheckSquare, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useAdminAuth } from '../contexts/AdminAuthContext'

const AdminLayout = () => {
  const { user, signOut } = useAdminAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(min-width: 1024px)')
    const handleChange = () => setSidebarOpen(media.matches)
    handleChange()
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Topbar */}
      <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100"
          aria-label="관리자 메뉴 열기"
        >
          <Menu size={20} />
        </button>
        <Link to="/admin" className="text-lg font-bold font-heading text-black">
          Re:Space <span className="text-xs text-lime-500 bg-black px-2 py-0.5 rounded-full ml-1">Admin</span>
        </Link>
        <div className="w-8" />
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="관리자 메뉴 닫기"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-100 flex items-start gap-3">
          <div className="flex-1">
            <Link to="/admin" className="text-2xl font-bold tracking-tighter font-heading text-black">
              Re:Space <span className="text-xs text-lime-500 bg-black px-2 py-0.5 rounded-full ml-1">Admin</span>
            </Link>
            <p className="text-xs text-gray-400 mt-2">{user?.email}</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="관리자 메뉴 접기"
          >
            <PanelLeftClose size={18} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <Link
            to="/admin"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-lime-50 hover:text-black rounded-xl transition-colors font-medium"
          >
            <LayoutDashboard size={20} />
            대시보드
          </Link>
          <Link
            to="/admin/products"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-lime-50 hover:text-black rounded-xl transition-colors font-medium"
          >
            <Package size={20} />
            상품 관리
          </Link>
          <Link
            to="/admin/customers"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-lime-50 hover:text-black rounded-xl transition-colors font-medium"
          >
            <Users size={20} />
            고객 관리
          </Link>
          <Link
            to="/admin/quotes"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-lime-50 hover:text-black rounded-xl transition-colors font-medium"
          >
            <CheckSquare size={20} />
            견적 관리
          </Link>
        </nav>
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-xl transition-colors font-medium"
          >
            <LogOut size={20} />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content */}
      {!sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="hidden lg:flex fixed top-6 left-6 z-20 items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-semibold hover:border-black"
          aria-label="관리자 메뉴 열기"
        >
          <PanelLeftOpen size={18} />
          메뉴
        </button>
      )}

      <main
        className={`p-6 sm:p-8 overflow-y-auto min-h-screen pt-20 lg:pt-8 transition-[margin] duration-200 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
        }`}
      >
        <Outlet />
      </main>
    </div>
  )
};

export default AdminLayout
