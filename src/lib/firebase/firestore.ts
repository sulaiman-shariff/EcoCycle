
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  type Firestore
} from 'firebase/firestore';
import firebase_app from './client';
import { getAuth, type Auth } from 'firebase/auth';

// Initialize Firestore
let db: Firestore;
let auth: Auth;

try {
  db = getFirestore(firebase_app!);
  auth = getAuth(firebase_app!);
  console.log('Firestore initialized successfully');
} catch (error) {
  console.error('Firestore initialization failed:', error);
  throw new Error('Firestore or Auth could not be initialized. Please check your Firebase configuration.');
}

// Utility to recursively remove undefined fields from an object
function removeUndefined(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  } else if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, removeUndefined(v)])
    );
  }
  return obj;
}

// Types
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  preferences: {
    region: string;
    units: 'metric' | 'imperial';
    notifications: boolean;
  };
  stats: {
    totalDevicesRecycled: number;
    totalCO2Saved: number;
    totalMaterialsRecovered: number;
    streakDays: number;
    lastRecycledDate?: Timestamp;
  };
}

export interface RecyclingRecord {
  id?: string;
  userId: string;
  deviceType: string;
  deviceBrand?: string;

  deviceModel?: string;
  deviceCondition: 'excellent' | 'good' | 'fair' | 'poor';
  deviceAge: number;
  deviceWeight: number;
  co2Saved: number;
  materialsRecovered: {
    [material: string]: number;
  };
  materialsValue: number;
  recycledAt: Timestamp;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  notes?: string;
  imageUrl?: string;
  visionAnalysis?: {
    deviceType: string;
    confidence: number;
    brand?: string;
    model?: string;
    condition?: string;
    features: string[];
  };
}

export interface DeviceAnalysis {
  id?: string;
  userId: string;
  imageUrl: string;
  analysisResult: {
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
  };
  createdAt: Timestamp;
}

export interface Analytics {
  id?: string;
  userId: string;
  date: Timestamp;
  metrics: {
    devicesRecycled: number;
    co2Saved: number;
    materialsValue: number;
    uniqueDeviceTypes: number;
  };
  region: string;
}

// User Profile Functions
export const createUserProfile = async (profile: Omit<UserProfile, 'createdAt' | 'updatedAt'>): Promise<void> => {
  try {
    if (!db) {
      throw new Error('Firestore not initialized');
    }
    const now = serverTimestamp() as Timestamp;
    const userRef = doc(db, 'users', profile.uid);
    await setDoc(userRef, {
      ...profile,
      createdAt: now,
      updatedAt: now
    });
  } catch (error) {
    console.error('Failed to create user profile:', error);
    throw new Error('Failed to create user profile. Please check your Firebase configuration.');
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  return null;
};

export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

export const updateUserStats = async (uid: string, stats: Partial<UserProfile['stats']>): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    [`stats.${Object.keys(stats)[0]}`]: Object.values(stats)[0],
    updatedAt: serverTimestamp()
  });
};

// Recycling Records Functions
export const addRecyclingRecord = async (record: Omit<RecyclingRecord, 'id' | 'recycledAt'>): Promise<string> => {
  const recordData = {
    ...record,
    recycledAt: serverTimestamp()
  };
  
  const docRef = await addDoc(collection(db, 'recycling_records'), recordData);
  return docRef.id;
};

