'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin, Gauge, AlertTriangle, Volume2, Mic } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

type Hazard = {
  id: number;
  type: string;
  confidence: number;
  box: { top: string; left: string; width: string; height:string; };
};


// Static hazards matching the new background image
const staticHazards: Hazard[] = [
  {
    "id": 1,
    "type": "Pothole",
    "confidence": 0.92,
    "box": { "top": "50%", "left": "45%", "width": "40%", "height": "25%" }
  },
  {
    "id": 2,
    "type": "Pothole",
    "confidence": 0.88,
    "box": { "top": "45%", "left": "15%", "width": "20%", "height": "15%" }
  },
  {
    "id": 3,
    "type": "Pothole",
    "confidence": 0.85,
    "box": { "top": "78%", "left": "5%", "width": "60%", "height": "20%" }
  },
  {
    "id": 4,
    "type": "Pothole",
    "confidence": 0.78,
    "box": { "top": "42%", "left": "70%", "width": "25%", "height": "12%" }
  }
];


export default function DetectionDashboard() {
  const [speed, setSpeed] = useState(60);
  const [gps, setGps] = useState({ lat: 12.9716, lon: 77.5946 });
  const [alertDistance, setAlertDistance] = useState(150);
  const [alertLevel, setAlertLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [isVoiceAlertActive, setIsVoiceAlertActive] = useState(false);

  const cameraFeedImage = PlaceHolderImages.find((p) => p.id === 'camera-feed-potholes');

  useEffect(() => {
    const speedInterval = setInterval(() => {
      setSpeed((prev) => {
        const change = Math.random() * 10 - 5;
        const newSpeed = prev + change;
        return Math.max(0, Math.min(120, newSpeed));
      });
    }, 2000);

    const gpsInterval = setInterval(() => {
        setGps(prev => ({
            lat: prev.lat + (Math.random() - 0.5) * 0.001,
            lon: prev.lon + (Math.random() - 0.5) * 0.001,
        }))
    }, 5000);

    return () => {
      clearInterval(speedInterval);
      clearInterval(gpsInterval);
    };
  }, []);

  useEffect(() => {
    // Client-side calculation to replace the AI call
    const calculateAlerts = () => {
      let distance, level: 'LOW' | 'MEDIUM' | 'HIGH';
      if (speed > 80) {
        distance = 250;
        level = 'HIGH';
      } else if (speed > 40) {
        distance = 150;
        level = 'MEDIUM';
      } else {
        distance = 75;
        level = 'LOW';
      }
      setAlertDistance(distance);
      setAlertLevel(level);
    };
    
    calculateAlerts();
  }, [speed]);

  useEffect(() => {
    // Set the static hazards on mount
    setHazards(staticHazards);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (hazards.length > 0) {
      setIsVoiceAlertActive(true);
      timeoutId = setTimeout(() => setIsVoiceAlertActive(false), 4000); // Extended duration
    }
    return () => clearTimeout(timeoutId);
  }, [hazards]);


  const getAlertColor = () => {
    switch (alertLevel) {
      case 'HIGH': return 'bg-destructive text-destructive-foreground';
      case 'MEDIUM': return 'bg-yellow-500 text-black';
      case 'LOW': return 'bg-accent text-accent-foreground';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
       <div className="text-center mb-8">
        <h1 className="text-4xl font-headline font-bold">Real-Time Detection Dashboard</h1>
        <p className="text-muted-foreground">Live simulation of RoadWise AI in action.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </div>
                Live Camera Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
                {cameraFeedImage && (
                  <Image
                    src={cameraFeedImage.imageUrl}
                    alt={cameraFeedImage.description}
                    data-ai-hint={cameraFeedImage.imageHint}
                    fill
                    className="object-cover"
                  />
                )}
                {hazards.map((hazard) => (
                  <div
                    key={hazard.id}
                    className="absolute border-2 border-accent rounded-md transition-all duration-500"
                    style={{ ...hazard.box }}
                  >
                    <Badge variant="default" className="absolute -top-7 left-0 bg-accent text-accent-foreground">
                      {hazard.type} {(hazard.confidence * 100).toFixed(1)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Vehicle Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className='flex items-center gap-3'>
                        <Gauge className="text-primary" />
                        <span className="font-medium">Speed</span>
                    </div>
                    <span className="font-mono text-lg font-bold">{speed.toFixed(1)} km/h</span>
                </div>
                <Progress value={speed / 1.2} />

                <div className="flex items-center justify-between">
                    <div className='flex items-center gap-3'>
                        <MapPin className="text-primary" />
                        <span className="font-medium">GPS</span>
                    </div>
                    <span className="font-mono text-sm">{gps.lat.toFixed(4)}, {gps.lon.toFixed(4)}</span>
                </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Alert System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className='flex items-center gap-3'>
                        <AlertTriangle className="text-primary" />
                        <span className="font-medium">Alert Distance</span>
                    </div>
                    <span className="font-mono text-lg font-bold">{alertDistance} m</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className='flex items-center gap-3'>
                        <Mic className="text-primary" />
                        <span className="font-medium">Alert Level</span>
                    </div>
                    <Badge className={cn("text-sm", getAlertColor())}>{alertLevel}</Badge>
                </div>
            </CardContent>
          </Card>
          
          {isVoiceAlertActive && (
             <Card className="bg-primary text-primary-foreground animate-pulse-intense rounded-lg">
                <CardContent className="p-4 flex items-center gap-4">
                    <Volume2 size={32} />
                    <div>
                        <p className="font-bold">Voice Alert Active</p>
                        <p className="text-sm opacity-90">Hazard detected ahead!</p>
                    </div>
                </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
