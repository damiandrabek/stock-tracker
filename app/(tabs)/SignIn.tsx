import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
} from "react-native";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themedStyles = styles(isDark);

  const { signUp, signIn, user, logout, watchlist } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    setError("");
    try {
      await signUp(email.trim(), password);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleSignIn = async () => {
    setError("");
    try {
      await signIn(email.trim(), password);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={themedStyles.container}>
      <View style={themedStyles.card}>
        {user ? (
          <>
            <Text style={themedStyles.title}>Profile</Text>
            <Text style={themedStyles.subtitle}>{user.email}</Text>

            <Pressable style={[themedStyles.button, themedStyles.logout]} onPress={logout}>
              <Text style={themedStyles.buttonText}>Sign Out</Text>
            </Pressable>

            <Text style={[themedStyles.sectionTitle, { marginTop: 16 }]}>Your Watchlist</Text>
            {watchlist?.length ? (
              watchlist.map((item) => (
                <Text key={item} style={themedStyles.listItem}>
                  • {item}
                </Text>
              ))
            ) : (
              <Text style={themedStyles.muted}>No items yet. Save a stock to see it here.</Text>
            )}
          </>
        ) : (
          <>
            <Text style={themedStyles.title}>Sign In</Text>
            <TextInput
              placeholder="Email"
              placeholderTextColor={isDark ? "#b8c1ec" : "#adb5bd"}
              value={email}
              onChangeText={setEmail}
              style={themedStyles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor={isDark ? "#b8c1ec" : "#adb5bd"}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={themedStyles.input}
            />
            <View className="flex-row gap-x-4">
              <Pressable style={themedStyles.button} onPress={handleSignUp}>
                <Text style={themedStyles.buttonText}>Register</Text>
              </Pressable>
              <Pressable style={themedStyles.button} onPress={handleSignIn}>
                <Text style={themedStyles.buttonText}>Sign In</Text>
              </Pressable>
            </View>

            {error && <Text style={themedStyles.error}>{error}</Text>}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#181926" : "#f7f8fa",
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
    },
    card: {
      backgroundColor: isDark ? "#232946" : "#fff",
      borderRadius: 18,
      padding: 24,
      width: "100%",
      maxWidth: 360,
      shadowColor: isDark ? "#000" : "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      alignItems: "center",
    },
    title: {
      fontSize: 26,
      fontWeight: "bold",
      color: isDark ? "#a6e3e9" : "#3a5a40",
      marginBottom: 18,
      textAlign: "center",
    },
    input: {
      width: "100%",
      borderWidth: 1,
      borderColor: isDark ? "#393e46" : "#e9ecef",
      backgroundColor: isDark ? "#181926" : "#f7f8fa",
      color: isDark ? "#f7f7fa" : "#232946",
      borderRadius: 10,
      padding: 12,
      marginBottom: 14,
      fontSize: 16,
    },
    button: {
      backgroundColor: "#3a86ff",
      borderRadius: 24,
      paddingVertical: 12,
      paddingHorizontal: 32,
      alignSelf: "center",
      marginTop: 8,
      shadowColor: "#3a86ff",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 2,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 18,
      letterSpacing: 0.5,
      textAlign: "center",
    },
    logout: {
      backgroundColor: "#ef4444",
      marginTop: 12,
      width: "100%",
    },
    error: {
      color: "#ff6b6b",
      marginTop: 12,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      color: isDark ? "#e5e7eb" : "#374151",
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: isDark ? "#f8fafc" : "#111827",
      marginBottom: 8,
      alignSelf: "flex-start",
    },
    listItem: {
      fontSize: 16,
      color: isDark ? "#e5e7eb" : "#1f2937",
      marginBottom: 6,
      alignSelf: "flex-start",
    },
    muted: {
      fontSize: 15,
      color: isDark ? "#9ca3af" : "#6b7280",
      alignSelf: "flex-start",
    },
  });
