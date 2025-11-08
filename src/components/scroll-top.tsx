"use client"

import React, { useEffect, useState } from "react"
import { LuArrowUp } from "react-icons/lu";

const ScrollToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false)

    useEffect(() => {
        const controller = new AbortController();

        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(() => {
                    const next = window.scrollY >= 20;
                    setIsVisible(next);
                    ticking = false;
                });
            }
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { signal: controller.signal, passive: true });

        return () => controller.abort();
    }, []);

    const scrollToTop = () => {
        isVisible &&
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
    }

    return (
        <button
            className={`cursor-pointer flex items-center justify-center text-black bg-yellow-400 shadow-md fixed bottom-10 right-10 rounded-lg p-3 outline-none transition-opacity duration-200 ${isVisible ? "opacity-100" : "opacity-0"}`}
            onClick={scrollToTop}
        >
            <LuArrowUp />
        </button>
    )
}

export default ScrollToTopButton