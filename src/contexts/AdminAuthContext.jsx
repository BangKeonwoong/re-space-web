import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const AdminAuthContext = createContext(null)

const getAdminStatus = async (user) => {
  if (!supabase || !user) return { isAdmin: false, error: null }

  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    return { isAdmin: false, error }
  }

  return { isAdmin: Boolean(data), error: null }
}

export const AdminAuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    if (!supabase) {
      setLoading(false)
      return () => {
        mounted = false
      }
    }

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return
      setSession(data.session)
      const adminState = await getAdminStatus(data.session?.user)
      if (!mounted) return
      setIsAdmin(adminState.isAdmin)
      setError(adminState.error ? '관리자 권한 확인에 실패했습니다.' : null)
      setLoading(false)
    })

    const { data } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!mounted) return
      setLoading(true)
      setSession(nextSession)
      const adminState = await getAdminStatus(nextSession?.user)
      if (!mounted) return
      setIsAdmin(adminState.isAdmin)
      setError(adminState.error ? '관리자 권한 확인에 실패했습니다.' : null)
      setLoading(false)
    })

    return () => {
      mounted = false
      data?.subscription?.unsubscribe()
    }
  }, [])

  const signIn = async ({ email, password }) => {
    if (!supabase) {
      setError('Supabase 환경변수가 설정되지 않았습니다.')
      return { ok: false }
    }
    setLoading(true)
    setError(null)

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setLoading(false)
      setError('로그인에 실패했습니다. 이메일/비밀번호를 확인해주세요.')
      return { ok: false }
    }

    const adminState = await getAdminStatus(data.user)
    if (!adminState.isAdmin) {
      await supabase.auth.signOut()
      setSession(null)
      setIsAdmin(false)
      setLoading(false)
      setError('관리자 권한이 없습니다. 권한 요청이 필요합니다.')
      return { ok: false }
    }

    setSession(data.session)
    setIsAdmin(true)
    setLoading(false)
    return { ok: true }
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setSession(null)
    setIsAdmin(false)
  }

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      isAdmin,
      loading,
      error,
      signIn,
      signOut,
      isConfigured: isSupabaseConfigured,
    }),
    [session, isAdmin, loading, error],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}
