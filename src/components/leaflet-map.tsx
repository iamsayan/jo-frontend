'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

interface LeafletMapProps {
  lat: number;
  lng: number;
  name: string;
  address?: string;
  zoom?: number;
  className?: string;
}

const MapInner: ComponentType<LeafletMapProps> = dynamic(
  () => import('@/components/leaflet-map-inner'),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex items-center justify-center rounded-2xl bg-gray-100"
        style={{ minHeight: 350 }}
      >
        <div className="text-gray-400">Loading map...</div>
      </div>
    ),
  }
);

export default function LeafletMap(props: LeafletMapProps) {
  return <MapInner {...props} />;
}
