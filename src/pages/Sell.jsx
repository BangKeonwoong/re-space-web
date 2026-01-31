import React from 'react';
import { Camera, Upload } from 'lucide-react';

const Sell = () => {
    return (
        <div className="pt-24 md:pt-32 pb-20 px-6 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4 font-heading text-center">판매하기</h1>
            <p className="text-gray-500 text-center mb-12">
                사용하지 않는 가구, 사진 한 장으로 견적을 받아보세요.
            </p>

            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-gray-400 hover:border-lime-500 hover:text-lime-600 transition-colors cursor-pointer group">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-lime-50">
                        <Camera size={32} />
                    </div>
                    <span className="font-bold text-lg mb-2">사진 업로드</span>
                    <span className="text-sm">클릭하거나 파일을 드래그하세요</span>
                </div>

                <div className="mt-8 space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-2">브랜드 / 제품명</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none transition-colors" placeholder="예: 허먼밀러 에어론" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">구매 시기</label>
                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none transition-colors">
                            <option>1년 미만</option>
                            <option>1~3년</option>
                            <option>3년 이상</option>
                        </select>
                    </div>
                    <button className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-900 transition-colors mt-4">
                        견적 요청하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sell;
