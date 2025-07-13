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
<<<<<<< HEAD
import { ewasteDataTool } from '../tools/ewaste-data-tool';
=======
import { calculateDeviceImpact, type ImpactCalculationResult } from '@/lib/impact-calculator';
>>>>>>> 34b20041bf5aeeeae8300bead3f52ce1966d2966

const GetImpactInsightsInputSchema = z.object({
  deviceType: z.string().describe('The type of electronic device (e.g., smartphone, laptop).'),
  brand: z.string().optional().describe('The brand of the device (e.g., Apple, Samsung).'),
  model: z.string().optional().describe('The model of the device (e.g., iPhone 14, Galaxy S23).'),
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
<<<<<<< HEAD
  impactSummary: z.string().describe('A summary of the environmental impact of the device. If specific data was not found for the model, this summary should state that the figures are an estimate for a generic device of that type.'),
=======
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
>>>>>>> 34b20041bf5aeeeae8300bead3f52ce1966d2966
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
  tools: [ewasteDataTool],
  system: `You are an AI assistant that provides insights into the environmental impact of electronic devices.

  Your primary goal is to provide accurate data. You have a tool to look up e-waste data for specific device models.

  1.  **Use the Tool:** If the user provides a brand and model, you MUST use the \`ewasteDataTool\` to find data for that device.
  2.  **Analyze Tool Output:**
      *   If the tool returns data, use that data to answer. The condition of the device ('good', 'fair', 'poor') and its age can slightly modify the CO2 and material values (e.g., a 'poor' condition device might have slightly lower recoverable materials, an older device has a larger relative footprint).
      *   If the tool returns no data for the specific model, you MUST inform the user that specific data is not available. Then, provide a generic estimate based on the \`deviceType\`, age, and condition. Do NOT invent data or models.
  3.  **Generate Summary:** Based on the data (either from the tool or a generic estimate), provide a concise \`impactSummary\`. If you are providing a generic estimate, you must state this clearly in the summary.
  `,
  prompt: `Please provide the environmental impact assessment for the following device:

  Device Type: {{{deviceType}}}
  {{#if brand}}Brand: {{{brand}}}{{/if}}
  {{#if model}}Model: {{{model}}}{{/if}}
  Age (months): {{{ageMonths}}}
  Condition: {{{condition}}}
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
