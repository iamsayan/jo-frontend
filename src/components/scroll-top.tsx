'use client';

import React, { useEffect, useState } from 'react';
import { LuArrowUp } from 'react-icons/lu';

const ScrollToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        const controller = new AbortController();

        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(() => {
                    setIsVisible(window.scrollY >= 20);
                    ticking = false;
                });
            }
        };

        onScroll();
        window.addEventListener('scroll', onScroll, {
            signal: controller.signal,
            passive: true,
        });

        return () => controller.abort();
    }, []);

    const scrollToTop = () => {
        isVisible &&
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
    };

    return (
        <button
            className={`fixed right-10 bottom-10 flex cursor-pointer items-center justify-center rounded-lg bg-yellow-400 p-3 text-black shadow-md transition-opacity duration-200 outline-none ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={scrollToTop}
        >
            <LuArrowUp />
        </button>
    );
};

export default ScrollToTopButton;
