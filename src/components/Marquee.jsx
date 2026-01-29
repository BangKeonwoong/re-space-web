import React from 'react';
import { Star } from 'lucide-react';

const Marquee = () => {
    return (
        <div className="bg-black py-12 overflow-hidden flex whitespace-nowrap relative z-10 border-y border-white/10 gap-16">
            <div className="animate-marquee flex gap-16 text-white/90 text-4xl md:text-6xl font-black uppercase tracking-wider items-center font-heading">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <React.Fragment key={i}>
                        <span className="hover:text-lime-400 transition-colors duration-300">정품 인증</span>
                        <Star size={24} className="text-lime-400 fill-lime-400 animate-spin-slow" />
                        <span className="text-gray-600 stroke-black">최상의 품질</span>
                        <Star size={24} className="text-lime-400 fill-lime-400 animate-spin-slow" />
                        <span className="hover:text-lime-400 transition-colors duration-300">합리적인 가격</span>
                        <Star size={24} className="text-lime-400 fill-lime-400 animate-spin-slow" />
                    </React.Fragment>
                ))}
            </div>
            <div className="animate-marquee flex gap-16 text-white/90 text-4xl md:text-6xl font-black uppercase tracking-wider items-center font-heading" aria-hidden="true">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <React.Fragment key={i}>
                        <span className="hover:text-lime-400 transition-colors duration-300">정품 인증</span>
                        <Star size={24} className="text-lime-400 fill-lime-400 animate-spin-slow" />
                        <span className="text-gray-600 stroke-black">최상의 품질</span>
                        <Star size={24} className="text-lime-400 fill-lime-400 animate-spin-slow" />
                        <span className="hover:text-lime-400 transition-colors duration-300">합리적인 가격</span>
                        <Star size={24} className="text-lime-400 fill-lime-400 animate-spin-slow" />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default Marquee;
