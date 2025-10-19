'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const HazardMap = dynamic(() => import('./HazardMap'), {
  ssr: false,
  loading: () => <div className="aspect-[4/3] w-full bg-muted flex items-center justify-center"><p>Loading map...</p></div>,
});

export default function MapLoader() {
  // useMemo is not strictly necessary here anymore but doesn't hurt.
  const displayMap = useMemo(() => <HazardMap />, []);

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
