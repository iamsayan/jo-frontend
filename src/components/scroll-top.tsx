'use client';

import React from 'react';
import ScrollToTop from 'react-scroll-to-top';

const ScrollTop: React.FC = () => (
    <ScrollToTop
        smooth
        className="flex items-center justify-center !bg-yellow-400"
        width="15"
        height="15"
        viewBox="0 0 20 20"
        svgPath="M10,0L9.4,0.6L0.8,9.1l1.2,1.2l7.1-7.1V20h1.7V3.3l7.1,7.1l1.2-1.2l-8.5-8.5L10,0z"
    />
);

export default ScrollTop;
