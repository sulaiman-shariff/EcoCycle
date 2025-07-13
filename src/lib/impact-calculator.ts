import {
  deviceImpactData,
  conditionMultipliers,
  ageDegradationFactors,
  environmentalComparisons,
  recyclingBenefits,
  type DeviceImpactData
} from './impact-data';
import { fetchElectricityEmissions, fetchMaterialPrices } from './environmental-apis';
import { ewasteDB, type EwasteDeviceData } from '@/data/ewaste-db';

export interface ImpactCalculationInput {
  deviceType: string;
  ageMonths: number;
  condition: 'good' | 'fair' | 'poor';
  region?: string;
  brand?: string;
  model?: string;
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

  // Real-time material value
  materialValueUSD?: number;
}

export async function calculateDeviceImpact(input: ImpactCalculationInput): Promise<ImpactCalculationResult> {
  const specificDeviceData = input.brand && input.model ? ewasteDB.find(
      (d) =>
        d.brand.toLowerCase() === input.brand!.toLowerCase() &&
        d.model.toLowerCase() === input.model!.toLowerCase()
    ) : undefined;
    
  const deviceData = specificDeviceData ?
    { // Adapt EwasteDeviceData to DeviceImpactData structure
      name: `${specificDeviceData.brand} ${specificDeviceData.model}`,
      weight: 0, // Not in DB, fallback to generic
      co2Manufacturing: specificDeviceData.co2eq,
      co2PerYear: 0, // Not in DB, fallback to generic
      materials: {
        gold: specificDeviceData.rawMaterials.gold,
        copper: specificDeviceData.rawMaterials.copper,
        rareEarths: specificDeviceData.rawMaterials.rareEarths,
        aluminum: 0,
        plastic: 0,
        glass: 0
      },
      lifespan: 0, // Not in DB, fallback to generic
      energyConsumption: 0, // Not in DB, fallback to generic
    } :
    deviceImpactData[input.deviceType];
    
  if (!deviceData) {
    throw new Error(`Unknown device type: ${input.deviceType}`);
  }

  // Use generic data for fields not present in the specific device data
  const genericData = deviceImpactData[input.deviceType];
  deviceData.weight = deviceData.weight || genericData.weight;
  deviceData.lifespan = deviceData.lifespan || genericData.lifespan;
  deviceData.energyConsumption = deviceData.energyConsumption || genericData.energyConsumption;
  deviceData.materials.aluminum = deviceData.materials.aluminum || genericData.materials.aluminum;
  deviceData.materials.plastic = deviceData.materials.plastic || genericData.materials.plastic;
  deviceData.materials.glass = deviceData.materials.glass || genericData.materials.glass;


  const ageYears = input.ageMonths / 12;
  const conditionMultiplier = conditionMultipliers[input.condition];
  const ageMultiplier = ageDegradationFactors.co2Multiplier(input.ageMonths);
  const materialAgeMultiplier = ageDegradationFactors.materialMultiplier(input.ageMonths);

  const region = input.region || 'US';
  const [emissionsData, materialPrices] = await Promise.all([
    fetchElectricityEmissions(region),
    fetchMaterialPrices(),
  ]);

  const co2Manufacturing = deviceData.co2Manufacturing;
  const co2Usage = deviceData.energyConsumption * ageYears * ageMultiplier * emissionsData.emissionsFactor;
  const co2eq = co2Manufacturing + co2Usage;

  const materialRecoveryMultiplier = conditionMultiplier * materialAgeMultiplier;
  const rawMaterials = {
    gold: deviceData.materials.gold * materialRecoveryMultiplier,
    copper: deviceData.materials.copper * materialRecoveryMultiplier,
    rareEarths: deviceData.materials.rareEarths * materialRecoveryMultiplier,
    aluminum: deviceData.materials.aluminum * materialRecoveryMultiplier,
    plastic: deviceData.materials.plastic * materialRecoveryMultiplier,
    glass: deviceData.materials.glass * materialRecoveryMultiplier,
  };

  const materialValueUSD =
    rawMaterials.gold * materialPrices.gold +
    rawMaterials.copper * materialPrices.copper +
    rawMaterials.rareEarths * materialPrices.rareEarths +
    rawMaterials.aluminum * materialPrices.aluminum;

  const comparisons = {
    treeEquivalents: environmentalComparisons.treeEquivalents(co2eq),
    carMiles: environmentalComparisons.carMiles(co2eq),
    smartphoneEquivalents: environmentalComparisons.smartphoneEquivalents(co2eq),
  };

  const recyclingBenefitsData = {
    energySaved: recyclingBenefits.energySaved(deviceData.weight),
    waterSaved: recyclingBenefits.waterSaved(deviceData.weight),
    landfillSpace: recyclingBenefits.landfillSpace(deviceData.weight),
  };

  const remainingLifespan = Math.max(0, deviceData.lifespan - ageYears);
  const deviceInfo = {
    weight: deviceData.weight,
    lifespan: deviceData.lifespan,
    energyConsumption: deviceData.energyConsumption,
    remainingLifespan,
  };

  return {
    co2eq: Math.round(co2eq * 100) / 100,
    co2Manufacturing: Math.round(co2Manufacturing * 100) / 100,
    co2Usage: Math.round(co2Usage * 100) / 100,
    rawMaterials,
    comparisons,
    recyclingBenefits: recyclingBenefitsData,
    deviceInfo,
    materialValueUSD: Math.round(materialValueUSD * 100) / 100,
  };
}


export function getDeviceTypes(): Array<{ value: string; label: string }> {
  return Object.entries(deviceImpactData).map(([key, data]) => ({
    value: key,
    label: data.name,
  }));
}
