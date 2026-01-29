import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, user, error, loading } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })

  useEffect(() => {
    if (user) {
      const next = location.state?.from?.pathname || '/account'
      navigate(next, { replace: true })
    }
  }, [user, location.state, navigate])

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await signIn({ email: form.email.trim(), password: form.password })
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-md mx-auto">
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold font-heading mb-3">로그인</h1>
        <p className="text-sm text-gray-500 mb-6">회원 계정으로 로그인하세요.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="이메일"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none"
          />
          <input
            type="password"
            value={form.password}
            onChange={handleChange('password')}
            placeholder="비밀번호"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none"
          />

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900 disabled:opacity-60"
          >
            로그인
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-500">
          아직 계정이 없으신가요?{' '}
          <Link to="/signup" className="font-semibold text-black">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
