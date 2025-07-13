
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { protos } from '@google-cloud/vision';

// Initialize Vision API client.
// In a Google Cloud environment (like App Hosting), the client will automatically
// find the service account credentials without needing a key file.
const vision = new ImageAnnotatorClient();

export interface VisionAnalysisResult {
  deviceType: string;
  confidence: number;
  brand?: string;
  model?: string;
  condition?: string;
  features: string[];
  suggestedRecyclingValue: number;
  environmentalImpact: {
    co2Manufacturing: number;
    co2Usage: number;
    materialsRecoverable: string[];
  };
}

// Device type keywords for classification
const DEVICE_KEYWORDS = {
  smartphone: ['phone', 'mobile', 'smartphone', 'iphone', 'android', 'galaxy'],
  laptop: ['laptop', 'computer', 'notebook', 'macbook', 'dell', 'hp', 'lenovo'],
  tablet: ['tablet', 'ipad', 'android tablet', 'surface'],
  desktop: ['desktop', 'computer', 'pc', 'tower', 'monitor'],
  tv: ['tv', 'television', 'smart tv', 'led tv', 'plasma'],
  monitor: ['monitor', 'display', 'screen', 'lcd', 'led'],
  printer: ['printer', 'scanner', 'all-in-one', 'inkjet', 'laser'],
  camera: ['camera', 'dslr', 'mirrorless', 'point and shoot'],
  headphones: ['headphones', 'earbuds', 'airpods', 'wireless'],
  speaker: ['speaker', 'bluetooth speaker', 'sound system'],
  gaming: ['console', 'xbox', 'playstation', 'nintendo', 'gaming'],
  router: ['router', 'modem', 'network', 'wifi'],
  keyboard: ['keyboard', 'mechanical', 'wireless keyboard'],
  mouse: ['mouse', 'trackpad', 'wireless mouse'],
  other: ['device', 'electronic', 'gadget']
};

// Brand keywords
const BRAND_KEYWORDS = {
  apple: ['apple', 'iphone', 'ipad', 'macbook', 'imac', 'airpods'],
  samsung: ['samsung', 'galaxy', 'note', 's series'],
  dell: ['dell', 'inspiron', 'latitude', 'precision'],
  hp: ['hp', 'hewlett-packard', 'pavilion', 'elitebook'],
  lenovo: ['lenovo', 'thinkpad', 'ideapad', 'yoga'],
  microsoft: ['microsoft', 'surface', 'xbox'],
  sony: ['sony', 'playstation', 'vaio'],
  lg: ['lg', 'g series', 'v series'],
  asus: ['asus', 'zenbook', 'rog'],
  acer: ['acer', 'aspire', 'predator']
};

// Condition assessment keywords
const CONDITION_KEYWORDS = {
  excellent: ['new', 'perfect', 'mint', 'excellent', 'pristine'],
  good: ['good', 'like new', 'slight wear', 'minor'],
  fair: ['fair', 'used', 'worn', 'scratches', 'damage'],
  poor: ['poor', 'broken', 'damaged', 'cracked', 'non-functional']
};

