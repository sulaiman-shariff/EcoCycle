import {
  deviceImpactData,
  conditionMultipliers,
  ageDegradationFactors,
  environmentalComparisons,
  recyclingBenefits,
  type DeviceImpactData
} from './impact-data';
import { fetchElectricityEmissions, fetchMaterialPrices } from './environmental-apis';

export interface ImpactCalculationInput {
  deviceType: string;
  ageMonths: number;
  condition: 'good' | 'fair' | 'poor';
  region?: string;
}

export interface ImpactCalculationResult {
  // CO2 emissions
  co2eq: number;
  co2Manufacturing: number;
  co2Usage: number;

  // Material recovery
  rawMaterials: {
    gold: number;
    copper: number;
    rareEarths: number;
    aluminum: number;
    plastic: number;
    glass: number;
  };

  // Environmental comparisons
  comparisons: {
    treeEquivalents: number;
    carMiles: number;
    smartphoneEquivalents: number;
  };

  // Recycling benefits
  recyclingBenefits: {
    energySaved: number;
    waterSaved: number;
    landfillSpace: number;
  };

  // Device information
  deviceInfo: {
    weight: number;
    lifespan: number;
    energyConsumption: number;
    remainingLifespan: number;
  };

  // Impact summary
  impactSummary: string;
  recommendations: string[];
  // Real-time material value
  materialValueUSD?: number;
}

export async function calculateDeviceImpact(input: ImpactCalculationInput): Promise<ImpactCalculationResult> {
  const deviceData = deviceImpactData[input.deviceType];
  if (!deviceData) {
    throw new Error(`Unknown device type: ${input.deviceType}`);
  }

  const ageYears = input.ageMonths / 12;
  const conditionMultiplier = conditionMultipliers[input.condition];
  const ageMultiplier = ageDegradationFactors.co2Multiplier(input.ageMonths);
  const materialAgeMultiplier = ageDegradationFactors.materialMultiplier(input.ageMonths);

  // --- Real API integration ---
  const region = input.region || 'US';
  const [emissionsData, materialPrices] = await Promise.all([
    fetchElectricityEmissions(region),
    fetchMaterialPrices(),
  ]);

  // Calculate CO2 emissions using real grid data
  const co2Manufacturing = deviceData.co2Manufacturing;
  const co2Usage = deviceData.energyConsumption * ageYears * ageMultiplier * emissionsData.emissionsFactor;
  const co2eq = co2Manufacturing + co2Usage;

  // Calculate recoverable materials (considering condition and age)
  const materialRecoveryMultiplier = conditionMultiplier * materialAgeMultiplier;
  const rawMaterials = {
    gold: deviceData.materials.gold * materialRecoveryMultiplier,
    copper: deviceData.materials.copper * materialRecoveryMultiplier,
    rareEarths: deviceData.materials.rareEarths * materialRecoveryMultiplier,
    aluminum: deviceData.materials.aluminum * materialRecoveryMultiplier,
    plastic: deviceData.materials.plastic * materialRecoveryMultiplier,
    glass: deviceData.materials.glass * materialRecoveryMultiplier,
  };

  // Calculate real-time material value in USD
  const materialValueUSD =
    rawMaterials.gold * materialPrices.gold +
    rawMaterials.copper * materialPrices.copper +
    rawMaterials.rareEarths * materialPrices.rareEarths +
    rawMaterials.aluminum * materialPrices.aluminum;

  // Calculate environmental comparisons
  const comparisons = {
    treeEquivalents: environmentalComparisons.treeEquivalents(co2eq),
    carMiles: environmentalComparisons.carMiles(co2eq),
    smartphoneEquivalents: environmentalComparisons.smartphoneEquivalents(co2eq),
  };

  // Calculate recycling benefits
  const recyclingBenefitsData = {
    energySaved: recyclingBenefits.energySaved(deviceData.weight),
    waterSaved: recyclingBenefits.waterSaved(deviceData.weight),
    landfillSpace: recyclingBenefits.landfillSpace(deviceData.weight),
  };

  // Device information
  const remainingLifespan = Math.max(0, deviceData.lifespan - ageYears);
  const deviceInfo = {
    weight: deviceData.weight,
    lifespan: deviceData.lifespan,
    energyConsumption: deviceData.energyConsumption,
    remainingLifespan,
  };

  // Generate impact summary
  const impactSummary = generateImpactSummary(deviceData, co2eq, rawMaterials, remainingLifespan, input.condition, materialValueUSD);

  // Generate recommendations
  const recommendations = generateRecommendations(deviceData, remainingLifespan, input.condition, co2eq);

  return {
    co2eq: Math.round(co2eq * 100) / 100,
    co2Manufacturing: Math.round(co2Manufacturing * 100) / 100,
    co2Usage: Math.round(co2Usage * 100) / 100,
    rawMaterials,
    comparisons,
    recyclingBenefits: recyclingBenefitsData,
    deviceInfo,
    impactSummary,
    recommendations,
    materialValueUSD: Math.round(materialValueUSD * 100) / 100,
  };
}

