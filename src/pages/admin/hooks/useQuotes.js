import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useAdminAuth } from '../../../contexts/AdminAuthContext'

export const useQuotes = () => {
  const { isConfigured } = useAdminAuth()
  const [quotes, setQuotes] = useState([])
  const [status, setStatus] = useState({ loading: true, error: null })
  const [savingId, setSavingId] = useState(null)

  const fetchQuotes = useCallback(async () => {
    if (!supabase) return
    setStatus({ loading: true, error: null })
    const { data, error } = await supabase
      .from('quotes')
      .select('id, customer_name, customer_email, customer_phone, quantity, message, status, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      setStatus({ loading: false, error: '견적 목록을 불러오지 못했습니다.' })
      return
    }

    setQuotes(data || [])
    setStatus({ loading: false, error: null })
  }, [])

  useEffect(() => {
    if (isConfigured) {
      fetchQuotes()
    } else {
      setStatus({ loading: false, error: 'Supabase 환경변수가 설정되지 않았습니다.' })
    }
  }, [fetchQuotes, isConfigured])

  const updateStatus = async (quoteId, nextStatus) => {
    if (!supabase) return
    setSavingId(quoteId)
    const { error } = await supabase.from('quotes').update({ status: nextStatus }).eq('id', quoteId)

    if (!error) {
      setQuotes((prev) =>
        prev.map((item) => (item.id === quoteId ? { ...item, status: nextStatus } : item)),
      )
    }
    setSavingId(null)
  }

  return {
    quotes,
    status,
    savingId,
    fetchQuotes,
    updateStatus,
  }
}
