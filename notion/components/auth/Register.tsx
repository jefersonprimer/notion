// /components/auth/Register.tsx

import { useState } from "react";
import { View, TextInput, Button, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import api from "@/lib/axios";
import { API_URL } from "@/constants/api";

type RegisterProps = {
  onSwitchToLogin: () => void;
};

export default function Register({ onSwitchToLogin }: RegisterProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signUp() {
    setLoading(true);
    setError(null);
    try {
      await api.post(`/signup`, { email, password });
      
      Alert.alert(
        "Cadastro realizado!", 
        "Você já pode fazer o login com suas credenciais."
      );
      onSwitchToLogin();

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Ocorreu um erro no cadastro.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 items-center justify-center gap-4 p-4">
      <Text className="text-2xl font-bold mb-4">Criar Conta</Text>

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
            <Button title="Cadastrar" onPress={signUp} disabled={loading} />
        </View>
      )}


      <Pressable onPress={onSwitchToLogin} className="mt-4">
        <Text className="text-blue-500">Já tem uma conta? Faça login</Text>
      </Pressable>
    </View>
  );
}
