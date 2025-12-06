import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';

import { StatusBar } from "react-native";

import { AuthProvider } from "@/context/AuthContext";

import './globals.css';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          <Stack.Screen name="stocks" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AuthProvider>
    </>
  );
}
