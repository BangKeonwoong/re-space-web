import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext'

const AdminLogin = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAdmin, loading, error, signIn, isConfigured } = useAdminAuth()
  const [form, setForm] = useState({ email: '', password: '' })

  useEffect(() => {
    if (isAdmin) {
      const next = location.state?.from?.pathname || '/admin'
      navigate(next, { replace: true })
    }
  }, [isAdmin, location.state, navigate])

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await signIn({ email: form.email.trim(), password: form.password })
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400">Re:Space Admin</p>
            <h1 className="text-3xl font-bold mt-2 font-heading">관리자 로그인</h1>
          </div>
          <Link to="/" className="text-sm text-gray-500 hover:text-black">
            홈으로
          </Link>
        </div>

        {!isConfigured && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
            Supabase 환경변수가 설정되지 않았습니다.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="관리자 이메일"
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
            disabled={loading || !isConfigured}
            className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-900 transition-colors disabled:opacity-60"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-4 leading-relaxed">
          관리자 권한이 없는 계정은 로그인할 수 없습니다. 권한이 필요하면 관리자에게 요청하세요.
        </p>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed">
          로그인 실패 시 Supabase URL/anon key가 동일한 프로젝트인지 확인해주세요.
        </p>
      </div>
    </div>
  )
}

export default AdminLogin
