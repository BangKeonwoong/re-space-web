import React from 'react';

const ProductManager = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold font-heading">상품 관리</h1>
                <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
                    + 상품 등록
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-medium text-gray-500">상품 정보</th>
                            <th className="p-4 font-medium text-gray-500">카테고리</th>
                            <th className="p-4 font-medium text-gray-500">가격</th>
                            <th className="p-4 font-medium text-gray-500">상태</th>
                            <th className="p-4 font-medium text-gray-500">재고</th>
                            <th className="p-4 font-medium text-gray-500">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {/* Dummy Row */}
                        <tr>
                            <td className="p-4 flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
                                <span className="font-medium">Herman Miller Aeron</span>
                            </td>
                            <td className="p-4 text-gray-500">Chair</td>
                            <td className="p-4">₩850,000</td>
                            <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">판매중</span></td>
                            <td className="p-4">12</td>
                            <td className="p-4">
                                <button className="text-gray-400 hover:text-black">수정</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductManager;
