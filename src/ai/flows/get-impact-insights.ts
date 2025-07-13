'use server';

/**
 * @fileOverview A flow to get environmental impact insights for a specific electronic device.
 *
 * - getImpactInsights - A function that handles the process of getting impact insights.
 * - GetImpactInsightsInput - The input type for the getImpactInsights function.
 * - GetImpactInsightsOutput - The return type for the getImpactInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { calculateDeviceImpact, type ImpactCalculationResult } from '@/lib/impact-calculator';

const GetImpactInsightsInputSchema = z.object({
  deviceType: z.string().describe('The type of electronic device (e.g., smartphone, laptop).'),
  ageMonths: z.number().describe('The age of the device in months.'),
  condition: z.enum(['good', 'fair', 'poor']).describe('The condition of the device.'),
  region: z.string().optional(),
});
export type GetImpactInsightsInput = z.infer<typeof GetImpactInsightsInputSchema>;

const GetImpactInsightsOutputSchema = z.object({
  co2eq: z.number().describe('The estimated CO2-equivalent emissions (in kg).'),
  rawMaterials: z.object({
    gold: z.number().describe('The estimated amount of recoverable gold (in grams).'),
    copper: z.number().describe('The estimated amount of recoverable copper (in grams).'),
    rareEarths: z.number().describe('The estimated amount of recoverable rare earth materials (in grams).'),
  }).describe('The estimated amounts of recoverable raw materials.'),
  impactSummary: z.string().describe('A summary of the environmental impact of the device.'),
  // Additional fields for enhanced insights
  comparisons: z.object({
    treeEquivalents: z.number().describe('Equivalent number of trees needed to absorb the CO2.'),
    carMiles: z.number().describe('Equivalent car miles driven.'),
    smartphoneEquivalents: z.number().describe('Equivalent number of smartphones manufactured.'),
  }).describe('Environmental impact comparisons.'),
  recommendations: z.array(z.string()).describe('Recommendations for responsible disposal.'),
  deviceInfo: z.object({
    weight: z.number().describe('Device weight in kg.'),
    remainingLifespan: z.number().describe('Remaining useful life in years.'),
  }).describe('Device information.'),
  materialValueUSD: z.number().optional().describe('Estimated real-time value of recoverable materials in USD.'),
});
export type GetImpactInsightsOutput = z.infer<typeof GetImpactInsightsOutputSchema>;

export async function getImpactInsights(input: GetImpactInsightsInput): Promise<GetImpactInsightsOutput> {
  try {
    // Use real data calculation instead of AI generation
    const result = await calculateDeviceImpact(input);
    
    return {
      co2eq: result.co2eq,
      rawMaterials: {
        gold: result.rawMaterials.gold,
        copper: result.rawMaterials.copper,
        rareEarths: result.rawMaterials.rareEarths,
      },
      impactSummary: result.impactSummary,
      comparisons: result.comparisons,
      recommendations: result.recommendations,
      deviceInfo: {
        weight: result.deviceInfo.weight,
        remainingLifespan: result.deviceInfo.remainingLifespan,
      },
      materialValueUSD: result.materialValueUSD,
    };
  } catch (error) {
    // Fallback to AI if real data calculation fails
    return getImpactInsightsFlow(input);
  }
}

const prompt = ai.definePrompt({
  name: 'getImpactInsightsPrompt',
  input: {schema: GetImpactInsightsInputSchema},
  output: {schema: GetImpactInsightsOutputSchema},
  prompt: `You are an AI assistant that provides insights into the environmental impact of electronic devices.

  Based on the device type, age, and condition, estimate the CO2-equivalent emissions and the amounts of recoverable raw materials (gold, copper, and rare earth materials).
  Also, provide a summary of the environmental impact of the device.

  Device Type: {{{deviceType}}}
  Age (months): {{{ageMonths}}}
  Condition: {{{condition}}}

  Please provide the output in JSON format.
  `,
});

const getImpactInsightsFlow = ai.defineFlow(
  {
    name: 'getImpactInsightsFlow',
    inputSchema: GetImpactInsightsInputSchema,
    outputSchema: GetImpactInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);



