'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ReactDOMServer from 'react-dom/server';

import { cn } from '@/lib/utils';
import { MapPin, AlertCircle, Satellite, Map as MapIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Manually set icon images to prevent build issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

type Severity = 'Low' | 'Medium' | 'High';
type MapStyle = 'light' | 'satellite';

interface PotholePath {
  id: number;
  type: 'Pothole';
  path: { lat: number; lon: number }[];
  severity: Severity;
  roadName: string;
}

const mockPotholePaths: PotholePath[] = [
    { id: 1, type: 'Pothole', path: [ { lat: 12.97194, lon: 77.5946 }, { lat: 12.9718, lon: 77.5966 }, { lat: 12.9716, lon: 77.5986 }, { lat: 12.9710, lon: 77.6000 } ], severity: 'Medium', roadName: 'Kasturba Road' },
    { id: 2, type: 'Pothole', path: [ { lat: 12.9757, lon: 77.5929 }, { lat: 12.9775, lon: 77.5922 }, { lat: 12.9793, lon: 77.5913 } ], severity: 'High', roadName: 'Palace Road' },
    { id: 3, type: 'Pothole', path: [ { lat: 12.9698, lon: 77.5997 }, { lat: 12.9699, lon: 77.6015 }, { lat: 12.9705, lon: 77.6030 } ], severity: 'Low', roadName: 'Residency Road' },
    { id: 4, type: 'Pothole', path: [ { lat: 12.9507, lon: 77.6207 }, { lat: 12.9515, lon: 77.6225 }, { lat: 12.9525, lon: 77.6250 } ], severity: 'High', roadName: '100 Feet Road, Indiranagar' },
    { id: 5, type: 'Pothole', path: [ { lat: 12.9345, lon: 77.6247 }, { lat: 12.9355, lon: 77.6225 }, { lat: 12.9370, lon: 77.6200 } ], severity: 'Medium', roadName: 'Koramangala 1st A Main Rd' },
    { id: 6, type: 'Pothole', path: [ { lat: 12.9926, lon: 77.5912 }, { lat: 12.9938, lon: 77.5900 }, { lat: 12.9950, lon: 77.5880 } ], severity: 'Low', roadName: 'Bellary Road' },
    { id: 7, type: 'Pothole', path: [ { lat: 12.9240, lon: 77.5807 }, { lat: 12.9255, lon: 77.5818 }, { lat: 12.9275, lon: 77.5830 } ], severity: 'High', roadName: 'Bannerghatta Main Road' },
];

const tileLayers: Record<MapStyle, { url: string; attribution: string }> = {
    light: {
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    },
};


export default function HazardMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const tileLayerRef = useRef<L.TileLayer | null>(null);
    const [mapStyle, setMapStyle] = useState<MapStyle>('satellite');
    const mapCenter: [number, number] = [12.9716, 77.5946]; // Centered on Bengaluru

    useEffect(() => {
      if (typeof window === 'undefined') return;
      if (mapRef.current && !mapInstanceRef.current) {
        
        const map = L.map(mapRef.current, { zoomControl: false }).setView(mapCenter, 13);
        mapInstanceRef.current = map;
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        const currentTile = tileLayers[mapStyle];
        tileLayerRef.current = L.tileLayer(currentTile.url, { attribution: currentTile.attribution }).addTo(map);

        mockPotholePaths.forEach(potholePath => {
            const latLngs = potholePath.path.map(p => L.latLng(p.lat, p.lon));

            L.polyline(latLngs, { color: '#ef4444', weight: 12, opacity: 0.3 }).addTo(map);
            L.polyline(latLngs, { color: '#ef4444', weight: 5, opacity: 0.9 }).addTo(map);
            
            const blackDots = L.polyline(latLngs, {
              color: 'black',
              weight: 5,
              opacity: 0.9,
              dashArray: '0, 10',
              lineCap: 'round'
            }).addTo(map);

            const popupContent = ReactDOMServer.renderToString(
                <div className="space-y-2 w-56 bg-card text-card-foreground p-1">
                    <h3 className="font-headline font-semibold leading-none tracking-tight">{potholePath.type} Cluster</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{potholePath.roadName}</span>
                    </div>
                    <div className={cn("flex items-center text-sm text-red-500 font-medium")}>
                        <AlertCircle className="mr-2 h-4 w-4" />
                        <span>Severity: {potholePath.severity}</span>
                    </div>
                </div>
            );
            
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (tileLayerRef.current) {
            const newTile = tileLayers[mapStyle];
            tileLayerRef.current.setUrl(newTile.url);
            tileLayerRef.current.options.attribution = newTile.attribution;
            tileLayerRef.current.redraw();
        }
    }, [mapStyle]);


    return (
      <div className="relative w-full h-full">
        <style>{`
          .leaflet-popup-content-wrapper {
            background: hsl(var(--card) / 0.8);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            color: hsl(var(--card-foreground));
            border-radius: var(--radius);
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            border: 1px solid hsl(var(--border) / 0.5);
          }
          .leaflet-popup-content {
            margin: 0;
            padding: 4px;
          }
          .leaflet-popup-tip-container {
            display: none;
          }
          .leaflet-control-zoom {
            border: 1px solid hsl(var(--border) / 0.5) !important;
            background-color: hsl(var(--card) / 0.8) !important;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
          }
          .leaflet-control-zoom a {
            color: hsl(var(--foreground)) !important;
          }
        `}</style>
        <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
        <div className="absolute top-4 right-4 z-[1000]">
            <Card className="bg-card/80 backdrop-blur-sm shadow-xl">
                <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                        <MapIcon className="text-muted-foreground" />
                        <Label htmlFor="map-style-toggle" className="font-medium text-sm">Light</Label>
                        <Switch 
                            id="map-style-toggle"
                            checked={mapStyle === 'satellite'}
                            onCheckedChange={(checked) => setMapStyle(checked ? 'satellite' : 'light')}
                        />
                        <Label htmlFor="map-style-toggle" className="font-medium text-sm">Satellite</Label>
                        <Satellite className="text-muted-foreground" />
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    );
}
