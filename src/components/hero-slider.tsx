'use client';

import React, { ReactNode, useEffect, useState } from 'react';

import RemoteImage from '@/components/remote-image';

const images = [
  //{ src: 'static/20241107-042519.jpg', alt: 'Mankundu' },
  { src: 'static/20241107-040207.jpg', alt: 'Boro' },
  { src: 'static/20241107-034735.jpg', alt: 'Kundughat Dalan' },
  { src: 'static/20241107-034843.jpg', alt: 'Lalbagan Padripara' },
  { src: 'static/20241107-035443.jpg', alt: 'Boro Panchanantala' },
] as const;

interface ImageSliderProps {
  children?: ReactNode;
}

const HeroSlider: React.FC<ImageSliderProps> = ({ children }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero relative min-h-full w-full overflow-hidden lg:min-h-screen">
      <div className="slider-container">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 h-full w-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <RemoteImage
              src={image.src}
              alt={image.alt}
              fill={true}
              quality={90}
              lazy={false}
              className="object-cover"
              loaderPlaceholder={false}
              tquality={90}
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
        ))}
      </div>
      {children}
    </div>
  );
};

export default HeroSlider;
