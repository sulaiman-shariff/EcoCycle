'use server';
/**
 * @fileOverview A Genkit tool for looking up e-waste data from a mock database.
 * 
 * - ewasteDataTool: The tool definition for looking up device data.
 * - EwasteDeviceDataSchema: Zod schema for the tool's output data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { ewasteDB, EwasteDeviceDataSchema as EwasteDbSchema } from '@/data/ewaste-db';

// Export the Zod schema so other modules can use it for type validation.
export const EwasteDeviceDataSchema = EwasteDbSchema;

export const ewasteDataTool = ai.defineTool(
  {
    name: 'ewasteDataTool',
    description: 'Looks up environmental impact data for a specific electronic device model from a database.',
    inputSchema: z.object({
      brand: z.string().describe('The brand of the device, e.g., "Apple", "Samsung"'),
      model: z.string().describe('The model of the device, e.g., "iPhone 14", "Galaxy S23"'),
    }),
    outputSchema: z.union([EwasteDeviceDataSchema, z.null()]).describe('The impact data for the device, or null if not found.'),
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
