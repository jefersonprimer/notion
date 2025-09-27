import { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import api from '@/lib/axios';
import { useDebounce } from '@/hooks/use-debouncer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

type Note = {
  id: string;
  title: string;
};

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.trim() === '') {
      setResults([]);
      return;
    }

    setLoading(true);
    api.get(`/notes/search?q=${debouncedQuery}`)
      .then(response => {
        setResults(response.data);
      })
      .catch(error => {
        console.error("Search failed:", error);
        // Optionally set an error state to show in the UI
      })
      .finally(() => {
        setLoading(false);
      });
  }, [debouncedQuery]);

  const styles = StyleSheet.create({
    input: {
      fontSize: 18,
      padding: 12,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: Colors[colorScheme ?? 'light'].gray,
      color: Colors[colorScheme ?? 'light'].text,
      backgroundColor: Colors[colorScheme ?? 'light'].backgroundOffset,
      marginBottom: 20,
    },
  });

  const renderItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      className="border-b border-gray-200 dark:border-gray-700 py-3"
      onPress={() => router.push(`/note/${item.id}`)}
    >
      <ThemedText type="subtitle">{item.title}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={{ flex: 1, padding: 16, paddingTop: 40 }}>
      <ThemedText type="title" style={{ marginBottom: 24 }}>Busca</ThemedText>
      <TextInput
        placeholder="Digite para buscar..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
        placeholderTextColor={Colors[colorScheme ?? 'light'].gray}
        autoFocus
      />

      {loading ? (
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={{marginTop: 50, alignItems: 'center'}}>
              <ThemedText style={{ textAlign: 'center' }}>
                {debouncedQuery ? 'Nenhum resultado encontrado.' : 'Busque por título ou descrição.'}
              </ThemedText>
            </View>
          }
        />
      )}
    </ThemedView>
  );
}
