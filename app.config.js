import 'dotenv/config';
export default {
  expo: {
    extra: {
      ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY,

      FINNHUB_API_KEY: process.env.FINNHUB_API_KEY,

      APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID,
      
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    },
  },
};