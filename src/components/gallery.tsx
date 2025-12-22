'use client';

import lgAutoplay from 'lightgallery/plugins/autoplay';
import lgFullscreen from 'lightgallery/plugins/fullscreen';
import lgZoom from 'lightgallery/plugins/zoom';
import LightGallery, { LightGalleryProps } from 'lightgallery/react';

import 'lightgallery/css/lg-autoplay.css';
import 'lightgallery/css/lg-fullscreen.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lightgallery.css';

function Gallery({ children, ...props }: LightGalleryProps) {
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
