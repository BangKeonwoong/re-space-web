import React, { useEffect, useState } from 'react';
import { ArrowRight, MoveUpRight } from 'lucide-react';

const Hero = () => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            requestAnimationFrame(() => {
                setOffset(window.scrollY);
            });
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section className="relative pt-24 md:pt-32 pb-20 px-6 min-h-[90vh] flex flex-col justify-center overflow-hidden bg-white">
            {/* Background Gradient */}
            <div className="absolute top-1/2 right-[-10%] w-[40vw] h-[40vw] bg-gradient-to-br from-lime-200 to-transparent rounded-full blur-[100px] opacity-50 -z-10 animate-pulse pointer-events-none" />

            <div className="max-w-7xl mx-auto w-full relative z-10">
                <div className="overflow-hidden">
                    <h1
                        className="text-[14vw] leading-[0.85] font-black tracking-tighter uppercase text-black transition-transform duration-100 ease-linear font-heading"
                        style={{
                            transform: `translateX(${offset * -0.2}px)`
                        }}
                    >
                        Timeless
                    </h1>
                </div>
                <div className="overflow-hidden flex items-center gap-4 md:gap-8">
                    <div
                        className="h-[14vw] w-[28vw] sm:h-[9vw] sm:w-[18vw] min-h-12 min-w-24 bg-lime-400 rounded-full mt-2 md:mt-4 flex items-center justify-center overflow-hidden relative group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border border-black"
                        style={{ transform: `rotate(${offset * 0.1}deg)` }}
                    >
                        <div className="relative w-full h-full flex items-center justify-center">
                            <ArrowRight className="w-8 h-8 sm:w-12 sm:h-12 md:w-24 md:h-24 text-black group-hover:translate-x-32 transition-transform duration-500" />
                            <ArrowRight className="absolute w-8 h-8 sm:w-12 sm:h-12 md:w-24 md:h-24 text-black -translate-x-32 group-hover:translate-x-0 transition-transform duration-500" />
                        </div>
                    </div>
                    <h1
                        className="text-[14vw] leading-[0.85] font-black tracking-tighter uppercase transition-colors duration-300 font-heading"
                        style={{
                            transform: `translateX(${offset * 0.1}px)`,
                            color: offset > 200 ? '#84cc16' : '#e5e7eb' // Gray to Lime
                        }}
                    >
                        Design
                    </h1>
                </div>

                <div className="mt-12 sm:mt-16 md:mt-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-t border-black/10 pt-8">
                    <p className="max-w-md text-lg text-gray-800 font-medium break-keep leading-relaxed font-sans">
                        공간을 완성하는 명작. <br />
                        엄선된 하이엔드 가구를 합리적인 가격에 만나보세요.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <button className="w-full sm:w-auto justify-center px-8 py-4 bg-black text-white rounded-full font-bold hover:bg-lime-400 hover:text-black hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-xl">
                            컬렉션 보기
                            <MoveUpRight size={18} />
                        </button>
                        <button className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white border border-gray-200 text-black rounded-full font-bold hover:bg-gray-50 hover:border-black transition-all duration-300">
                            견적 받기
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
