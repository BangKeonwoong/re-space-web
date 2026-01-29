import React from 'react';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

const Dashboard = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-8 font-heading">대시보드</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { title: "총 매출", value: "₩128,400,000", icon: <DollarSign />, color: "bg-blue-500" },
                    { title: "신규 주문", value: "148건", icon: <ShoppingBag />, color: "bg-lime-500" },
                    { title: "방문자 수", value: "12,840", icon: <Users />, color: "bg-purple-500" },
                    { title: "성장률", value: "+24.5%", icon: <TrendingUp />, color: "bg-orange-500" },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${stat.color}`}>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders Placeholder */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-lg mb-4">최근 주문 내역</h2>
                <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                    차트 또는 테이블 영역
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
