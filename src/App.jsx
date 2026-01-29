import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { MessageSquare } from 'lucide-react';
import Home from './pages/Home';
import NewArrivals from './pages/NewArrivals';
import PremiumRefurb from './pages/PremiumRefurb';
import Sell from './pages/Sell';
import Brands from './pages/Brands';
import Quote from './pages/Quote';
import Checkout from './pages/Checkout';
import OrderLookup from './pages/OrderLookup';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import AdminGuard from './components/AdminGuard';
import Dashboard from './pages/admin/Dashboard';
import ProductManager from './pages/admin/ProductManager';
import CustomerManager from './pages/admin/CustomerManager';
import AdminLogin from './pages/admin/AdminLogin';
import QuoteManager from './pages/admin/QuoteManager';

const AgentButton = () => {
  return (
    <Link
      to="/quote"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 pl-4 pr-2 py-2 bg-black text-white rounded-full shadow-2xl hover:scale-105 transition-transform group">
      <span className="font-medium text-sm">견적/재고 문의</span>
      <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center text-black">
        <MessageSquare size={20} />
      </div>
    </Link>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-lime-200">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/premium-refurb" element={<PremiumRefurb />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/quote" element={<Quote />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<OrderLookup />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminGuard />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductManager />} />
          <Route path="customers" element={<CustomerManager />} />
          <Route path="quotes" element={<QuoteManager />} />
        </Route>
      </Routes>
      <Footer />
      <AgentButton />
    </div>
  )
}

export default App
