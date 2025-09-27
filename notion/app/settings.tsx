import { useState } from 'react';
import { View, Button, Alert, ActivityIndicator } from 'react-native';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthProvider';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Stack } from 'expo-router';

export default function SettingsScreen() {
  const { setSession } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Deletar Conta Permanentemente',
      'Você tem certeza? Esta ação é irreversível e todos os seus dados, incluindo todas as suas notas, serão apagados para sempre.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eu entendo, deletar minha conta',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await api.delete('/users/me');
              Alert.alert('Conta Deletada', 'Sua conta foi deletada com sucesso.');
              // Log out the user, the AuthProvider will redirect to the login screen
              setSession(null);
            } catch (error: any) {
              const errorMessage = error.response?.data?.message || 'Não foi possível deletar a conta.';
              Alert.alert('Erro', errorMessage);
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <Stack.Screen options={{ title: 'Configurações' }} />
      <ThemedText type="title" style={{ marginBottom: 24 }}>Configurações</ThemedText>
      
      <ThemedText type="subtitle">Zona de Perigo</ThemedText>
      <View style={{ marginTop: 10, padding: 20, borderWidth: 1, borderColor: 'red', borderRadius: 8 }}>
        <ThemedText style={{ marginBottom: 10, lineHeight: 20 }}>
          Apagar sua conta é uma ação permanente e todos os seus dados serão perdidos para sempre. 
        </ThemedText>
        {loading ? (
          <ActivityIndicator size="large" color="red" />
        ) : (
          <Button
            title="Deletar Minha Conta"
            color="red"
            onPress={handleDeleteAccount}
          />
        )}
      </View>
    </ThemedView>
  );
}
