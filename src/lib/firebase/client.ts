import { initializeApp, getApps, type FirebaseApp, type FirebaseOptions } from 'firebase/app';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: "ecovision-1nn3s",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let firebase_app: FirebaseApp;

try {
  if (getApps().length === 0) {
    firebase_app = initializeApp(firebaseConfig);
  } else {
    firebase_app = getApps()[0];
  }
} catch (error) {
  console.error('Firebase initialization failed:', error);
  // In a real app, you might want to handle this more gracefully.
  // For this context, we'll proceed, but dependent services will fail.
  firebase_app = null as any; // Assign null and cast to avoid further type errors
}

export default firebase_app;
