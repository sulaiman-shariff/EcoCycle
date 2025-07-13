import { z } from 'zod';

// Zod schema for type safety, matching the tool's output
export const EwasteDeviceDataSchema = z.object({
  brand: z.string(),
  model: z.string(),
  deviceType: z.enum(['smartphone', 'laptop', 'tablet', 'desktop_pc', 'television']),
  co2eq: z.number().describe('Baseline CO2-equivalent emissions (in kg) for a new device.'),
  rawMaterials: z.object({
    gold: z.number().describe('Estimated amount of recoverable gold (in grams).'),
    copper: z.number().describe('Estimated amount of recoverable copper (in grams).'),
    rareEarths: z.number().describe('Estimated amount of recoverable rare earth materials (in grams).'),
  }),
});

export type EwasteDeviceData = z.infer<typeof EwasteDeviceDataSchema>;

// Mock database of e-waste data. In a real application, this would be a real database.
export const ewasteDB: EwasteDeviceData[] = [
  // Smartphones
  {
    brand: "Apple",
    model: "iPhone 15 Pro",
    deviceType: "smartphone",
    co2eq: 85,
    rawMaterials: { gold: 0.036, copper: 18, rareEarths: 0.6 },
  },
  {
    brand: "Apple",
    model: "iPhone 14",
    deviceType: "smartphone",
    co2eq: 70,
    rawMaterials: { gold: 0.034, copper: 16, rareEarths: 0.5 },
  },
  {
    brand: "Samsung",
    model: "Galaxy S23",
    deviceType: "smartphone",
    co2eq: 65,
    rawMaterials: { gold: 0.032, copper: 15, rareEarths: 0.45 },
  },
    {
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    deviceType: "smartphone",
    co2eq: 78,
    rawMaterials: { gold: 0.035, copper: 17, rareEarths: 0.55 },
  },
  {
    brand: "Google",
    model: "Pixel 8",
    deviceType: "smartphone",
    co2eq: 68,
    rawMaterials: { gold: 0.030, copper: 14, rareEarths: 0.4 },
  },

  // Laptops
  {
    brand: "Apple",
    model: "MacBook Air M2",
    deviceType: "laptop",
    co2eq: 160,
    rawMaterials: { gold: 0.1, copper: 150, rareEarths: 2 },
  },
  {
    brand: "Dell",
    model: "XPS 15",
    deviceType: "laptop",
    co2eq: 210,
    rawMaterials: { gold: 0.12, copper: 180, rareEarths: 2.5 },
  },
  {
    brand: "HP",
    model: "Spectre x360",
    deviceType: "laptop",
    co2eq: 195,
    rawMaterials: { gold: 0.11, copper: 170, rareEarths: 2.2 },
  },
    {
    brand: "Lenovo",
    model: "ThinkPad X1 Carbon",
    deviceType: "laptop",
    co2eq: 175,
    rawMaterials: { gold: 0.09, copper: 160, rareEarths: 2.1 },
  },

  // Tablets
  {
    brand: "Apple",
    model: "iPad Pro",
    deviceType: "tablet",
    co2eq: 120,
    rawMaterials: { gold: 0.08, copper: 100, rareEarths: 1.5 },
  },
  {
    brand: "Samsung",
    model: "Galaxy Tab S9",
    deviceType: "tablet",
    co2eq: 110,
    rawMaterials: { gold: 0.07, copper: 90, rareEarths: 1.3 },
  },
    {
    brand: "Microsoft",
    model: "Surface Pro 9",
    deviceType: "tablet",
    co2eq: 130,
    rawMaterials: { gold: 0.08, copper: 110, rareEarths: 1.6 },
  },
];
