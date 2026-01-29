import React from 'react';
import { Tag, Wallet, Truck } from 'lucide-react';

const Process = () => {
    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-lime-600 font-bold tracking-widest uppercase text-sm">이용 방법</span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-2 font-heading">쉽고 빠른 가이드</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Tag size={40} />,
                            title: "스마트한 쇼핑",
                            desc: "S급 리퍼브부터 유니크한 빈티지까지, 검증된 가구를 합리적인 가격에 구매하세요."
                        },
                        {
                            icon: <Wallet size={40} />,
                            title: "고가 매입 서비스",
                            desc: "사용하던 가구 사진을 업로드하세요. AI가 시세를 분석하여 최고가 견적을 제안합니다."
                        },
                        {
                            icon: <Truck size={40} />,
                            title: "원스톱 서비스",
                            desc: "복잡한 운송부터 전문 설치까지, Re:Space 팀이 모든 과정을 책임집니다."
                        }
                    ].map((step, idx) => (
                        <div key={idx}
                            className="bg-white p-10 rounded-3xl border border-gray-100 hover:border-lime-400 transition-all duration-300 shadow-sm hover:shadow-2xl group hover:-translate-y-2">
                            <div
                                className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-gray-800 group-hover:bg-lime-400 group-hover:text-black transition-colors duration-300">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-heading">{idx + 1}. {step.title}</h3>
                            <p className="text-gray-500 leading-relaxed font-sans">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Process;
