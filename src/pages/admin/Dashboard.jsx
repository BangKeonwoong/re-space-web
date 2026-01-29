import React from 'react'
import { DollarSign, ShoppingBag, MessageSquare, Package } from 'lucide-react'
import { useDashboardStats } from './hooks/useDashboardStats'

const Dashboard = () => {
  const { stats, recentOrders, status } = useDashboardStats()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 font-heading">대시보드</h1>

      {status.error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
          {status.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: '총 매출',
            value: `₩${stats.revenue.toLocaleString()}`,
            icon: <DollarSign />,
            color: 'bg-blue-500',
          },
          {
            title: '총 주문',
            value: `${stats.orderCount}건`,
            icon: <ShoppingBag />,
            color: 'bg-lime-500',
          },
          {
            title: '미처리 견적',
            value: `${stats.pendingQuotes}건`,
            icon: <MessageSquare />,
            color: 'bg-orange-500',
          },
          {
            title: '활성 상품',
            value: `${stats.activeProducts}개`,
            icon: <Package />,
            color: 'bg-purple-500',
          },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
              <p className="text-2xl font-bold">{status.loading ? '...' : stat.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-lg mb-4">최근 주문 내역</h2>
        {status.loading ? (
          <div className="h-32 flex items-center justify-center text-gray-400">
            주문 데이터를 불러오는 중...
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-gray-400">
            아직 주문 데이터가 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.order_number}
                className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3"
              >
                <div>
                  <p className="font-semibold">{order.order_number}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₩{order.total_price_krw?.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
