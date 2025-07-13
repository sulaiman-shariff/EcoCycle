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
import { calculateDeviceImpact } from '@/lib/impact-calculator';
import { EwasteDeviceData, ewasteDB } from '@/data/ewaste-db';

const ewasteDataTool = ai.defineTool(
  {
    name: 'ewasteDataTool',
    description: 'Looks up environmental impact data for a specific electronic device model from a database.',
    inputSchema: z.object({
      brand: z.string().describe('The brand of the device, e.g., "Apple", "Samsung"'),
      model: z.string().describe('The model of the device, e.g., "iPhone 14", "Galaxy S23"'),
    }),
    outputSchema: z.union([EwasteDeviceData, z.null()]).describe('The impact data for the device, or null if not found.'),
  },
  async ({ brand, model }) => {
    console.log(`[Tool] Searching for device: ${brand} ${model}`);
    
    const lowerCaseBrand = brand.toLowerCase();
    const lowerCaseModel = model.toLowerCase();

    const device = ewasteDB.find(
      (d) =>
        d.brand.toLowerCase() === lowerCaseBrand &&
        d.model.toLowerCase() === lowerCaseModel
    );

    if (device) {
      console.log(`[Tool] Found device:`, device);
      return device;
    }
    
    console.log(`[Tool] Device not found.`);
    return null;
  }
);


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

const getImpactInsightsFlow = ai.defineFlow(
  {
    name: 'getImpactInsightsFlow',
    inputSchema: GetImpactInsightsInputSchema,
    outputSchema: GetImpactInsightsOutputSchema,
  },
  async (input) => {
    // 1. Let the AI generate insights and use the tool if necessary.
    const llmResponse = await ai.generate({
      prompt: `
        You are an e-waste sustainability expert. 
        Your goal is to provide a concise impact summary and actionable recommendations for the user based on their device.
        
        Device Information:
        - Type: ${input.deviceType}
        - Brand: ${input.brand || 'Not provided'}
        - Model: ${input.model || 'Not provided'}
        - Age: ${input.ageMonths} months
        - Condition: ${input.condition}

        Instructions:
        1. If the user provides a specific brand and model, you MUST use the ewasteDataTool to look up its data.
        2. Based on all the information, generate a concise impact summary (2-3 sentences).
        3. Provide 3-4 actionable recommendations for the user based on the device's condition and age.
        4. If the tool does not find a specific device, mention in your summary that the calculation is a general estimate for the device category.
      `,
      tools: [ewasteDataTool],
      model: 'googleai/gemini-1.5-flash',
      output: {
        schema: z.object({
          impactSummary: z.string().describe("A concise (2-3 sentences) summary of the device's environmental impact, mentioning its footprint, condition, and recycling potential."),
          recommendations: z.array(z.string()).describe("A list of 3-4 actionable recommendations for the user based on the device's condition and remaining lifespan.")
        })
      }
    });

    const toolOutput = llmResponse.toolRequest?.tool?.ewasteDataTool;
    const specificDeviceData = toolOutput ? EwasteDeviceData.parse(toolOutput) : undefined;
    
    // 2. Perform the definitive data calculation using the (optional) specific data.
    const calculationResult = await calculateDeviceImpact(input, specificDeviceData);

    const aiOutput = llmResponse.output;
    if (!aiOutput) {
      throw new Error("Failed to get summary and recommendations from AI model.");
    }
    
    // 3. Combine calculation results and AI-generated text into the final output.
    return {
      ...calculationResult,
      rawMaterials: {
        gold: calculationResult.rawMaterials.gold,
        copper: calculationResult.rawMaterials.copper,
        rareEarths: calculationResult.rawMaterials.rareEarths,
      },
      impactSummary: aiOutput.impactSummary,
      recommendations: aiOutput.recommendations,
    };
  }
);


export async function getImpactInsights(input: GetImpactInsightsInput): Promise<GetImpactInsightsOutput> {
    return getImpactInsightsFlow(input);
}
