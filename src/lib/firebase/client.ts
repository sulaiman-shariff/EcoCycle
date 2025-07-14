import { initializeApp, getApps, type FirebaseApp, type FirebaseOptions } from 'firebase/app';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBxJxJxJxJxJxJxJxJxJxJxJxJxJxJxJx",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "striped-sight-443116-g6.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "striped-sight-443116-g6",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "striped-sight-443116-g6.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdefghijklmnop",
};

// Initialize Firebase
let firebase_app: FirebaseApp;

try {
  if (getApps().length === 0) {
    firebase_app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
  } else {
    firebase_app = getApps()[0];
    console.log('Using existing Firebase app');
  }
} catch (error) {
  console.error('Firebase initialization failed:', error);
  console.warn('Firebase configuration may be incomplete. Please check your environment variables.');
  
  // Create a minimal app for development/testing
  try {
    firebase_app = initializeApp({
      apiKey: "demo-key",
      authDomain: "demo.firebaseapp.com",
      projectId: "demo-project",
      storageBucket: "demo-project.appspot.com",
      messagingSenderId: "123456789",
      appId: "1:123456789:web:demo"
    });
    console.warn('Using demo Firebase configuration');
  } catch (fallbackError) {
    console.error('Fallback Firebase initialization also failed:', fallbackError);
    firebase_app = null as any;
  }
}

export default firebase_app;
