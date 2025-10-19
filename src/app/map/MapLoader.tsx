'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// Dynamically import the HazardMap component to ensure it's only loaded on the client side.
const HazardMap = dynamic(() => import('./HazardMap'), {
    loading: () => <p className="text-center p-4">Loading map...</p>,
    ssr: false // This is crucial to prevent server-side rendering.
});

const MapLoader = () => {
    return <HazardMap />;
};

export default MapLoader;
