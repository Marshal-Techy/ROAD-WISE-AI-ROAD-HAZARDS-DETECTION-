import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, MapPin, Volume2, EyeOff, Replace, LineChart } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface Feature {
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Bot,
    title: 'AI-Powered Detection',
    description: 'Utilizes state-of-the-art YOLO models to identify road hazards with high accuracy in real-time.',
  },
  {
    icon: MapPin,
    title: 'GPS Geo-Tagging',
    description: 'Every detected hazard is instantly tagged with precise GPS coordinates for mapping and analysis.',
  },
  {
    icon: Volume2,
    title: 'Real-Time Voice Alerts',
    description: 'Provides timely, context-aware voice notifications to drivers, minimizing distractions.',
  },
  {
    icon: EyeOff,
    title: 'Privacy Blur',
    description: 'Automatically blurs faces and license plates from video feeds to protect privacy.',
  },
  {
    icon: Replace,
    title: 'Smart Deduplication',
    description: 'Intelligent algorithms prevent duplicate alerts for the same hazard, ensuring a smooth user experience.',
  },
  {
    icon: LineChart,
    title: 'Predictive Analytics',
    description: 'Leverages historical data to predict potential hazard zones and suggest safer routes.',
  },
];

const FeaturesPage = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold">Core Features</h1>
        <p className="text-muted-foreground mt-2">Discover the technology that makes your drive safer.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="flex flex-col text-center items-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                <feature.icon className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturesPage;