export const analyzeDeviceImage = async (imageUrl: string): Promise<VisionAnalysisResult> => {
  try {
    // The imageUrl is a base64 data URI. We need to extract the raw base64 data.
    const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');

    const imageRequest = {
      image: {
        content: base64Data,
      },
    };

    // Perform multiple analyses
    const [labelResult, textResult, objectResult] = await Promise.all([
      vision.labelDetection(imageRequest),
      vision.textDetection(imageRequest),
      vision.objectLocalization(imageRequest),
    ]).catch(err => {
        console.error("Vision API Promise.all failed", err);
        throw new Error("One or more Vision API calls failed.");
    });

    const labels = labelResult[0]?.labelAnnotations || [];
    const textBlocks = textResult[0]?.textAnnotations || [];
    const objects = objectResult[0]?.localizedObjectAnnotations || [];

    // Extract text content
    const textContent = (textBlocks[0]?.description || '')
      .toLowerCase();

    // Analyze device type
    const deviceType = analyzeDeviceType(labels, textContent, objects);
    
    // Analyze brand and model
    const brand = analyzeBrand(textContent, labels);
    const model = analyzeModel(textContent, labels);
    
    // Analyze condition
    const condition = analyzeCondition(labels, textContent);
    
    // Extract features
    const features = extractFeatures(labels, textContent, objects);
    
    // Calculate confidence
    const confidence = calculateConfidence(labels, textContent, objects);
    
    // Estimate recycling value and environmental impact
    const { suggestedRecyclingValue, environmentalImpact } = estimateRecyclingValue(
      deviceType, condition, brand, model
    );

    return {
      deviceType,
      confidence,
      brand,
      model,
      condition,
      features,
      suggestedRecyclingValue,
      environmentalImpact
    };
  } catch (error) {
    console.error('Vision API analysis failed:', error);
    throw new Error('Failed to analyze image with Vision API.');
  }
};

const analyzeDeviceType = (
  labels: protos.google.cloud.vision.v1.IEntityAnnotation[], 
  textContent: string, 
  objects: protos.google.cloud.vision.v1.ILocalizedObjectAnnotation[]
): string => {
  const labelTexts = labels.map(label => (label.description || '').toLowerCase());
  const objectNames = objects.map(obj => (obj.name || '').toLowerCase());
  
  const allText = [...labelTexts, ...objectNames, textContent].join(' ');
  
  for (const [deviceType, keywords] of Object.entries(DEVICE_KEYWORDS)) {
    const matchCount = keywords.filter(keyword => 
      allText.includes(keyword)
    ).length;
    
    if (matchCount > 0) {
      return deviceType;
    }
  }
  
  return 'other';
};

const analyzeBrand = (textContent: string, labels: protos.google.cloud.vision.v1.IEntityAnnotation[]): string | undefined => {
  const labelTexts = labels.map(label => (label.description || '').toLowerCase());
  const allText = [...labelTexts, textContent].join(' ');
  
  for (const [brand, keywords] of Object.entries(BRAND_KEYWORDS)) {
    const matchCount = keywords.filter(keyword => 
      allText.includes(keyword)
    ).length;
    
    if (matchCount > 0) {
      return brand;
    }
  }
  
  return undefined;
};

const analyzeModel = (textContent: string, labels: protos.google.cloud.vision.v1.IEntityAnnotation[]): string | undefined => {
  // Look for model patterns in text
  const modelPatterns = [
    /(iphone|galaxy|pixel)\s*(\w+\s*\w*)/i,
    /(macbook|inspiron|pavilion)\s*(\w+\s*\w*)/i,
    /(ipad|surface)\s*(\w+\s*\w*)/i,
    /(xbox|playstation)\s*(\d+|one|series\s*[sx])/i
  ];
  
  for (const pattern of modelPatterns) {
    const match = textContent.match(pattern);
    if (match) {
      return `${match[1]} ${match[2]}`.trim();
    }
  }
  
  return undefined;
};

const analyzeCondition = (labels: protos.google.cloud.vision.v1.IEntityAnnotation[], textContent: string): string => {
  const labelTexts = labels.map(label => (label.description || '').toLowerCase());
  const allText = [...labelTexts, textContent].join(' ');
  
  for (const [condition, keywords] of Object.entries(CONDITION_KEYWORDS)) {
    const matchCount = keywords.filter(keyword => 
      allText.includes(keyword)
    ).length;
    
    if (matchCount > 0) {
      return condition;
    }
  }
  
  return 'good'; // Default condition
};

