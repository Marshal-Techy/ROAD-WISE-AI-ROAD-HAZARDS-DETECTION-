import HowItWorksDiagram from "./HowItWorksDiagram";

export default function HowItWorksPage() {
  return (
    <div className="bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-headline font-bold">How It Works</h1>
          <p className="text-muted-foreground mt-2">A seamless flow from detection to alert.</p>
        </div>
        
        <HowItWorksDiagram />

        <div className="max-w-3xl mx-auto mt-12 text-center bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-headline font-semibold mb-2">Edge–Cloud AI Architecture</h2>
            <p className="text-muted-foreground">
                Our hybrid architecture ensures ultra-low-latency hazard detection by processing video on-device (edge), while leveraging the cloud for complex analysis and data aggregation. This privacy-first approach minimizes data transfer and keeps you safe, securely.
            </p>
        </div>
      </div>
    </div>
  );
}
