import React from 'react';
import { Box } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white pt-20 pb-10 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="bg-lime-400 p-1 rounded-md border border-black/10">
                                <Box size={20} className="text-black" />
                            </div>
                            <span className="text-xl font-bold tracking-tighter font-heading">Re:Space</span>
                        </div>
                        <p className="text-gray-500 max-w-xs leading-relaxed">
                            프리미엄 가구 리세일 플랫폼. <br />
                            검증된 브랜드 가구를 가장 합리적인 가격에 만나보세요.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-sm">
                        <div>
                            <h4 className="font-bold mb-4 font-heading text-lg">쇼핑</h4>
                            <ul className="space-y-3 text-gray-500">
                                <li><Link to="/new-arrivals" className="hover:text-black hover:underline transition-all">신상품</Link></li>
                                <li><Link to="/premium-refurb" className="hover:text-black hover:underline transition-all">리퍼브</Link></li>
                                <li><Link to="/brands" className="hover:text-black hover:underline transition-all">브랜드</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 font-heading text-lg">판매</h4>
                            <ul className="space-y-3 text-gray-500">
                                <li><Link to="/quote" className="hover:text-black hover:underline transition-all">견적 받기</Link></li>
                                <li><Link to="/checkout" className="hover:text-black hover:underline transition-all">기업 구매</Link></li>
                                <li><Link to="/sell" className="hover:text-black hover:underline transition-all">위탁 판매</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 font-heading text-lg">고객 지원</h4>
                            <ul className="space-y-3 text-gray-500">
                                <li><a href="#" className="hover:text-black hover:underline transition-all">자주 묻는 질문</a></li>
                                <li><a href="#" className="hover:text-black hover:underline transition-all">문의하기</a></li>
                                <li><a href="#" className="hover:text-black hover:underline transition-all">반품/환불</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div
                    className="mt-20 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 border-t border-gray-100 pt-8 font-medium">
                    <p>© 2026 Re:Space Inc. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-black transition-colors">개인정보처리방침</a>
                        <a href="#" className="hover:text-black transition-colors">이용약관</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
