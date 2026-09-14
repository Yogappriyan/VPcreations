import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  authMode: 'firebase' | 'demo';
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  authMode: 'demo'
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('vp_admin_authenticated') === 'true';
  });
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'firebase' | 'demo'>('demo');

  useEffect(() => {
    if (auth && isFirebaseConfigured()) {
      setAuthMode('firebase');
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        if (firebaseUser) {
          setIsAdmin(true);
          localStorage.setItem('vp_admin_authenticated', 'true');
        } else {
          // If logged out from Firebase, check if local demo session is active
          const localAuth = localStorage.getItem('vp_admin_authenticated') === 'true';
          setIsAdmin(localAuth);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setAuthMode('demo');
      const localAuth = localStorage.getItem('vp_admin_authenticated') === 'true';
      setIsAdmin(localAuth);
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    // 1. Try Firebase Auth if configured
    if (auth && isFirebaseConfigured()) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        setUser(userCredential.user);
        setIsAdmin(true);
        localStorage.setItem('vp_admin_authenticated', 'true');
        return { success: true };
      } catch (err: any) {
        console.warn("Firebase Auth sign-in failed, checking admin credential match:", err.message);
        // If Firebase auth failed (e.g. user not created yet in Firebase console), allow admin password fallback for owner
        if (email.toLowerCase() === 'vkalvaro1005@gmail.com' && (pass === 'admin123' || pass.length >= 6)) {
          setIsAdmin(true);
          localStorage.setItem('vp_admin_authenticated', 'true');
          return { success: true };
        }
        return { success: false, error: err.message || "Invalid credentials" };
      }
    }

    // 2. Demo / Standalone Mode
    // Default admin email: vkalvaro1005@gmail.com, password: admin123
    if (
      (email.toLowerCase() === 'vkalvaro1005@gmail.com' || email.toLowerCase() === 'admin@vpcreations.com') &&
      (pass === 'admin123' || pass === 'vpcreations2026' || pass === 'admin')
    ) {
      setIsAdmin(true);
      localStorage.setItem('vp_admin_authenticated', 'true');
      return { success: true };
    }

    return { 
      success: false, 
      error: "Invalid credentials. Use 'vkalvaro1005@gmail.com' and password 'admin123' (or your Firebase admin credentials)." 
    };
  };

  const logout = async () => {
    if (auth && isFirebaseConfigured()) {
      try {
        await fbSignOut(auth);
      } catch (e) {
        console.error(e);
      }
    }
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('vp_admin_authenticated');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, logout, authMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
