'use client';

import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

// Fix default marker icon issue with webpack/next.js
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LeafletMapInnerProps {
  lat: number;
  lng: number;
  name: string;
  address?: string;
  zoom?: number;
  className?: string;
}

export default function LeafletMapInner({
  lat,
  lng,
  name,
  address,
  zoom = 16,
  className = '',
}: LeafletMapInnerProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={zoom}
      scrollWheelZoom={false}
      className={className}
      style={{ minHeight: 350, width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={defaultIcon}>
        <Popup>
          <strong>{name}</strong>
          {address && (
            <>
              <br />
              <span className="text-sm text-gray-600">{address}</span>
            </>
          )}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
