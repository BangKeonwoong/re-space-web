import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const AdminAuthContext = createContext(null)

const getAdminStatus = async (user) => {
  if (!supabase || !user) return { isAdmin: false, error: null }

  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      return { isAdmin: false, error }
    }

    return { isAdmin: Boolean(data), error: null }
  } catch (error) {
    return { isAdmin: false, error }
  }
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

    supabase.auth
      .getSession()
      .then(async ({ data, error }) => {
        if (!mounted) return
        if (error) {
          setError(`세션 확인 실패: ${error.message}`)
          setLoading(false)
          return
        }
        setSession(data.session)
        const adminState = await getAdminStatus(data.session?.user)
        if (!mounted) return
        setIsAdmin(adminState.isAdmin)
        setError(adminState.error ? '관리자 권한 확인에 실패했습니다.' : null)
        setLoading(false)
      })
      .catch((error) => {
        if (!mounted) return
        setError(`세션 확인 실패: ${error?.message || '알 수 없는 오류'}`)
        setLoading(false)
      })

    const { data } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!mounted) return
      setLoading(true)
      setSession(nextSession)
      try {
        const adminState = await getAdminStatus(nextSession?.user)
        if (!mounted) return
        setIsAdmin(adminState.isAdmin)
        setError(adminState.error ? '관리자 권한 확인에 실패했습니다.' : null)
        setLoading(false)
      } catch (error) {
        if (!mounted) return
        setError(`관리자 권한 확인 실패: ${error?.message || '알 수 없는 오류'}`)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      data?.subscription?.unsubscribe()
    }
  }, [])

  const mapAuthError = (authError) => {
    const message = authError?.message || ''
    const lower = message.toLowerCase()
    if (lower.includes('invalid login credentials')) {
      return '이메일/비밀번호가 일치하지 않거나 다른 Supabase 프로젝트를 사용 중입니다.'
    }
    if (lower.includes('email not confirmed')) {
      return '이메일 인증이 완료되지 않았습니다. Supabase Auth에서 Confirm 처리하세요.'
    }
    if (lower.includes('invalid api key')) {
      return 'Supabase anon 키가 올바르지 않습니다.'
    }
    if (lower.includes('invalid url')) {
      return 'Supabase URL 형식이 올바르지 않습니다.'
    }
    if (message) {
      return `로그인 실패: ${message}`
    }
    return '로그인에 실패했습니다. 이메일/비밀번호를 확인해주세요.'
  }

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
      setError(mapAuthError(signInError))
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
