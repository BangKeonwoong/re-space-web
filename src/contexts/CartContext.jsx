import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const CART_KEY = 'respace_cart_v1'

const loadCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(loadCart())
  }, [])

  useEffect(() => {
    saveCart(items)
  }, [items])

  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price_krw: product.price_krw,
          image_url: product.image_url,
          quantity,
        },
      ]
    })
  }

  const updateQuantity = (productId, quantity) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item,
      ),
    )
  }

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const clear = () => setItems([])

  const totals = useMemo(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0)
    const price = items.reduce((sum, item) => sum + item.price_krw * item.quantity, 0)
    return { count, price }
  }, [items])

  const value = {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clear,
    totalCount: totals.count,
    totalPrice: totals.price,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
