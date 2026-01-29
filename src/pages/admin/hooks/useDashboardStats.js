import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useAdminAuth } from '../../../contexts/AdminAuthContext'

export const useDashboardStats = () => {
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

  return { stats, recentOrders, status }
}
