import React from 'react';
import ProductCatalog from '../components/ProductCatalog';

const PremiumRefurb = () => {
    return (
        <ProductCatalog
            title="프리미엄 리퍼브"
            description="전문가의 손길로 다시 태어난 S급 가구만 모았습니다."
            initialCategory="premium-refurb"
        />
    );
};

export default PremiumRefurb;
