'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function MapLoader() {
  const HazardMap = useMemo(
    () =>
      dynamic(() => import('./HazardMap'), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

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