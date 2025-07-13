import { z } from 'zod';

// Zod schema for type safety, matching the tool's output
export const EwasteDeviceDataSchema = z.object({
  brand: z.string(),
  model: z.string(),
  deviceType: z.enum(['smartphone', 'laptop', 'tablet']),
  co2eq: z.number().describe('Baseline CO2-equivalent emissions (in kg) for a new device.'),
  rawMaterials: z.object({
    gold: z.number().describe('Estimated amount of recoverable gold (in grams).'),
    copper: z.number().describe('Estimated amount of recoverable copper (in grams).'),
    rareEarths: z.number().describe('Estimated amount of recoverable rare earth materials (in grams).'),
  }),
});

export type EwasteDeviceData = z.infer<typeof EwasteDeviceDataSchema>;

// Mock database of e-waste data
export const ewasteDB: EwasteDeviceData[] = [
  {
    brand: "Apple",
    model: "iPhone 14",
    deviceType: "smartphone",
    co2eq: 70,
    rawMaterials: {
      gold: 0.034,
      copper: 16,
      rareEarths: 0.5,
    },
  },
  {
    brand: "Apple",
    model: "iPhone 15 Pro",
    deviceType: "smartphone",
    co2eq: 85,
    rawMaterials: {
      gold: 0.036,
      copper: 18,
      rareEarths: 0.6,
    },
  },
  {
    brand: "Samsung",
    model: "Galaxy S23",
    deviceType: "smartphone",
    co2eq: 65,
    rawMaterials: {
      gold: 0.032,
      copper: 15,
      rareEarths: 0.45,
    },
  },
  {
    brand: "Apple",
    model: "MacBook Air M2",
    deviceType: "laptop",
    co2eq: 160,
    rawMaterials: {
      gold: 0.1,
      copper: 150,
      rareEarths: 2,
    },
  },
  {
    brand: "Dell",
    model: "XPS 15",
    deviceType: "laptop",
    co2eq: 210,
    rawMaterials: {
      gold: 0.12,
      copper: 180,
      rareEarths: 2.5,
    },
  },
  {
    brand: "Apple",
    model: "iPad Pro",
    deviceType: "tablet",
    co2eq: 120,
    rawMaterials: {
      gold: 0.08,
      copper: 100,
      rareEarths: 1.5,
    },
  },
];
