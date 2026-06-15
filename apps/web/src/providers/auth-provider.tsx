// ============================================================================
// AUTH CONTEXT — Firebase authentication provider with Local Storage fallback
// ============================================================================

"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut, updateProfile, type User } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  userRole: string | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Utility to sync user to Supabase and return their role
async function syncUserToSupabase(user: { uid: string; email: string; displayName: string | null }): Promise<string> {
  try {
    // First, check if the user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, role')
      .eq('firebase_uid', user.uid)
      .single();

    if (!existingUser) {
      // If user doesn't exist, insert them!
      const { error } = await supabase.from('users').insert({
        firebase_uid: user.uid,
        email: user.email,
        name: user.displayName || "FormForge User"
      });
      
      // Ignore duplicate key errors (code 23505) which happen during React Strict Mode concurrent renders
      if (error && error.code !== '23505') {
        console.error("Failed to sync user to Supabase. Full error:", JSON.stringify(error));
      }
      return 'user';
    }
    
    return existingUser.role || 'user';
  } catch (err) {
    console.error("Supabase sync exception:", err);
    return 'user';
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We will check BOTH Firebase and LocalStorage so fallbacks persist
    let unsubscribe = () => {};
    
    if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const role = await syncUserToSupabase({ uid: firebaseUser.uid, email: firebaseUser.email || '', displayName: firebaseUser.displayName });
          setUserRole(role);
          setUser(firebaseUser);
        } else {
          setUserRole(null);
          setUser(null);
        }
        setLoading(false);
      });
    } else {
      setUserRole(null);
      setUser(null);
      setLoading(false);
    }
    
    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) throw new Error("No Firebase Config");
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    const role = await syncUserToSupabase({ uid: result.user.uid, email, displayName: name });
    setUserRole(role);
  };

  const signIn = async (email: string, password: string) => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) throw new Error("No Firebase Config");
    const result = await signInWithEmailAndPassword(auth, email, password);
    const role = await syncUserToSupabase({ uid: result.user.uid, email: result.user.email || email, displayName: result.user.displayName });
    setUserRole(role);
  };

  const signInWithGoogle = async () => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) throw new Error("No Firebase Config");
    const result = await signInWithPopup(auth, googleProvider);
    const role = await syncUserToSupabase({ uid: result.user.uid, email: result.user.email || '', displayName: result.user.displayName });
    setUserRole(role);
  };

  const logout = async () => {
    try {
      if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        await signOut(auth);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUserRole(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, signUp, signIn, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
