// context/AuthContext.tsx
import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { initFirebase } from '../firebaseConfig';

interface AuthContextType {
  user: User | null;
  signIn: (email: string, pass: string) => Promise<UserCredential>;
  signUp: (email: string, pass: string) => Promise<UserCredential>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as any);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth } = initFirebase();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  const signIn = (email: string, pass: string) =>
    signInWithEmailAndPassword(auth, email, pass);

  const signUp = (email: string, pass: string) =>
    createUserWithEmailAndPassword(auth, email, pass);

  const signOutUser = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);