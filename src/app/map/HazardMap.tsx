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
    { id: 5, type: 'Pothole', location: { lat: 23.27, lon: 77.42 }, severity: 'High', timeDetected: '3 mins ago' },
    { id: 6, type: 'Debris', location: { lat: 23.185, lon: 75.79 }, severity: 'Low', timeDetected: '15 mins ago' },
    { id: 7, type: 'Speed Breaker', location: { lat: 22.725, lon: 75.86 }, severity: 'Medium', timeDetected: '8 mins ago' },
    { id: 8, type: 'Pothole', location: { lat: 24.59, lon: 73.72 }, severity: 'High', timeDetected: '2 hours ago' },
    { id: 9, type: 'Pothole', location: { lat: 22.71, lon: 75.85 }, severity: 'Low', timeDetected: '30 mins ago' },
    { id: 10, type: 'Debris', location: { lat: 23.25, lon: 77.40 }, severity: 'Medium', timeDetected: '45 mins ago' },
    { id: 11, type: 'Pothole', location: { lat: 19.0760, lon: 72.8777 }, severity: 'High', timeDetected: '5 mins ago' }, // Mumbai
    { id: 12, type: 'Speed Breaker', location: { lat: 28.6139, lon: 77.2090 }, severity: 'Medium', timeDetected: '12 mins ago' }, // Delhi
    { id: 13, type: 'Debris', location: { lat: 12.9716, lon: 77.5946 }, severity: 'Low', timeDetected: '25 mins ago' }, // Bangalore
    { id: 14, type: 'Pothole', location: { lat: 13.0827, lon: 80.2707 }, severity: 'High', timeDetected: '8 mins ago' }, // Chennai
    { id: 15, type: 'Speed Breaker', location: { lat: 22.5726, lon: 88.3639 }, severity: 'Medium', timeDetected: '20 mins ago' }, // Kolkata
];

const getSeverityColor = (severity: Severity) => {
    switch (severity) {
        case 'High': return 'text-destructive';
        case 'Medium': return 'text-yellow-500';
        case 'Low': return 'text-green-600';
    }
}
const getGlowColor = (severity: Severity) => {
    switch (severity) {
        case 'High': return 'shadow-[0_0_15px_3px_rgba(255,50,50,0.7)]';
        case 'Medium': return 'shadow-[0_0_15px_3px_rgba(255,200,0,0.7)]';
        case 'Low': return 'shadow-[0_0_15px_3px_rgba(50,200,50,0.7)]';
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
             <div className={cn("absolute inset-0 rounded-full blur-sm", getGlowColor(severity))}></div>
            <div className={cn("relative w-full h-full p-1.5 rounded-full shadow-lg", getSeverityColor(severity), 'bg-card/90 backdrop-blur-sm')}>
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
    const mapCenter: [number, number] = [23.0, 78.0]; // Centered on India

    useEffect(() => {
      if (typeof window === 'undefined') return;
      if (mapRef.current && !mapInstanceRef.current) {
        
        mapInstanceRef.current = L.map(mapRef.current).setView(mapCenter, 6);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }).addTo(mapInstanceRef.current);

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

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }, []);

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
