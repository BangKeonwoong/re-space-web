import React from 'react';
import TiltCard from './TiltCard';
import { Box } from 'lucide-react';

const BentoGrid = () => {
    return (
        <section className="py-20 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 font-heading">
                            엄선된 <span className="text-gray-300">컬렉션</span>
                        </h2>
                        <p className="text-gray-500">당신의 공간을 위한 특별한 제안.</p>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        {['허먼밀러', '비트라', '놀', 'USM'].map((brand) => (
                            <button key={brand} className="px-5 py-2 rounded-full border border-gray-200 hover:bg-black hover:text-white transition-colors text-sm font-medium">
                                {brand}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 h-auto md:h-[900px]">

                    {/* Card 1: Highlight S-Class Refurb */}
                    <TiltCard
                        className="md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto"
                        title="S급 리퍼브"
                        subtitle="새 제품처럼 완벽하게 복원된 컨디션."
                        image="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1000&auto=format&fit=crop"
                    >
                        <div className="absolute top-6 left-6 px-3 py-1 bg-lime-400 text-black text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
                            강력 추천
                        </div>
                    </TiltCard>

                    {/* Card 2: Product Item */}
                    <TiltCard
                        className="md:col-span-1 md:row-span-1 aspect-square"
                        title="허먼밀러 에어론"
                        subtitle="850,000원 • 풀옵션"
                        image="https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=1000&auto=format&fit=crop"
                    />

                    {/* Card 3: Best Seller */}
                    <TiltCard
                        className="md:col-span-1 md:row-span-2 aspect-[1/2] md:aspect-auto"
                        title="USM 할러 시스템"
                        subtitle="1,450,000원 • 퓨어 화이트"
                        image="https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1000&auto=format&fit=crop"
                    />

                    {/* Card 4: Selling Service (Focus on Cash/Value) */}
                    <TiltCard
                        className="md:col-span-2 md:row-span-1 aspect-[2/1] md:aspect-auto"
                        title="가구 판매하기"
                        subtitle="사진 한 장으로 바로 견적 확인. 빈티지 가구를 현금으로 교환하세요."
                        image="https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=1000&auto=format&fit=crop"
                    >
                        <div className="absolute top-6 left-6 px-3 py-1 bg-white text-black text-xs font-bold rounded-full uppercase tracking-wider shadow-md">
                            즉시 지급
                        </div>
                    </TiltCard>

                    {/* Card 5: Product Item */}
                    <TiltCard
                        className="md:col-span-1 md:row-span-1 aspect-square"
                        title="루이스폴센 PH5"
                        subtitle="720,000원 • 모던 화이트"
                        image="https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?q=80&w=1000&auto=format&fit=crop"
                    />

                    {/* Card 6: New Arrivals (Replaced Eco Index) */}
                    <div className="md:col-span-1 md:row-span-1 bg-lime-300 rounded-3xl p-8 flex flex-col justify-between border border-black/10 group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="flex justify-between items-start">
                            <Box size={32} className="text-black group-hover:rotate-12 transition-transform duration-300" />
                            <span className="font-black text-5xl tracking-tighter mix-blend-multiply opacity-50">150+</span>
                        </div>
                        <div>
                            <p className="font-bold text-xl leading-tight mb-4">이번 주<br />신규 입고</p>
                            <div className="w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-black h-full w-[80%] animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default BentoGrid;
