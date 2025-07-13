import { initializeApp } from 'firebase/app';
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
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

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
  const now = serverTimestamp() as Timestamp;
  const userRef = doc(db, 'users', profile.uid);
  await setDoc(userRef, {
    ...profile,
    createdAt: now,
    updatedAt: now
  });
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
  const analysisData = {
    ...analysis,
    createdAt: serverTimestamp()
  };
  
  const docRef = await addDoc(collection(db, 'device_analysis'), analysisData);
  return docRef.id;
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