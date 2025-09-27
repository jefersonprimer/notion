// /components/auth/Login.tsx

import { useState } from "react";
import { View, TextInput, Button, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import api from "@/lib/axios";
import { API_URL } from "@/constants/api";
import { useAuth } from "@/context/AuthProvider";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

type LoginProps = {
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
};

export default function Login({ onSwitchToRegister, onSwitchToForgotPassword }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { setSession } = useAuth();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  async function signIn() {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/users/login`, { email, password });
      const { user, accessToken } = response.data;

      setSession({
        access_token: accessToken,
        user: {
          id: user.id,
          email: user.email,
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
    <View className="flex-1 items-center justify-center gap-4 p-4" style={{ backgroundColor: themeColors.background }}>
      <Text className="text-2xl font-bold mb-4" style={{ color: themeColors.text }}>Entrar</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor={themeColors.text}
        value={email}
        onChangeText={setEmail}
        className={`border w-full p-3 rounded-lg ${colorScheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}
        style={{ color: themeColors.text }}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Senha"
        placeholderTextColor={themeColors.text}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        className={`border w-full p-3 rounded-lg ${colorScheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}
        style={{ color: themeColors.text }}
      />

      {error && <Text className="text-red-500 mt-2">{error}</Text>}
      
      {loading ? (
        <ActivityIndicator size="large" color={themeColors.tint} />
      ) : (
        <View className="w-full">
            <Button title="Entrar" onPress={signIn} disabled={loading} color={themeColors.tint} />
        </View>
      )}

      <Pressable onPress={onSwitchToRegister} className="mt-4">
        <Text className="text-blue-500">Não tem uma conta? Cadastre-se</Text>
      </Pressable>

      <Pressable onPress={onSwitchToForgotPassword} className="mt-2">
        <Text className="text-gray-500">Esqueceu sua senha?</Text>
      </Pressable>
    </View>
  );
}
