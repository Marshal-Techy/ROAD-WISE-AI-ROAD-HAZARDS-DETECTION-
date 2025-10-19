'use client';

import { useEffect, useRef } from 'react';
import L, { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ReactDOMServer from 'react-dom/server';

import PotholeIcon from '@/components/icons/PotholeIcon';
import SpeedBreakerIcon from '@/components/icons/SpeedBreakerIcon';
import DebrisIcon from '@/components/icons/DebrisIcon';
import { cn } from '@/lib/utils';
import { MapPin, AlertCircle, Clock } from 'lucide-react';

// Manually set icon images to prevent build issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


type HazardType = 'Pothole' | 'Speed Breaker' | 'Debris';
type Severity = 'Low' | 'Medium' | 'High';

interface Hazard {
  id: number;
  type: HazardType;
  location: { lat: number; lon: number };
  severity: Severity;
  timeDetected: string;
}

const mockHazards: Hazard[] = [
  { id: 1, type: 'Pothole', location: { lat: 23.2599, lon: 77.4126 }, severity: 'High', timeDetected: '2 mins ago' },
  { id: 2, type: 'Speed Breaker', location: { lat: 23.1793, lon: 75.7849 }, severity: 'Medium', timeDetected: '5 mins ago' },
  { id: 3, type: 'Debris', location: { lat: 22.7196, lon: 75.8577 }, severity: 'Low', timeDetected: '10 mins ago' },
  { id: 4, type: 'Pothole', location: { lat: 24.5854, lon: 73.7125 }, severity: 'Medium', timeDetected: '1 hour ago' },
];

const getSeverityColor = (severity: Severity) => {
    switch (severity) {
        case 'High': return 'text-destructive';
        case 'Medium': return 'text-yellow-400';
        case 'Low': return 'text-green-500';
    }
}

const HazardMarkerIcon = ({ type, severity }: { type: HazardType, severity: Severity }) => {
  const icon = () => {
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
  }

  return divIcon({
    html: ReactDOMServer.renderToString(
        <div className="relative w-10 h-10 -translate-x-1/2 -translate-y-1/2 transform transition-transform hover:scale-125 focus:outline-none">
            <div className="absolute inset-0 bg-background/50 rounded-full blur-sm animate-pulse"></div>
            <div className={cn("relative w-full h-full p-1.5 rounded-full shadow-lg", getSeverityColor(severity), 'bg-card')}>
                {icon()}
            </div>
        </div>
    ),
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

export default function HazardMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const mapCenter: [number, number] = [23.8, 78.5]; // Centered on Madhya Pradesh, India

    useEffect(() => {
      // Ensure this code only runs in the browser
      if (mapRef.current && !mapInstanceRef.current) {
        
        // Create map instance
        mapInstanceRef.current = L.map(mapRef.current).setView(mapCenter, 7);

        // Add tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstanceRef.current);

        // Add markers
        mockHazards.forEach(hazard => {
            const popupContent = ReactDOMServer.renderToString(
                <div className="space-y-2 w-56 bg-card text-card-foreground p-1">
                    <h3 className="font-headline font-semibold leading-none tracking-tight">{hazard.type}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{hazard.location.lat}, {hazard.location.lon}</span>
                    </div>
                    <div className={cn("flex items-center text-sm", getSeverityColor(hazard.severity))}>
                        <AlertCircle className="mr-2 h-4 w-4" />
                        <span>Severity: {hazard.severity}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Detected: {hazard.timeDetected}</span>
                    </div>
                </div>
            );

            L.marker([hazard.location.lat, hazard.location.lon], {
                icon: HazardMarkerIcon({ type: hazard.type, severity: hazard.severity })
            })
            .addTo(mapInstanceRef.current)
            .bindPopup(popupContent, {
                className: 'bg-card border-none rounded-lg shadow-lg'
            });
        });
      }

      // Cleanup function to run when component unmounts
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }, [mapCenter]);

    // The Popup style in Leaflet can sometimes be buggy with custom classNames.
    // Adding a global style block to ensure our popup style applies correctly.
    return (
      <>
        <style>{`
          .leaflet-popup-content-wrapper {
            background: hsl(var(--card));
            color: hsl(var(--card-foreground));
            border-radius: var(--radius);
            box-shadow: none;
            border: 1px solid hsl(var(--border));
          }
          .leaflet-popup-content {
            margin: 0;
          }
          .leaflet-popup-tip-container {
            display: none;
          }
        `}</style>
        <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      </>
    );
}