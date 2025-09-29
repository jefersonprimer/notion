import { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, RefreshControl, Button, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import api from '@/lib/axios';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/context/AuthProvider';

import { Note } from '@/types/note';
import RecentNotes from '@/components/RecentNotes';
import AllNotes from '@/components/AllNotes';

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setSession } = useAuth();

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/notes');
      setNotes(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch notes.';
      if (errorMessage === 'Token invalid or expired.') {
        setSession(null);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [setSession]);

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [fetchNotes])
  );

  if (loading && notes.length === 0) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText type="subtitle" style={{ textAlign: 'center', marginBottom: 12 }}>Ocorreu um erro ao buscar suas notas.</ThemedText>
        <ThemedText style={{ marginBottom: 20 }}>{error}</ThemedText>
        <Button title="Tentar Novamente" onPress={fetchNotes} />
      </ThemedView>
    );
  }

  const recentNotes = notes.slice(0, 5);

  return (
    <ThemedView style={styles.flex1}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchNotes} />
        }
      >
        <RecentNotes notes={recentNotes} />
        <AllNotes notes={notes} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 24,
    }
})
