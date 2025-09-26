// /components/auth/Login.tsx

import { useState } from "react";
import { View, TextInput, Button, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import { supabase } from "@/lib/supabase";

type LoginProps = {
  onSwitchToRegister: () => void;
};

export default function Login({ onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      // O AuthProvider vai detectar a mudança de sessão e redirecionar automaticamente
      console.log("Login realizado com sucesso!");
    }
    setLoading(false);
  }

  return (
    <View className="flex-1 items-center justify-center gap-4 p-4">
      <Text className="text-2xl font-bold mb-4">Entrar</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="border w-full p-3 rounded-lg bg-gray-100"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Senha"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        className="border w-full p-3 rounded-lg bg-gray-100"
      />

      {error && <Text className="text-red-500 mt-2">{error}</Text>}
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View className="w-full">
            <Button title="Entrar" onPress={signIn} disabled={loading} />
        </View>
      )}

      <Pressable onPress={onSwitchToRegister} className="mt-4">
        <Text className="text-blue-500">Não tem uma conta? Cadastre-se</Text>
      </Pressable>
    </View>
  );
}
