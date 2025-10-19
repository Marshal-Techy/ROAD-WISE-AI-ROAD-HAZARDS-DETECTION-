'use server';

/**
 * @fileOverview This file defines a Genkit flow for calculating an adaptive alert distance based on the driver's speed.
 *
 * - `calculateAdaptiveAlertDistance` - A function that calculates the alert distance based on the driver's speed.
 * - `AdaptiveAlertDistanceInput` - The input type for the `calculateAdaptiveAlertDistance` function.
 * - `AdaptiveAlertDistanceOutput` - The return type for the `calculateAdaptiveAlertDistance` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptiveAlertDistanceInputSchema = z.object({
  speedKmH: z
    .number()
    .describe('The current speed of the vehicle in kilometers per hour.'),
});
export type AdaptiveAlertDistanceInput = z.infer<typeof AdaptiveAlertDistanceInputSchema>;

const AdaptiveAlertDistanceOutputSchema = z.object({
  alertDistanceMeters: z
    .number()
    .describe(
      'The recommended alert distance in meters, adjusted based on the vehicle speed.'
    ),
  alertLevel: z
    .enum(['LOW', 'MEDIUM', 'HIGH'])
    .describe('The alert level based on the vehicle speed.'),
});
export type AdaptiveAlertDistanceOutput = z.infer<typeof AdaptiveAlertDistanceOutputSchema>;

export async function calculateAdaptiveAlertDistance(
  input: AdaptiveAlertDistanceInput
): Promise<AdaptiveAlertDistanceOutput> {
  return adaptiveAlertDistanceFlow(input);
}

const adaptiveAlertDistancePrompt = ai.definePrompt({
  name: 'adaptiveAlertDistancePrompt',
  input: {schema: AdaptiveAlertDistanceInputSchema},
  output: {schema: AdaptiveAlertDistanceOutputSchema},
  prompt: `You are an expert in road safety and driver assistance systems.

  Based on the driver's current speed (in kilometers per hour), you will calculate an appropriate alert distance (in meters) for potential road hazards.
  Also, determine the alert level (LOW, MEDIUM, or HIGH) based on the speed.

  Consider the following factors:
  - Higher speeds require greater alert distances to allow sufficient reaction time.
  - Lower speeds require shorter alert distances to avoid unnecessary alerts.

  Speed: {{{speedKmH}}} km/h

  Respond with the alert distance in meters and the alert level.
  `,
});

const adaptiveAlertDistanceFlow = ai.defineFlow(
  {
    name: 'adaptiveAlertDistanceFlow',
    inputSchema: AdaptiveAlertDistanceInputSchema,
    outputSchema: AdaptiveAlertDistanceOutputSchema,
  },
  async input => {
    const {output} = await adaptiveAlertDistancePrompt(input);
    return output!;
  }
);
