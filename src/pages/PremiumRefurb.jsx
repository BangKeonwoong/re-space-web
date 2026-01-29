import React from 'react';
import { Link } from 'react-router-dom';

const PremiumRefurb = () => {
    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-4 font-heading">프리미엄 리퍼브</h1>
            <p className="text-gray-500 mb-12 max-w-2xl">
                전문가의 손길로 다시 태어난 S급 가구를 만나보세요.
                엄격한 품질 검사를 통과한 제품만을 엄선했습니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Refurb Items */}
                <div className="bg-white border boundary-gray-200 rounded-3xl p-8 shadow-sm">
                    <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 inline-block">S-Grade</span>
                    <div className="aspect-[4/3] bg-gray-100 rounded-2xl mb-6"></div>
                    <h3 className="text-2xl font-bold mb-2">Herman Miller Aeron Remastered</h3>
                    <p className="text-gray-600 mb-4">새 상품과 동일한 컨디션, 합리적인 가격.</p>
                    <div className="flex justify-between items-center">
                        <span className="text-xl font-bold">₩980,000</span>
                        <Link to="/checkout" className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                            구매하기
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumRefurb;
