'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';

// Dynamically import the HazardMap component and disable SSR
const HazardMap = dynamic(() => import('./HazardMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <p>Loading map...</p>
    </div>
  ),
});

export default function MapLoader() {
  return (
    <Card className="shadow-lg">
      <CardContent className="p-2">
        <div className="relative h-[600px] w-full bg-muted rounded-md overflow-hidden">
          <HazardMap />
        </div>
      </CardContent>
    </Card>
  );
}
