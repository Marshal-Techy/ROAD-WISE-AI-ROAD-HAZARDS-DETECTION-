'use server';

/**
 * @fileOverview A flow that summarizes road conditions based on detected hazards.
 *
 * - summarizeRoadConditions - A function that summarizes road conditions.
 * - SummarizeRoadConditionsInput - The input type for the summarizeRoadConditions function.
 * - SummarizeRoadConditionsOutput - The return type for the summarizeRoadConditions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeRoadConditionsInputSchema = z.object({
  hazards: z.array(
    z.object({
      type: z.string().describe('The type of hazard (e.g., pothole, debris, speed breaker).'),
      location: z.string().describe('The GPS coordinates of the hazard.'),
      severity: z.string().describe('The severity of the hazard (e.g., low, medium, high).'),
      timeDetected: z.string().describe('The time the hazard was detected.'),
    })
  ).describe('A list of detected road hazards.'),
  currentLocation: z.string().describe('The current GPS coordinates of the driver.'),
  alertDistance: z.number().describe('The distance within which to alert the driver about hazards, in meters.'),
  speed: z.number().describe('The current speed of the driver in km/h.')
});

export type SummarizeRoadConditionsInput = z.infer<typeof SummarizeRoadConditionsInputSchema>;

const SummarizeRoadConditionsOutputSchema = z.object({
  summary: z.string().describe('A summary of the road conditions ahead, including potential hazards and their severity.'),
  alertLevel: z.string().describe('The level of alert needed (e.g., low, medium, high) based on the hazards ahead.'),
});

export type SummarizeRoadConditionsOutput = z.infer<typeof SummarizeRoadConditionsOutputSchema>;


export async function summarizeRoadConditions(input: SummarizeRoadConditionsInput): Promise<SummarizeRoadConditionsOutput> {
  return summarizeRoadConditionsFlow(input);
}

const summarizeRoadConditionsPrompt = ai.definePrompt({
  name: 'summarizeRoadConditionsPrompt',
  input: {schema: SummarizeRoadConditionsInputSchema},
  output: {schema: SummarizeRoadConditionsOutputSchema},
  prompt: `You are a road safety assistant that provides drivers with summarized reports of potential road hazards ahead.

  Based on the following detected hazards within a {{alertDistance}} meter radius of the driver's current location at {{currentLocation}}, and the driver's current speed of {{speed}} km/h, create a summary of the road conditions ahead and determine the appropriate alert level.

Hazards:
{{#each hazards}}
- Type: {{type}}, Location: {{location}}, Severity: {{severity}}, Time Detected: {{timeDetected}}
{{/each}}

Summary:
Alert Level:`, // Provide the summary and alert level here
});

const summarizeRoadConditionsFlow = ai.defineFlow(
  {
    name: 'summarizeRoadConditionsFlow',
    inputSchema: SummarizeRoadConditionsInputSchema,
    outputSchema: SummarizeRoadConditionsOutputSchema,
  },
  async input => {
    const {output} = await summarizeRoadConditionsPrompt(input);
    return output!;
  }
);
