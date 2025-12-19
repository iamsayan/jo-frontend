'use client';

import React from 'react';
import LightGallery from 'lightgallery/react';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-autoplay.css';
import 'lightgallery/css/lg-fullscreen.css';

import lgZoom from 'lightgallery/plugins/zoom';
import lgAutoplay from 'lightgallery/plugins/autoplay';
import lgFullscreen from 'lightgallery/plugins/fullscreen';

interface GalleryProps {
    children: React.ReactNode;
    licenseKey?: string;
    [key: string]: any;
}

function Gallery({ children, ...props }: GalleryProps) {
    const settings = {
        mobileSettings: {
            showCloseIcon: true,
        },
        ...props,
        licenseKey: props.licenseKey || 'KRLM-9HJW-HAX-CVQZ',
    };

    return (
        <LightGallery
            plugins={[lgZoom, lgFullscreen, lgAutoplay]}
            {...settings}
            download={false}
        >
            {children}
        </LightGallery>
    );
}

export default Gallery;
