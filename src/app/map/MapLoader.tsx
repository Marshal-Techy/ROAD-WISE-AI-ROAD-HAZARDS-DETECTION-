'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// Use useMemo to ensure the component is loaded only once client-side.
const MapLoader = () => {
    const HazardMap = useMemo(() => dynamic(() => import('./HazardMap'), {
        ssr: false,
        loading: () => <p className="text-center p-4">Loading map...</p>,
    }), []);

    return <HazardMap />;
};

export default MapLoader;
