'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from '@/components/ui/card';

const HazardMap = dynamic(() => import('./HazardMap'), {
  ssr: false,
  loading: () => <div className="aspect-[4/3] w-full bg-muted flex items-center justify-center"><p>Loading map...</p></div>,
});

export default function MapLoader() {
  const mapCenter: [number, number] = [23.8, 78.5]; // Centered on Madhya Pradesh, India

  const displayMap = useMemo(() => (
      <MapContainer center={mapCenter} zoom={7} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <HazardMap />
      </MapContainer>
  ), []);

  return (
    <Card className="shadow-lg">
      <CardContent className="p-2">
        <div className="relative w-full aspect-[4/3] bg-muted rounded-md overflow-hidden">
          {displayMap}
        </div>
      </CardContent>
    </Card>
  );
}
