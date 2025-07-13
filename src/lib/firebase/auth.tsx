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

const auth = getAuth(firebase_app);
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const signInWithGoogle = async () => {
  let result = null,
    error = null;
  try {
    result = await signInWithPopup(auth, googleProvider);
  } catch (e) {
    error = e;
  }

  return { result, error };
};

export const signInWithEmail = async (email, password) => {
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
  await signOut(auth);
};
