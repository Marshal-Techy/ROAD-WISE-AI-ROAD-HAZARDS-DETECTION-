import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { MoveRight, PlayCircle, Waypoints } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === "hero-background");

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="relative w-full h-[70vh] md:h-[80vh] flex items-center justify-center text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                priority
                data-ai-hint={heroImage.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
            <div className="absolute inset-0 bg-primary/40"></div>
          </div>
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4 text-shadow-lg animate-fade-in-down">
              AI-Powered Road Safety Assistant
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-primary-foreground/90 mb-8 animate-fade-in-up">
              Detect • Predict • Alert – Drive Smarter, Drive Safer.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 transition-transform duration-300 hover:scale-105 shadow-lg">
                <Link href="/detection">
                  <PlayCircle />
                  Start Detection
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="transition-transform duration-300 hover:scale-105 shadow-lg">
                <Link href="/map">
                  <Waypoints />
                  View Map
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/10 transition-transform duration-300 hover:scale-105">
                <Link href="/features">
                  Learn More
                  <MoveRight />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
