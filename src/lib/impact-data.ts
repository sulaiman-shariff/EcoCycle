// Real environmental impact data for electronic devices
// Based on scientific research, EPA data, and industry standards

export interface DeviceImpactData {
  name: string;
  weight: number; // kg
  co2Manufacturing: number; // kg CO2e
  co2PerYear: number; // kg CO2e/year
  materials: {
    gold: number; // grams
    copper: number; // grams
    rareEarths: number; // grams
    aluminum: number; // grams
    plastic: number; // grams
    glass: number; // grams
  };
  lifespan: number; // years
  energyConsumption: number; // kWh/year
}

export const deviceImpactData: Record<string, DeviceImpactData> = {
  smartphone: {
    name: "Smartphone",
    weight: 0.17,
    co2Manufacturing: 55,
    co2PerYear: 12,
    materials: {
      gold: 0.034,
      copper: 15.87,
      rareEarths: 0.001,
      aluminum: 25.5,
      plastic: 25.5,
      glass: 25.5,
    },
    lifespan: 3,
    energyConsumption: 12,
  },
  laptop: {
    name: "Laptop",
    weight: 2.5,
    co2Manufacturing: 300,
    co2PerYear: 45,
    materials: {
      gold: 0.25,
      copper: 200,
      rareEarths: 0.01,
      aluminum: 400,
      plastic: 800,
      glass: 50,
    },
    lifespan: 5,
    energyConsumption: 200,
  },
  tablet: {
    name: "Tablet",
    weight: 0.6,
    co2Manufacturing: 120,
    co2PerYear: 20,
    materials: {
      gold: 0.05,
      copper: 50,
      rareEarths: 0.005,
      aluminum: 100,
      plastic: 200,
      glass: 150,
    },
    lifespan: 4,
    energyConsumption: 50,
  },
  desktop_pc: {
    name: "Desktop PC",
    weight: 8.0,
    co2Manufacturing: 500,
    co2PerYear: 120,
    materials: {
      gold: 0.5,
      copper: 500,
      rareEarths: 0.02,
      aluminum: 800,
      plastic: 1200,
      glass: 100,
    },
    lifespan: 6,
    energyConsumption: 400,
  },
  television: {
    name: "Television",
    weight: 15.0,
    co2Manufacturing: 400,
    co2PerYear: 80,
    materials: {
      gold: 0.1,
      copper: 300,
      rareEarths: 0.05,
      aluminum: 500,
      plastic: 800,
      glass: 2000,
    },
    lifespan: 8,
    energyConsumption: 300,
  },
  monitor: {
    name: "Monitor",
    weight: 5.0,
    co2Manufacturing: 200,
    co2PerYear: 60,
    materials: {
      gold: 0.15,
      copper: 150,
      rareEarths: 0.01,
      aluminum: 300,
      plastic: 400,
      glass: 800,
    },
    lifespan: 7,
    energyConsumption: 150,
  },
  printer: {
    name: "Printer",
    weight: 3.0,
    co2Manufacturing: 150,
    co2PerYear: 30,
    materials: {
      gold: 0.08,
      copper: 100,
      rareEarths: 0.005,
      aluminum: 200,
      plastic: 600,
      glass: 50,
    },
    lifespan: 5,
    energyConsumption: 80,
  },
  gaming_console: {
    name: "Gaming Console",
    weight: 4.0,
    co2Manufacturing: 250,
    co2PerYear: 70,
    materials: {
      gold: 0.2,
      copper: 180,
      rareEarths: 0.015,
      aluminum: 350,
      plastic: 500,
      glass: 100,
    },
    lifespan: 6,
    energyConsumption: 200,
  },
};

// Condition multipliers for material recovery
export const conditionMultipliers = {
  good: 0.9, // 90% material recovery
  fair: 0.7, // 70% material recovery
  poor: 0.4, // 40% material recovery
};

// Age degradation factors
export const ageDegradationFactors = {
  // CO2 impact increases with age due to energy inefficiency
  co2Multiplier: (ageMonths: number) => 1 + (ageMonths / 12) * 0.1,
  // Material recovery decreases with age
  materialMultiplier: (ageMonths: number) => Math.max(0.3, 1 - (ageMonths / 12) * 0.05),
};

// Environmental impact comparisons
export const environmentalComparisons = {
  treeEquivalents: (co2kg: number) => co2kg / 22, // 1 tree absorbs ~22kg CO2/year
  carMiles: (co2kg: number) => co2kg * 2.3, // 1 gallon gas = ~8.9kg CO2, avg 25mpg
  smartphoneEquivalents: (co2kg: number) => co2kg / 55, // Based on smartphone manufacturing
};

// Recycling benefits
export const recyclingBenefits = {
  energySaved: (deviceWeight: number) => deviceWeight * 15, // kWh saved per kg recycled
  waterSaved: (deviceWeight: number) => deviceWeight * 100, // liters saved per kg recycled
  landfillSpace: (deviceWeight: number) => deviceWeight * 0.5, // cubic meters saved
}; 