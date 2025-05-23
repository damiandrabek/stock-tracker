// app/signin.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function SignIn() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async () => {
    try {
      await signIn(email, pass);
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{borderWidth:1,marginBottom:8}}/>
      <TextInput placeholder="Password" secureTextEntry value={pass} onChangeText={setPass} style={{borderWidth:1,marginBottom:8}}/>
      <Button title="Sign In" onPress={onSubmit} />
      {err && <Text style={{ color: 'red' }}>{err}</Text>}
    </View>
  );
}