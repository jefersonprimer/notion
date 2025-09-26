// /components/auth/Register.tsx

import { useState } from "react";
import { View, TextInput, Button, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import { supabase } from "@/lib/supabase";

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
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      // É uma boa prática avisar o usuário para checar o email
      Alert.alert("Cadastro realizado!", "Por favor, verifique seu e-mail para confirmar sua conta.");
      onSwitchToLogin(); // Opcional: volta para a tela de login após o cadastro
    }
    setLoading(false);
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
