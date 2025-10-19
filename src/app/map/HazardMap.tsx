'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ReactDOMServer from 'react-dom/server';

import { cn } from '@/lib/utils';
import { MapPin, AlertCircle } from 'lucide-react';

// Manually set icon images to prevent build issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

type Severity = 'Low' | 'Medium' | 'High';

interface PotholePath {
  id: number;
  type: 'Pothole';
  path: { lat: number; lon: number }[];
  severity: Severity;
  roadName: string;
}

const mockPotholePaths: PotholePath[] = [
  { id: 1, type: 'Pothole', path: [{ lat: 12.9716, lon: 77.5946 }, { lat: 12.9720, lon: 77.6000 }], severity: 'Medium', roadName: 'Brigade Road' },
  { id: 2, type: 'Pothole', path: [{ lat: 12.9757, lon: 77.5929 }, { lat: 12.9793, lon: 77.5913 }], severity: 'High', roadName: 'Palace Road' },
  { id: 3, type: 'Pothole', path: [{ lat: 12.9698, lon: 77.5997 }, { lat: 12.9705, lon: 77.6030 }], severity: 'Low', roadName: 'Residency Road' },
  { id: 4, type: 'Pothole', path: [{ lat: 12.9507, lon: 77.6207 }, { lat: 12.9525, lon: 77.6250 }], severity: 'High', roadName: 'Koramangala 80 Ft Rd' },
  { id: 5, type: 'Pothole', path: [{ lat: 12.9345, lon: 77.6247 }, { lat: 12.9370, lon: 77.6200 }], severity: 'Medium', roadName: '1st A Main Rd, Koramangala' },
  { id: 6, type: 'Pothole', path: [{ lat: 12.9926, lon: 77.5912 }, { lat: 12.9950, lon: 77.5880 }], severity: 'Low', roadName: 'Bellary Road' },
  { id: 7, type: 'Pothole', path: [{ lat: 12.9240, lon: 77.5807 }, { lat: 12.9275, lon: 77.5830 }], severity: 'High', roadName: 'Bannerghatta Main Road' },
];


export default function HazardMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const mapCenter: [number, number] = [12.9716, 77.5946]; // Centered on Bengaluru

    useEffect(() => {
      if (typeof window === 'undefined') return;
      if (mapRef.current && !mapInstanceRef.current) {
        
        const map = L.map(mapRef.current).setView(mapCenter, 13);
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }).addTo(map);

        mockPotholePaths.forEach(potholePath => {
            const latLngs = potholePath.path.map(p => L.latLng(p.lat, p.lon));

            // Base red line
            const redLine = L.polyline(latLngs, {
              color: '#ef4444', // red-500
              weight: 5,
              opacity: 0.9
            }).addTo(map);

            // Black dots on top
            const blackDots = L.polyline(latLngs, {
              color: 'black',
              weight: 5,
              opacity: 0.9,
              dashArray: '0, 10', // This creates the dots effect
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
            
            // Bind popup to the top layer (black dots) so it's clickable
            blackDots.bindPopup(popupContent, {
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
