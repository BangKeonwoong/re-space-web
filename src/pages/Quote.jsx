import React from 'react';
import { Mail, Phone } from 'lucide-react';

const Quote = () => {
    return (
        <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 font-heading text-center">견적 문의</h1>

            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Project Quote</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        오피스, 카페, 라운지 등 공간의 목적에 맞는 가구 큐레이션과 견적을 제안해 드립니다.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center text-lime-700">
                                <Phone size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Call Us</p>
                                <p className="font-bold">02-1234-5678</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center text-lime-700">
                                <Mail size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Email Us</p>
                                <p className="font-bold">hello@respace.kr</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-8 rounded-3xl">
                    <div className="space-y-4">
                        <input type="text" placeholder="이름 / 회사명" className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                        <input type="email" placeholder="이메일" className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                        <input type="tel" placeholder="연락처" className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                        <textarea placeholder="문의 내용 (공간 유형, 예산 등)" rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200"></textarea>
                        <button className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-900 transition-colors">
                            문의하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quote;