const extractFeatures = (labels: protos.google.cloud.vision.v1.IEntityAnnotation[], textContent: string, objects: protos.google.cloud.vision.v1.ILocalizedObjectAnnotation[]): string[] => {
  const features: string[] = [];
  const allText = [
    ...labels.map(l => (l.description || '').toLowerCase()),
    ...objects.map(o => (o.name || '').toLowerCase()),
    textContent
  ].join(' ');
  
  // Extract common features
  if (allText.includes('wireless') || allText.includes('bluetooth')) {
    features.push('Wireless Connectivity');
  }
  if (allText.includes('touch') || allText.includes('touchscreen')) {
    features.push('Touch Screen');
  }
  if (allText.includes('camera') || allText.includes('webcam')) {
    features.push('Camera');
  }
  if (allText.includes('speaker') || allText.includes('audio')) {
    features.push('Audio Output');
  }
  if (allText.includes('battery') || allText.includes('rechargeable')) {
    features.push('Rechargeable Battery');
  }
  if (allText.includes('keyboard') || allText.includes('typing')) {
    features.push('Physical Keyboard');
  }
  if (allText.includes('screen') || allText.includes('display')) {
    features.push('Display Screen');
  }
  
  return Array.from(new Set(features));
};

const calculateConfidence = (labels: protos.google.cloud.vision.v1.IEntityAnnotation[], textContent: string, objects: protos.google.cloud.vision.v1.ILocalizedObjectAnnotation[]): number => {
  let confidence = 0;
  
  // Base confidence from label scores
  if (labels.length > 0) {
    const avgScore = labels.reduce((sum, label) => sum + (label.score || 0), 0) / labels.length;
    confidence += avgScore * 0.4;
  }
  
  // Boost confidence if we found relevant text
  if (textContent.length > 10) {
    confidence += 0.3;
  }
  
  // Boost confidence if we found relevant objects
  if (objects.length > 0) {
    const avgObjectScore = objects.reduce((sum, obj) => sum + (obj.score || 0), 0) / objects.length;
    confidence += avgObjectScore * 0.3;
  }
  
  return Math.min(confidence, 1.0);
};

const estimateRecyclingValue = (
  deviceType: string, 
  condition: string, 
  brand?: string, 
  model?: string
): { suggestedRecyclingValue: number; environmentalImpact: any } => {
  // Base values by device type (in USD)
  const baseValues: { [key: string]: number } = {
    smartphone: 50,
    laptop: 200,
    tablet: 100,
    desktop: 150,
    tv: 75,
    monitor: 50,
    printer: 25,
    camera: 75,
    headphones: 30,
    speaker: 40,
    gaming: 100,
    router: 20,
    keyboard: 15,
    mouse: 10,
    other: 25
  };
  
  // Condition multipliers
  const conditionMultipliers: { [key: string]: number } = {
    excellent: 1.0,
    good: 0.8,
    fair: 0.5,
    poor: 0.2
  };
  
  // Brand multipliers (premium brands)
  const brandMultipliers: { [key: string]: number } = {
    apple: 1.3,
    samsung: 1.1,
    dell: 1.0,
    hp: 1.0,
    lenovo: 1.0,
    microsoft: 1.2,
    sony: 1.1,
    lg: 1.0,
    asus: 1.0,
    acer: 0.9
  };
  
  const baseValue = baseValues[deviceType] || 25;
  const conditionMultiplier = conditionMultipliers[condition] || 0.5;
  const brandMultiplier = brand ? (brandMultipliers[brand] || 1.0) : 1.0;
  
  const suggestedRecyclingValue = baseValue * conditionMultiplier * brandMultiplier;
  
  // Environmental impact estimates (CO2 in kg)
  const environmentalImpact = {
    co2Manufacturing: baseValue * 2, // Rough estimate
    co2Usage: baseValue * 0.5, // Rough estimate
    materialsRecoverable: ['Plastic', 'Metal', 'Glass', 'Electronics']
  };
  
  return { suggestedRecyclingValue, environmentalImpact };
};

export { vision };

    