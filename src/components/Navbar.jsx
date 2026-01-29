import React, { useState, useEffect } from 'react';
import { Box, Search, ShoppingBag, Menu, X, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { totalCount } = useCart();
    const { user } = useAuth();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/70 backdrop-blur-xl border-b border-gray-200/50 py-4 shadow-sm'
                : 'bg-transparent py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group cursor-pointer hover:scale-105 transition-transform">
                    <div className="bg-lime-400 p-1.5 rounded-lg border border-black/10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Box size={24} className="text-black" />
                    </div>
                    <span className="text-2xl font-bold tracking-tighter font-heading mix-blend-multiply">
                        Re:Space
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {[
                        { name: '신상품', path: '/new-arrivals' },
                        { name: '프리미엄 리퍼브', path: '/premium-refurb' },
                        { name: '구매하기', path: '/checkout' },
                        { name: '주문조회', path: '/orders' },
                        { name: '판매하기', path: '/sell' },
                        { name: '브랜드', path: '/brands' }
                    ].map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className="text-sm font-semibold hover:text-lime-600 transition-colors relative group font-sans"
                        >
                            {item.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-lime-400 transition-all group-hover:w-full"></span>
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/search" className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <Search size={20} />
                    </Link>
                    <Link to="/cart" className="p-2 hover:bg-black/5 rounded-full transition-colors relative">
                        <ShoppingBag size={20} />
                        {totalCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-lime-500 text-black text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                                {totalCount}
                            </span>
                        )}
                    </Link>
                    <Link to={user ? "/account" : "/login"} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                        <User size={20} />
                    </Link>
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 p-6 md:hidden flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-4">
                    {[
                        { name: '신상품', path: '/new-arrivals' },
                        { name: '프리미엄 리퍼브', path: '/premium-refurb' },
                        { name: '구매하기', path: '/checkout' },
                        { name: '주문조회', path: '/orders' },
                        { name: '판매하기', path: '/sell' },
                        { name: '브랜드', path: '/brands' }
                    ].map((item) => (
                        <Link key={item.name} to={item.path} className="text-lg font-bold font-heading">{item.name}</Link>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
