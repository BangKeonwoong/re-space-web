import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
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

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!mounted) return
      if (sessionError) {
        setError(sessionError.message)
      }
      setSession(data.session)
      setLoading(false)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return
      setSession(nextSession)
    })

    return () => {
      mounted = false
      data?.subscription?.unsubscribe()
    }
  }, [])

  const signUp = async ({ email, password }) => {
    if (!supabase) {
      setError('Supabase 환경변수가 설정되지 않았습니다.')
      return { ok: false }
    }
    setError(null)
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) {
      setError(signUpError.message)
      return { ok: false }
    }
    setSession(data.session)
    return { ok: true, needsEmailConfirm: !data.session }
  }

  const signIn = async ({ email, password }) => {
    if (!supabase) {
      setError('Supabase 환경변수가 설정되지 않았습니다.')
      return { ok: false }
    }
    setError(null)
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError(signInError.message)
      return { ok: false }
    }
    setSession(data.session)
    return { ok: true }
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setSession(null)
  }

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      loading,
      error,
      signUp,
      signIn,
      signOut,
      isConfigured: isSupabaseConfigured,
    }),
    [session, loading, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
