'use client';
import {
  onAuthStateChanged,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import firebase_app from './client';
import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from 'react';

// Only create auth instance if Firebase is initialized
const auth = firebase_app ? getAuth(firebase_app) : null;
const googleProvider = new GoogleAuthProvider();

export const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
}>({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Firebase is not available, just set loading to false
    if (!auth || typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.warn('Auth state change error:', error);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const signInWithGoogle = async () => {
  if (!auth) {
    throw new Error('Firebase not initialized');
  }

  let result = null,
    error = null;
  try {
    result = await signInWithPopup(auth, googleProvider);
  } catch (e) {
    error = e;
  }

  return { result, error };
};

export const signInWithEmail = async (email: string, password: string) => {
  if (!auth) {
    throw new Error('Firebase not initialized');
  }

  let result = null,
    error = null;
  try {
    result = await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e;
    throw error;
  }
  return { result, error };
};

export const signUpWithEmail = async (email, password) => {
  let result = null,
      error = null;
  try {
      result = await createUserWithEmailAndPassword(auth, email, password);
  } catch (e) {
      error = e;
      throw error;
  }
  return { result, error };
};

export const logOut = async () => {
  if (!auth) {
    throw new Error('Firebase not initialized');
  }
  await signOut(auth);
};
