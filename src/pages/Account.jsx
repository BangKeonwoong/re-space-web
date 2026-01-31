import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Account = () => {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  if (!user) {
    return (
      <div className="pt-24 md:pt-32 pb-20 px-6 max-w-xl mx-auto">
        <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 text-center text-gray-500">
          로그인 후 이용해주세요.
        </div>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="pt-24 md:pt-32 pb-20 px-6 max-w-3xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold font-heading mb-4">내 계정</h1>
        <div className="space-y-2 text-gray-600">
          <p>
            <span className="font-semibold text-gray-800">이메일:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold text-gray-800">가입일:</span>{' '}
            {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="mt-6 px-6 py-3 rounded-xl border border-gray-200 text-sm font-semibold hover:border-black"
        >
          로그아웃
        </button>
      </div>
    </div>
  )
}

export default Account
