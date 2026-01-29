import React from 'react';
import ProductCatalog from '../components/ProductCatalog';

const NewArrivals = () => {
    return (
        <ProductCatalog
            title="상품 리스트"
            description="카테고리별로 신상품, 리퍼브, 빈티지 제품을 확인하세요."
            initialCategory="all"
        />
    );
};

export default NewArrivals;