function generateImpactSummary(
  deviceData: DeviceImpactData,
  co2eq: number,
  rawMaterials: any,
  remainingLifespan: number,
  condition: string,
  materialValueUSD?: number
): string {
  const totalMaterials = (Object.values(rawMaterials) as number[]).reduce((sum, val) => sum + val, 0);

  let summary = `Your ${deviceData.name.toLowerCase()} has an estimated carbon footprint of ${co2eq.toFixed(1)} kg CO2e. `;

  if (remainingLifespan > 0) {
    summary += `It has approximately ${remainingLifespan.toFixed(1)} years of useful life remaining. `;
  } else {
    summary += `This device has exceeded its typical lifespan. `;
  }

  summary += `If properly recycled, it could recover ${totalMaterials.toFixed(1)}g of valuable materials, `;
  summary += `including ${rawMaterials.gold.toFixed(3)}g of gold and ${rawMaterials.copper.toFixed(1)}g of copper. `;

  if (materialValueUSD && materialValueUSD > 0) {
    summary += `The estimated material value is $${materialValueUSD.toFixed(2)}. `;
  }

  if (condition === 'good') {
    summary += `The device is in good condition, maximizing material recovery potential.`;
  } else if (condition === 'fair') {
    summary += `The device's condition allows for moderate material recovery.`;
  } else {
    summary += `Due to poor condition, material recovery will be limited.`;
  }

  return summary;
}

function generateRecommendations(
  deviceData: DeviceImpactData,
  remainingLifespan: number,
  condition: string,
  co2eq: number
): string[] {
  const recommendations: string[] = [];

  if (remainingLifespan > 2) {
    recommendations.push("Consider extending the device's life through repairs or upgrades.");
    recommendations.push("Donate to schools, libraries, or non-profits if still functional.");
  } else if (remainingLifespan > 0) {
    recommendations.push("Plan for responsible disposal within the next year.");
    recommendations.push("Back up all data before disposal.");
  } else {
    recommendations.push("This device should be recycled immediately.");
    recommendations.push("Remove all personal data before recycling.");
  }

  if (condition === 'good') {
    recommendations.push("The device has high resale or donation value.");
  } else if (condition === 'poor') {
    recommendations.push("Professional recycling is recommended for maximum material recovery.");
  }

  if (co2eq > 200) {
    recommendations.push("Consider energy-efficient alternatives for your next device.");
  }

  recommendations.push("Find certified e-waste recyclers in your area.");
  recommendations.push("Check if the manufacturer offers take-back programs.");

  return recommendations;
}

export function getDeviceTypes(): Array<{ value: string; label: string }> {
  return Object.entries(deviceImpactData).map(([key, data]) => ({
    value: key,
    label: data.name,
  }));
} 