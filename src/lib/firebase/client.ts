import { initializeApp, getApps, type FirebaseOptions } from 'firebase/app';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Only initialize Firebase if we're in the browser and have valid config
let firebase_app = null;

// Check if we're in a browser environment and have required config
const isBrowser = typeof window !== 'undefined';
const hasValidConfig = firebaseConfig.apiKey && firebaseConfig.projectId;

if (isBrowser && hasValidConfig) {
  try {
    firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
    firebase_app = null;
  }
} else if (!isBrowser) {
  // Server-side: don't initialize Firebase
  firebase_app = null;
} else {
  // Browser but missing config
  console.warn('Firebase config missing. Check your environment variables.');
  firebase_app = null;
}

export default firebase_app;
