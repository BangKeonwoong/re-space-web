import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { resolveAssetUrl } from '../lib/assets'

const Cart = () => {
  const { items, totalPrice, updateQuantity, removeItem, clear } = useCart()

  return (
    <div className="pt-24 md:pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold font-heading">장바구니</h1>
          <p className="text-gray-500 mt-2">선택한 상품을 확인하고 결제하세요.</p>
        </div>
        {items.length > 0 && (
          <button
            onClick={clear}
            className="self-start sm:self-auto text-sm text-gray-500 hover:text-black transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            비우기
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-3xl p-10 text-center text-gray-500">
          장바구니가 비어있습니다.
        </div>
      ) : (
        <div className="grid lg:grid-cols-[2fr_1fr] gap-10">
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row gap-6">
                <img
                  src={resolveAssetUrl(item.image_url)}
                  alt={item.name}
                  className="w-full h-40 sm:w-28 sm:h-28 rounded-xl object-cover bg-gray-100"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <p className="text-gray-500 mt-1">₩{item.price_krw.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-sm text-gray-400 hover:text-black"
                    >
                      삭제
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                      className="w-20 px-3 py-2 border border-gray-200 rounded-lg"
                    />
                    <span className="text-sm text-gray-500">
                      합계 ₩{(item.price_krw * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 h-fit">
            <h2 className="text-xl font-bold mb-4">결제 요약</h2>
            <div className="flex justify-between text-gray-600 mb-4">
              <span>총 결제금액</span>
              <span className="font-semibold">₩{totalPrice.toLocaleString()}</span>
            </div>
            <Link
              to="/checkout"
              className="w-full inline-flex justify-center items-center bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-900 transition-colors"
            >
              결제하기
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