export const getUserRecyclingHistory = async (userId: string, limitCount: number = 50): Promise<RecyclingRecord[]> => {
  const q = query(
    collection(db, 'recycling_records'),
    where('userId', '==', userId),
    orderBy('recycledAt', 'desc'),
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as RecyclingRecord[];
};

export const getRecyclingRecord = async (recordId: string): Promise<RecyclingRecord | null> => {
  const recordRef = doc(db, 'recycling_records', recordId);
  const recordSnap = await getDoc(recordRef);
  
  if (recordSnap.exists()) {
    return { id: recordSnap.id, ...recordSnap.data() } as RecyclingRecord;
  }
  return null;
};

export const updateRecyclingRecord = async (recordId: string, updates: Partial<RecyclingRecord>): Promise<void> => {
  const recordRef = doc(db, 'recycling_records', recordId);
  await updateDoc(recordRef, updates);
};

export const deleteRecyclingRecord = async (recordId: string): Promise<void> => {
  const recordRef = doc(db, 'recycling_records', recordId);
  await deleteDoc(recordRef);
};

// Device Analysis Functions
export const saveDeviceAnalysis = async (analysis: Omit<DeviceAnalysis, 'id' | 'createdAt'>): Promise<string> => {
  try {
    if (!db) {
      console.warn('Firestore not initialized, skipping device analysis save');
      return 'demo-id';
    }
    // Recursively remove undefined fields from analysis and analysisResult
    const sanitizedAnalysis = removeUndefined({
      ...analysis,
      analysisResult: removeUndefined(analysis.analysisResult),
      createdAt: serverTimestamp()
    });
    const docRef = await addDoc(collection(db, 'device_analysis'), sanitizedAnalysis);
    return docRef.id;
  } catch (error) {
    console.error('Failed to save device analysis:', error);
    // Don't throw error to prevent breaking the device analyzer
    console.warn('Device analysis will not be saved to database');
    return 'demo-id';
  }
};

export const getUserDeviceAnalysis = async (userId: string, limitCount: number = 20): Promise<DeviceAnalysis[]> => {
  const q = query(
    collection(db, 'device_analysis'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as DeviceAnalysis[];
};

// Analytics Functions
export const saveAnalytics = async (analytics: Omit<Analytics, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'analytics'), analytics);
  return docRef.id;
};

export const getUserAnalytics = async (userId: string, days: number = 30): Promise<Analytics[]> => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const q = query(
    collection(db, 'analytics'),
    where('userId', '==', userId),
    where('date', '>=', startDate),
    orderBy('date', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Analytics[];
};

// Aggregation Functions
export const getUserStats = async (userId: string): Promise<{
  totalDevices: number;
  totalCO2Saved: number;
  totalMaterialsValue: number;
  averageDevicesPerMonth: number;
  topDeviceTypes: { type: string; count: number }[];
  recyclingTrend: { date: string; count: number }[];
}> => {
  const records = await getUserRecyclingHistory(userId, 1000);
  
  const totalDevices = records.length;
  const totalCO2Saved = records.reduce((sum, record) => sum + record.co2Saved, 0);
  const totalMaterialsValue = records.reduce((sum, record) => sum + record.materialsValue, 0);
  
  // Calculate average devices per month
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
  const recentRecords = records.filter(record => 
    record.recycledAt.toDate() >= sixMonthsAgo
  );
  const averageDevicesPerMonth = recentRecords.length / 6;
  
  // Top device types
  const deviceTypeCounts: { [key: string]: number } = {};
  records.forEach(record => {
    deviceTypeCounts[record.deviceType] = (deviceTypeCounts[record.deviceType] || 0) + 1;
  });
  const topDeviceTypes = Object.entries(deviceTypeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Recycling trend (last 30 days)
  const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
  const recentRecordsForTrend = records.filter(record => 
    record.recycledAt.toDate() >= thirtyDaysAgo
  );
  
  const trendData: { [key: string]: number } = {};
  for (let i = 0; i < 30; i++) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    trendData[dateStr] = 0;
  }
  
  recentRecordsForTrend.forEach(record => {
    const dateStr = record.recycledAt.toDate().toISOString().split('T')[0];
    if (trendData[dateStr] !== undefined) {
      trendData[dateStr]++;
    }
  });
  
  const recyclingTrend = Object.entries(trendData)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
  
  return {
    totalDevices,
    totalCO2Saved,
    totalMaterialsValue,
    averageDevicesPerMonth,
    topDeviceTypes,
    recyclingTrend
  };
};

export { db, auth }; 

    