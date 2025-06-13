// app/signin.tsx
import { useAuth } from '@/context/AuthContext';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';

export default function Profile() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themedStyles = styles(isDark);

  const onSubmit = async () => {
    try {
      await signIn(email, pass);
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <View style={themedStyles.container}>
      <View style={themedStyles.card}>
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
          secureTextEntry
          value={pass}
          onChangeText={setPass}
          style={themedStyles.input}
        />
        <Pressable style={themedStyles.button} onPress={onSubmit}>
          <Text style={themedStyles.buttonText}>Sign In</Text>
        </Pressable>
        {err && <Text style={themedStyles.error}>{err}</Text>}
      </View>
    </View>
  );
}

const styles = (isDark: boolean) => StyleSheet.create({
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
  error: {
    color: "#ff6b6b",
    marginTop: 12,
    textAlign: "center",
  },
});