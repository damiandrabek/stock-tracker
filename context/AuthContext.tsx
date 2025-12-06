import React, { createContext, useContext, useEffect, useState } from "react";
import { initFirebase } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  watchlist: string[];
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  addToWatchlist: (symbol: string) => Promise<void>;
  removeFromWatchlist: (symbol: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({} as any);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { auth, app } = initFirebase();
  const db = getFirestore(app);
  const [user, setUser] = useState<User | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Load the watchlist from Firestore when the user logs in
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setWatchlist(docSnap.data().watchlist || []);
        } else {
          // Create a new user document with an empty watchlist
          await setDoc(docRef, { watchlist: [] });
          setWatchlist([]);
        }
      } else {
        setWatchlist([]);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign up new users
  const signUp = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userCredential.user.uid;
    await setDoc(doc(db, "users", uid), { watchlist: [] });
    return userCredential;
  };

  // Sign in existing users
  const signIn = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

  // Sign out
  const logout = () => signOut(auth);

  // Add stock to watchlist
  const addToWatchlist = async (symbol: string) => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    await updateDoc(docRef, {
      watchlist: arrayUnion(symbol),
    });
    setWatchlist((curr) => [...curr, symbol]);
  };

  // Remove stock from watchlist
  const removeFromWatchlist = async (symbol: string) => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    await updateDoc(docRef, {
      watchlist: arrayRemove(symbol),
    });
    setWatchlist((curr) => curr.filter((s) => s !== symbol));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        watchlist,
        signUp,
        signIn,
        logout,
        addToWatchlist,
        removeFromWatchlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
