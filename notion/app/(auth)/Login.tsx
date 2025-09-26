// /app/(auth)/Login.tsx

import { useState } from "react";
import { View } from "react-native";
import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";

export default function AuthScreen() {
  // Estado para controlar a visualização: true para Login, false para Cadastro
  const [isLoginView, setIsLoginView] = useState(true);

  if (isLoginView) {
    // Se isLoginView for true, mostra a tela de Login
    // Passamos uma função para que a tela de Login possa mudar para a de Cadastro
    return <Login onSwitchToRegister={() => setIsLoginView(false)} />;
  } else {
    // Caso contrário, mostra a tela de Cadastro
    // Passamos uma função para que a tela de Cadastro possa voltar para a de Login
    return <Register onSwitchToLogin={() => setIsLoginView(true)} />;
  }
}
