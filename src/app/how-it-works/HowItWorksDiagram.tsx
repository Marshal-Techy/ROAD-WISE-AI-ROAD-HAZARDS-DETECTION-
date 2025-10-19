'use client';

import { Camera, Cpu, Cloud, Volume2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: Camera,
    label: "Camera Input",
    description: "Vehicle's camera captures road footage.",
  },
  {
    icon: Cpu,
    label: "Edge AI Detection",
    description: "On-device AI (YOLO) analyzes footage for hazards.",
  },
  {
    icon: Cloud,
    label: "Cloud Processing",
    description: "Hazard data is sent to the cloud for verification & mapping.",
  },
  {
    icon: Volume2,
    label: "Voice Alert",
    description: "Driver receives a real-time voice alert.",
  },
];

export default function HowItWorksDiagram() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col md:flex-row items-center w-full">
          <Card className="w-full max-w-xs md:max-w-none md:w-auto text-center shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <step.icon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-headline font-semibold">{step.label}</h3>
              <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
            </CardContent>
          </Card>
          {index < steps.length - 1 && (
            <ArrowRight className="h-8 w-8 text-muted-foreground mx-4 my-4 md:my-0 rotate-90 md:rotate-0" />
          )}
        </div>
      ))}
    </div>
  );
}
