'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const MapLoader = () => {
    const Map = useMemo(() => dynamic(() => import('./HazardMap'), {
        loading: () => <p className="text-center">Loading map...</p>,
        ssr: false
    }), []);

    return <Map />;
};

export default MapLoader;