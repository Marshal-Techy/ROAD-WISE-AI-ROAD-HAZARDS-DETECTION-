'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import PotholeIcon from '@/components/icons/PotholeIcon';
import SpeedBreakerIcon from '@/components/icons/SpeedBreakerIcon';
import DebrisIcon from '@/components/icons/DebrisIcon';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { MapPin, AlertCircle, Clock } from 'lucide-react';

type HazardType = 'Pothole' | 'Speed Breaker' | 'Debris';
type Severity = 'Low' | 'Medium' | 'High';

interface Hazard {
  id: number;
  type: HazardType;
  location: { lat: number; lon: number };
  position: { top: string; left: string };
  severity: Severity;
  timeDetected: string;
}

const mockHazards: Hazard[] = [
  { id: 1, type: 'Pothole', location: { lat: 12.974, lon: 77.601 }, position: { top: '30%', left: '50%' }, severity: 'High', timeDetected: '2 mins ago' },
  { id: 2, type: 'Speed Breaker', location: { lat: 12.969, lon: 77.592 }, position: { top: '55%', left: '42%' }, severity: 'Medium', timeDetected: '5 mins ago' },
  { id: 3, type: 'Debris', location: { lat: 12.978, lon: 77.595 }, position: { top: '25%', left: '65%' }, severity: 'Low', timeDetected: '10 mins ago' },
  { id: 4, type: 'Pothole', location: { lat: 12.965, lon: 77.610 }, position: { top: '70%', left: '75%' }, severity: 'Medium', timeDetected: '1 hour ago' },
];

const HazardIcon = ({ type }: { type: HazardType }) => {
  switch (type) {
    case 'Pothole':
      return <PotholeIcon className="w-full h-full" />;
    case 'Speed Breaker':
      return <SpeedBreakerIcon className="w-full h-full" />;
    case 'Debris':
      return <DebrisIcon className="w-full h-full" />;
    default:
      return null;
  }
};

const getSeverityColor = (severity: Severity) => {
    switch (severity) {
        case 'High': return 'text-destructive';
        case 'Medium': return 'text-yellow-500';
        case 'Low': return 'text-green-500';
    }
}

export default function HazardMap() {
  const mapImage = PlaceHolderImages.find((p) => p.id === 'map-background');

  return (
    <Card className="shadow-lg">
      <CardContent className="p-2">
        <div className="relative w-full aspect-[4/3] bg-muted rounded-md overflow-hidden">
          {mapImage && (
            <Image
              src={mapImage.imageUrl}
              alt={mapImage.description}
              data-ai-hint={mapImage.imageHint}
              fill
              className="object-cover"
            />
          )}
          {mockHazards.map((hazard) => (
            <Popover key={hazard.id}>
              <PopoverTrigger asChild>
                <button
                  className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 transform transition-transform hover:scale-125 focus:outline-none"
                  style={{ top: hazard.position.top, left: hazard.position.left }}
                >
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-background/50 rounded-full blur-sm animate-pulse"></div>
                    <div className={cn("relative w-full h-full p-1.5 rounded-full shadow-lg", getSeverityColor(hazard.severity), 'bg-background')}>
                        <HazardIcon type={hazard.type} />
                    </div>
                  </div>
                  <span className="sr-only">Hazard: {hazard.type}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-2">
                  <h3 className="font-headline font-semibold leading-none tracking-tight">{hazard.type}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{hazard.location.lat}, {hazard.location.lon}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <AlertCircle className={cn("mr-2 h-4 w-4", getSeverityColor(hazard.severity))} />
                    <span>Severity: {hazard.severity}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Detected: {hazard.timeDetected}</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
