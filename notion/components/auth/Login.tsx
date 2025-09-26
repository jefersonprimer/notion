// /components/auth/Login.tsx

import { useState } from "react";
import { View, TextInput, Button, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import api from "@/lib/axios";
import { API_URL } from "@/constants/api";
// Importar o hook do AuthContext para gerenciar o estado de autenticação
import { useAuth } from "@/context/AuthProvider";

type LoginProps = {
  onSwitchToRegister: () => void;
};

export default function Login({ onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Usar o setSession do AuthContext para atualizar o estado global
  const { setSession } = useAuth();

  async function signIn() {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/login`, { email, password });
      const { user, accessToken } = response.data;

      // Aqui, em vez de apenas logar, vamos atualizar o estado global da aplicação
      // O AuthProvider irá detectar a mudança e redirecionar o usuário
      setSession({
        access_token: accessToken,
        user: {
          id: user.id,
          email: user.email,
          // ... outros dados do usuário que a API retornar
        },
      });

      console.log("Login realizado com sucesso!");

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Ocorreu um erro no login.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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
