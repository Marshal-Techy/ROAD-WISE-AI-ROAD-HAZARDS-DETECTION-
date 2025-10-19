import { Waypoints } from "lucide-react";
import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-2 text-xl font-bold font-headline", className)}>
      <Waypoints className="h-6 w-6 text-primary" />
      <span className="text-foreground">RoadWise</span>
    </div>
  );
};

export default Logo;
