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
import { calculateDeviceImpact, type ImpactCalculationResult, type ImpactCalculationInput } from '@/lib/impact-calculator';
import { ewasteDataTool } from '@/ai/tools/ewaste-data-tool';

export const GetImpactInsightsInputSchema = z.object({
  deviceType: z.string().describe('The type of electronic device (e.g., smartphone, laptop).'),
  brand: z.string().optional().describe('The brand of the device (e.g., Apple, Samsung).'),
  model: z.string().optional().describe('The model of the device (e.g., iPhone 14, Galaxy S23).'),
  ageMonths: z.number().describe('The age of the device in months.'),
  condition: z.enum(['good', 'fair', 'poor']).describe('The condition of the device.'),
  region: z.string().optional(),
});
export type GetImpactInsightsInput = z.infer<typeof GetImpactInsightsInputSchema>;

export const GetImpactInsightsOutputSchema = z.object({
  co2eq: z.number().describe('The estimated CO2-equivalent emissions (in kg).'),
  rawMaterials: z.object({
    gold: z.number().describe('The estimated amount of recoverable gold (in grams).'),
    copper: z.number().describe('The estimated amount of recoverable copper (in grams).'),
    rareEarths: z.number().describe('The estimated amount of recoverable rare earth materials (in grams).'),
  }).describe('The estimated amounts of recoverable raw materials.'),
  impactSummary: z.string().describe('A summary of the environmental impact of the device.'),
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


const prompt = ai.definePrompt({
    name: 'getImpactInsightsPrompt',
    input: { schema: z.object({
        calculation: z.any(), // a bit of a hack, but we are passing the whole result
        input: GetImpactInsightsInputSchema
    })},
    output: { schema: z.object({
        impactSummary: z.string().describe("A concise (2-3 sentences) summary of the device's environmental impact, mentioning its footprint, condition, and recycling potential."),
        recommendations: z.array(z.string()).describe("A list of 3-4 actionable recommendations for the user based on the device's condition and remaining lifespan.")
    })},
    prompt: `You are an e-waste sustainability expert. Based on the following impact calculation data, provide a concise summary and actionable recommendations for the user.
    If the device model was not found in the database, mention that the calculation is a general estimate for the device category.

    Device Information:
    - Type: {{{input.deviceType}}}
    - Brand: {{{input.brand}}}
    - Model: {{{input.model}}}
    - Age: {{{input.ageMonths}}} months
    - Condition: {{{input.condition}}}

    Calculation Results:
    - CO2 Equivalent: {{{calculation.co2eq}}} kg
    - Remaining Lifespan: {{{calculation.deviceInfo.remainingLifespan}}} years
    - Recoverable Gold: {{{calculation.rawMaterials.gold}}}g
    - Recoverable Copper: {{{calculation.rawMaterials.copper}}}g
    - Material Value: ${{{calculation.materialValueUSD}}}

    Generate the impact summary and recommendations.
    `
});

const getImpactInsightsFlow = ai.defineFlow(
  {
    name: 'getImpactInsightsFlow',
    inputSchema: GetImpactInsightsInputSchema,
    outputSchema: GetImpactInsightsOutputSchema,
  },
  async (input) => {
    let specificDeviceData;
    if (input.brand && input.model) {
      specificDeviceData = await ewasteDataTool({ brand: input.brand, model: input.model });
    }

    const calculationResult = await calculateDeviceImpact(input, specificDeviceData || undefined);

    const { output } = await prompt({
        calculation: calculationResult,
        input: input
    });
    
    if (!output) {
        throw new Error("Failed to get summary and recommendations from AI model.");
    }

    return {
      co2eq: calculationResult.co2eq,
      rawMaterials: {
        gold: calculationResult.rawMaterials.gold,
        copper: calculationResult.rawMaterials.copper,
        rareEarths: calculationResult.rawMaterials.rareEarths,
      },
      impactSummary: output.impactSummary,
      comparisons: calculationResult.comparisons,
      recommendations: output.recommendations,
      deviceInfo: {
        weight: calculationResult.deviceInfo.weight,
        remainingLifespan: calculationResult.deviceInfo.remainingLifespan,
      },
      materialValueUSD: calculationResult.materialValueUSD,
    };
  }
);


export async function getImpactInsights(input: GetImpactInsightsInput): Promise<GetImpactInsightsOutput> {
    return getImpactInsightsFlow(input);
}
