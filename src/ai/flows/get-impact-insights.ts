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

const GetImpactInsightsInputSchema = z.object({
  deviceType: z.string().describe('The type of electronic device (e.g., smartphone, laptop).'),
  brand: z.string().optional().describe('The brand of the device (e.g., Apple, Samsung).'),
  model: z.string().optional().describe('The model of the device (e.g., iPhone 14, Galaxy S23).'),
  ageMonths: z.number().describe('The age of the device in months.'),
  condition: z.enum(['good', 'fair', 'poor']).describe('The condition of the device.'),
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
});
export type GetImpactInsightsOutput = z.infer<typeof GetImpactInsightsOutputSchema>;

export async function getImpactInsights(input: GetImpactInsightsInput): Promise<GetImpactInsightsOutput> {
  return getImpactInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getImpactInsightsPrompt',
  input: {schema: GetImpactInsightsInputSchema},
  output: {schema: GetImpactInsightsOutputSchema},
  prompt: `You are an AI assistant that provides insights into the environmental impact of electronic devices.

  Based on the device type, age, and condition, estimate the CO2-equivalent emissions and the amounts of recoverable raw materials (gold, copper, and rare earth materials).
  Also, provide a summary of the environmental impact of the device.

  Device Type: {{{deviceType}}}
  {{#if brand}}Brand: {{{brand}}}{{/if}}
  {{#if model}}Model: {{{model}}}{{/if}}
  Age (months): {{{ageMonths}}}
  Condition: {{{condition}}}

  Please be as specific as possible if the brand and model are provided.
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