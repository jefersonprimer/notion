import { useEffect, useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Button } from 'react-native';
import { useRouter } from 'expo-router';
import api from '@/lib/axios';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import HomeHeader from '@/components/HomeHeader';
import { useFocusEffect } from '@react-navigation/native';

// This type can be expanded if more fields are needed for display
type Note = {
  id: string;
  title: string;
};

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchNotes = useCallback(async () => {
    // Ensure loading is true at the start of a fetch, especially for pull-to-refresh
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/notes'); // Fetch from our backend
      setNotes(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch notes.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [fetchNotes])
  );

  function openNote(id: string) {
    router.push(`/note/${id}`);
  }

  const renderItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg mb-3 bg-white dark:bg-gray-800 shadow-sm"
      onPress={() => openNote(item.id)}
    >
      <ThemedText type="subtitle">{item.title}</ThemedText>
    </TouchableOpacity>
  );

  if (loading && notes.length === 0) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <HomeHeader />
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <HomeHeader />
        <ThemedText type="subtitle" style={{ textAlign: 'center', marginBottom: 12 }}>Ocorreu um erro ao buscar suas notas.</ThemedText>
        <ThemedText style={{ marginBottom: 20 }}>{error}</ThemedText>
        <Button title="Tentar Novamente" onPress={fetchNotes} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <HomeHeader />
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={{ paddingHorizontal: 16, marginTop: 10 }}
        ListEmptyComponent={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80 }}>
            <ThemedText type="subtitle">Nenhuma nota ainda.</ThemedText>
            <ThemedText style={{ marginTop: 8 }}>Use a aba "Criar Nota" para começar.</ThemedText>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchNotes} />
        }
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </ThemedView>
  );
}
