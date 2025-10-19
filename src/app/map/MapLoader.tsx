'use client';

import dynamic from 'next/dynamic';

const HazardMap = dynamic(() => import('./HazardMap'), {
  ssr: false,
  loading: () => <p className="text-center p-4">Loading map...</p>,
});

const MapLoader = () => {
    return <HazardMap />;
};

export default MapLoader;
