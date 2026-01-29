import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext.jsx'
import { AdminAuthProvider } from './contexts/AdminAuthContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <App />
          </BrowserRouter>
        </AdminAuthProvider>
      </AuthProvider>
    </CartProvider>
  </React.StrictMode>,
)
