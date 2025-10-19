'use client';

import dynamic from 'next/dynamic';

const HazardMap = dynamic(() => import('./HazardMap'), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function MapLoader() {
  return <HazardMap />;
}
