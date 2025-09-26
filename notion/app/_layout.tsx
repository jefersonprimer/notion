import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/context/AuthProvider'; // 1. Importar nosso AuthProvider

export const unstable_settings = {
  initialRouteName: 'splash',
};

// 2. Layout principal com todas as rotas
const InitialLayout = () => {
  return (
    <Stack>
      {/* Tela de splash */}
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      {/* Nossas duas rotas principais: a de autenticação e a do app */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
};


// 3. O layout principal agora usa o AuthProvider
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    // O AuthProvider se torna o container mais externo
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <InitialLayout />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
