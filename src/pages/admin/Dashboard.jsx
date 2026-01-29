import React, { useEffect, useState } from 'react'
import { DollarSign, ShoppingBag, MessageSquare, Package } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAdminAuth } from '../../contexts/AdminAuthContext'

const Dashboard = () => {
  const { isConfigured } = useAdminAuth()
  const [stats, setStats] = useState({
    revenue: 0,
    orderCount: 0,
    pendingQuotes: 0,
    activeProducts: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [status, setStatus] = useState({ loading: true, error: null })

  useEffect(() => {
    let mounted = true
    if (!supabase || !isConfigured) {
      setStatus({ loading: false, error: 'Supabase 환경변수가 설정되지 않았습니다.' })
      return () => {
        mounted = false
      }
    }

    const loadStats = async () => {
      setStatus({ loading: true, error: null })

      const [
        ordersResult,
        paymentsResult,
        quotesResult,
        productsResult,
        recentOrdersResult,
      ] = await Promise.all([
        supabase.from('orders').select('id, status'),
        supabase.from('payments').select('amount, status'),
        supabase.from('quotes').select('id, status'),
        supabase.from('products').select('id, is_active'),
        supabase
          .from('orders')
          .select('order_number, total_price_krw, status, created_at')
          .order('created_at', { ascending: false })
          .limit(6),
      ])

      if (
        ordersResult.error ||
        paymentsResult.error ||
        quotesResult.error ||
        productsResult.error ||
        recentOrdersResult.error
      ) {
        if (mounted) {
          setStatus({ loading: false, error: '대시보드 데이터를 불러오지 못했습니다.' })
        }
        return
      }

      const paidTotal = (paymentsResult.data || [])
        .filter((payment) => payment.status === 'paid')
        .reduce((sum, payment) => sum + (payment.amount || 0), 0)

      if (mounted) {
        setStats({
          revenue: paidTotal,
          orderCount: ordersResult.data?.length || 0,
          pendingQuotes: (quotesResult.data || []).filter((quote) => quote.status === 'new').length,
          activeProducts: (productsResult.data || []).filter((product) => product.is_active).length,
        })
        setRecentOrders(recentOrdersResult.data || [])
        setStatus({ loading: false, error: null })
      }
    }

    loadStats()
    return () => {
      mounted = false
    }
  }, [isConfigured])

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
