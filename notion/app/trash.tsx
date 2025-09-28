import { useEffect, useState } from 'react';
import { View, FlatList, Button, Alert, ActivityIndicator } from 'react-native';
import api from '@/lib/axios';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Stack, useRouter } from 'expo-router';

import { Note } from '@/types/note';

type DeletedNote = Note;

export default function TrashScreen() {
  const [notes, setNotes] = useState<DeletedNote[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function fetchDeletedNotes() {
    setLoading(true);
    try {
      const response = await api.get('/notes/trash');
      setNotes(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar a lixeira.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDeletedNotes();
  }, []);

  const handleRestore = async (id: string) => {
    try {
      await api.post(`/notes/${id}/restore`);
      Alert.alert('Sucesso', 'A nota foi restaurada.');
      fetchDeletedNotes(); // Refresh the list
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível restaurar a nota.');
    }
  };

  const handlePermanentDelete = (id: string) => {
    Alert.alert(
      'Apagar Permanentemente',
      'Esta ação não pode ser desfeita. Tem certeza?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/notes/${id}/permanent`);
              Alert.alert('Sucesso', 'A nota foi apagada permanentemente.');
              fetchDeletedNotes(); // Refresh the list
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível apagar a nota.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: DeletedNote }) => (
    <View className="border-b border-gray-200 dark:border-gray-700 p-4 flex-row justify-between items-center">
      <View style={{ flex: 1 }}>
        <ThemedText type="subtitle">{item.title}</ThemedText>
        <ThemedText style={{ fontSize: 12, color: 'gray' }}>
          Deletada em: {new Date(item.deleted_at).toLocaleDateString()}
        </ThemedText>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button title="Restaurar" onPress={() => handleRestore(item.id)} />
        <Button title="Apagar" color="red" onPress={() => handlePermanentDelete(item.id)} />
      </View>
    </View>
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <Stack.Screen options={{ title: 'Lixeira' }} />
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" />
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ThemedText>A lixeira está vazia.</ThemedText>
            </View>
          }
        />
      )}
    </ThemedView>
  );
}
