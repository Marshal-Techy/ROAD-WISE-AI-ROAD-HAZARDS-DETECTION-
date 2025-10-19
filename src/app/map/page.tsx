import MapLoader from './MapLoader';

export default function MapPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-headline font-bold">Hazard Map</h1>
        <p className="text-muted-foreground">Interactive map showing detected hazards with real-time updates.</p>
      </div>
      <div className="relative h-[600px] w-full bg-muted rounded-md overflow-hidden shadow-lg">
          <MapLoader />
      </div>
    </div>
  );
}
