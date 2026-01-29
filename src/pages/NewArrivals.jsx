import React from 'react';

const NewArrivals = () => {
    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 font-heading">신상품</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="bg-gray-50 rounded-2xl p-4 group cursor-pointer">
                        <div className="aspect-square bg-gray-200 rounded-xl mb-4 overflow-hidden relative">
                            {/* Placeholder Image */}
                            <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                        </div>
                        <h3 className="font-bold text-lg mb-1">Product Name {item}</h3>
                        <p className="text-gray-500">₩580,000</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewArrivals;
