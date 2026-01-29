import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Package, Users, LogOut, CheckSquare } from 'lucide-react';

const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200">
                <div className="p-6 border-b border-gray-100">
                    <Link to="/admin" className="text-2xl font-bold tracking-tighter font-heading text-black">
                        Re:Space <span className="text-xs text-lime-500 bg-black px-2 py-0.5 rounded-full ml-1">Admin</span>
                    </Link>
                </div>
                <nav className="p-4 space-y-2">
                    <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-lime-50 hover:text-black rounded-xl transition-colors font-medium">
                        <LayoutDashboard size={20} />
                        대시보드
                    </Link>
                    <Link to="/admin/products" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-lime-50 hover:text-black rounded-xl transition-colors font-medium">
                        <Package size={20} />
                        상품 관리
                    </Link>
                    <Link to="/admin/customers" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-lime-50 hover:text-black rounded-xl transition-colors font-medium">
                        <Users size={20} />
                        고객 관리
                    </Link>
                    <Link to="/admin/quotes" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-lime-50 hover:text-black rounded-xl transition-colors font-medium">
                        <CheckSquare size={20} />
                        견적 관리
                    </Link>
                </nav>
                <div className="absolute bottom-6 left-6 right-6">
                    <button className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-xl transition-colors font-medium">
                        <LogOut size={20} />
                        로그아웃
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
