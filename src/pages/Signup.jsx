import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Signup = () => {
  const navigate = useNavigate()
  const { signUp, error } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', confirm: '' })
  const [notice, setNotice] = useState(null)

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setNotice(null)
    if (form.password.length < 6) {
      setNotice('비밀번호는 최소 6자 이상이어야 합니다.')
      return
    }
    if (form.password !== form.confirm) {
      setNotice('비밀번호가 일치하지 않습니다.')
      return
    }
    const result = await signUp({ email: form.email.trim(), password: form.password })
    if (result.ok) {
      if (result.needsEmailConfirm) {
        setNotice('이메일 인증 후 로그인할 수 있습니다. 메일함을 확인해주세요.')
      } else {
        navigate('/account')
      }
    }
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-md mx-auto">
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold font-heading mb-3">회원가입</h1>
        <p className="text-sm text-gray-500 mb-6">새 계정을 만들어 빠르게 주문하세요.</p>

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
          <input
            type="password"
            value={form.confirm}
            onChange={handleChange('confirm')}
            placeholder="비밀번호 확인"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none"
          />

          {(notice || error) && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
              {notice || error}
            </div>
          )}

          <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900">
            회원가입
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-500">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="font-semibold text-black">
            로그인
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signup
