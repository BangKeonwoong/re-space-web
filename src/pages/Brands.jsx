import React from 'react';

const Brands = () => {
    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-12 font-heading text-center">Brands We Love</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Herman Miller', 'Vitra', 'Knoll', 'USM', 'Louis Poulsen', 'Fritz Hansen', 'Artek', 'Muuto'].map((brand) => (
                    <div key={brand} className="aspect-[3/2] bg-gray-50 rounded-2xl flex items-center justify-center font-bold text-xl text-gray-400 hover:bg-black hover:text-white transition-colors cursor-pointer">
                        {brand}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Brands;
