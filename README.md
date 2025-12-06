# Stock Tracker (Expo)

Cross-platform stock explorer built with Expo, React Native, and TypeScript. Search tickers, view multi-range price charts, see trending symbols, and sync a personal watchlist through Firebase.

## Features
- Home tab with Appwrite-powered trending stocks and a watchlist grid (falls back to curated tickers for signed-out users).
- Debounced search against Finnhub; searches are recorded to Appwrite to surface what people look up most.
- Detailed stock screen with profile + quote data, multi-interval charts (intraday/daily/weekly ranges), quick stats, and a link to the company site.
- Email/password auth via Firebase; watchlist is stored in Firestore and can be managed from the Account tab or the detail screen.
- Expo Router tab navigation with a custom highlighted tab bar, NativeWind styling, and charting via `react-native-chart-kit`.

## Tech Stack
- Expo Router, React Native 0.81, TypeScript.
- NativeWind/Tailwind for styling.
- Firebase Auth + Firestore for accounts and watchlists.
- Appwrite (cloud) for tracking search popularity and returning trending symbols.
- Data providers: Finnhub (profiles/search/quotes) and Alpha Vantage (time-series for charts).
- Charts: `react-native-chart-kit`; utilities in `services/chartUtils.ts`.

## Project Structure
- `app/_layout.tsx`: Root stack with global `AuthProvider`.
- `app/(tabs)/`: Tab layout and screens for Home (`index.tsx`), Search, and Account (`SignIn.tsx`).
- `app/stocks/[id].tsx`: Stock detail screen with chart + stats; `app/stocks/_layout.tsx` stack wrapper.
- `components/`: UI building blocks (cards, charts, search bar, icons, tab background).
- `services/`: API wrappers (`api.ts`), Appwrite client, chart helpers, fetch hook, and watchlist utilities.
- `context/AuthContext.tsx`: Firebase auth + Firestore watchlist logic.
- `constants/`: Colors, icons, image assets.
- `scripts/reset-project.js`: Helper to clean/reset project state.

## Getting Started
1. Install prerequisites: Node.js (LTS) and npm. Expo CLI is optional (`npx expo start` will prompt to install if missing).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (see below) in a `.env` file.
4. Run the app:
   ```bash
   npm start          # start Expo (web UI to choose platform)
   npm run android    # or ios / web
   ```
5. Lint (optional): `npm run lint`.

## Environment
Create a `.env` file in the project root with the keys below. Keep secrets private and restart Expo after changes.

```
FINNHUB_API_KEY=your_finnhub_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key

EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_appwrite_project_id
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
EXPO_PUBLIC_APPWRITE_TABLE_ID=your_metrics_collection_id

FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
FIREBASE_APP_ID=your_firebase_app_id
```

## Data Flow
- `services/api.ts` pulls profiles/quotes from Finnhub and time-series data from Alpha Vantage (used by `StockChart`).
- Searches call `updateSearchCount` in `services/appwrite.ts` to increment popularity and feed the trending list.
- Auth + watchlist storage live in `context/AuthContext.tsx` (Firebase Auth + Firestore).

## Notes
- Update `app.config.js` if you add new environment keys to `expo.extra`.
- Use `npm run reset-project` to clear caches and reinstall dependencies if Metro gets stuck.
