// firebaseConfig.ts
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { Analytics, getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA73tyPV-fjC5mCCL3xvSFezfFu81secpo",
  authDomain: "stock-tracker-ed94e.firebaseapp.com",
  projectId: "stock-tracker-ed94e",
  storageBucket: "stock-tracker-ed94e.firebasestorage.app",
  messagingSenderId: "711918759047",
  appId: "1:711918759047:web:b8fc0cece36f0787a61c22",
  measurementId: "G-QKHEY7FRCB"
};

let app: FirebaseApp;
let auth: Auth;
let analytics: Analytics;

export function initFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    analytics = getAnalytics(app);
  }
  return { app, auth,  };
}
