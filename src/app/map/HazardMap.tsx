'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ReactDOMServer from 'react-dom/server';

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

interface PotholePath {
  id: number;
  type: 'Pothole';
  path: { lat: number; lon: number }[];
  severity: Severity;
  roadName: string;
}

const mockPotholePaths: PotholePath[] = [
  { id: 1, type: 'Pothole', path: [{ lat: 23.2599, lon: 77.4126 }, { lat: 23.2610, lon: 77.4150 }], severity: 'High', roadName: 'MG Road' },
  { id: 2, type: 'Pothole', path: [{ lat: 12.9716, lon: 77.5946 }, { lat: 12.9720, lon: 77.6000 }], severity: 'Medium', roadName: 'Brigade Road' },
  { id: 3, type: 'Pothole', path: [{ lat: 19.0760, lon: 72.8777 }, { lat: 19.0775, lon: 72.8800 }], severity: 'High', roadName: 'Marine Drive' },
  { id: 4, type: 'Pothole', path: [{ lat: 28.6139, lon: 77.2090 }, { lat: 28.6150, lon: 77.2110 }], severity: 'Low', roadName: 'Connaught Place Outer Circle' },
  { id: 5, type: 'Pothole', path: [{ lat: 22.5726, lon: 88.3639 }, { lat: 22.5740, lon: 88.3660 }], severity: 'Medium', roadName: 'Park Street' },
  { id: 6, type: 'Pothole', path: [{ lat: 13.0827, lon: 80.2707 }, { lat: 13.0840, lon: 80.2725 }], severity: 'High', roadName: 'Anna Salai' },
  { id: 7, type: 'Pothole', path: [{ lat: 23.2550, lon: 77.4010 }, { lat: 23.2565, lon: 77.4035 }], severity: 'Medium', roadName: 'VIP Road' },
  { id: 8, type: 'Pothole', path: [{ lat: 12.9650, lon: 77.5900 }, { lat: 12.9665, lon: 77.5920 }], severity: 'Low', roadName: 'Lalbagh Road' },
  { id: 9, type: 'Pothole', path: [{ lat: 19.0800, lon: 72.8750 }, { lat: 19.0815, lon: 72.8770 }], severity: 'High', roadName: 'Juhu Tara Road' },
];


export default function HazardMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const mapCenter: [number, number] = [23.0, 78.0]; // Centered on India

    useEffect(() => {
      if (typeof window === 'undefined') return;
      if (mapRef.current && !mapInstanceRef.current) {
        
        const map = L.map(mapRef.current).setView(mapCenter, 5);
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }).addTo(map);

        mockPotholePaths.forEach(potholePath => {
            const latLngs = potholePath.path.map(p => L.latLng(p.lat, p.lon));

            const polyline = L.polyline(latLngs, { 
                color: '#ef4444', // red-500
                weight: 6,
                opacity: 0.9,
                dashArray: '1, 8',
                lineCap: 'round'
            }).addTo(map);

            const popupContent = ReactDOMServer.renderToString(
                <div className="space-y-2 w-56 bg-card text-card-foreground p-1">
                    <h3 className="font-headline font-semibold leading-none tracking-tight">{potholePath.type} Cluster</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{potholePath.roadName}</span>
                    </div>
                    <div className={cn("flex items-center text-sm text-red-500")}>
                        <AlertCircle className="mr-2 h-4 w-4" />
                        <span>Severity: {potholePath.severity}</span>
                    </div>
                </div>
            );
            
            polyline.bindPopup(popupContent, {
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
            padding: 4px;
          }
          .leaflet-popup-tip-container {
            display: none;
          }
        `}</style>
        <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      </>
    );
}
