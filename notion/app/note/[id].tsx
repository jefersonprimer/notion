import { useEffect, useState } from 'react';
import { View, TextInput, Text, Button, Alert, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '@/lib/axios';
import { useDebounce } from '@/hooks/use-debouncer';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function NoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();

  // Note content state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // UI editing state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce title and description for auto-saving
  const debouncedTitle = useDebounce(title, 500);
  const debouncedDescription = useDebounce(description, 500);

  // Fetch initial note data
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/notes/${id}`)
      .then(response => {
        setTitle(response.data.title);
        setDescription(response.data.description || '');
      })
      .catch(err => setError(err.response?.data?.message || 'Failed to fetch note.'))
      .finally(() => setLoading(false));
  }, [id]);

  // Auto-save title when debounced value changes
  useEffect(() => {
    if (debouncedTitle !== undefined && !loading) { // Avoid saving on initial fetch
      api.put(`/notes/${id}`, { title: debouncedTitle });
    }
  }, [debouncedTitle]);

  // Auto-save description when debounced value changes
  useEffect(() => {
    if (debouncedDescription !== undefined && !loading) { // Avoid saving on initial fetch
      api.put(`/notes/${id}`, { description: debouncedDescription });
    }
  }, [debouncedDescription]);

  const handleDelete = () => {
    Alert.alert(
      'Mover para a Lixeira',
      'Tem certeza que quer mover esta nota para a lixeira?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Mover',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/notes/${id}`);
              Alert.alert('Sucesso', 'Nota movida para a lixeira.');
              router.back();
            } catch (err: any) {
              Alert.alert('Erro', err.response?.data?.message || 'Não foi possível mover a nota.');
            }
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        paddingVertical: 10,
        color: Colors[colorScheme ?? 'light'].text,
    },
    description: {
        fontSize: 18,
        paddingVertical: 10,
        lineHeight: 24,
        color: Colors[colorScheme ?? 'light'].text,
    },
  });

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  if (error) {
    return <ThemedText>Error: {error}</ThemedText>;
  }

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
        {isEditingTitle ? (
            <TextInput
                value={title}
                onChangeText={setTitle}
                onBlur={() => setIsEditingTitle(false)}
                autoFocus
                style={styles.title}
            />
        ) : (
            <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
                <Text style={styles.title}>{title || 'Sem Título'}</Text>
            </TouchableOpacity>
        )}

        {isEditingDescription ? (
            <TextInput
                value={description}
                onChangeText={setDescription}
                onBlur={() => setIsEditingDescription(false)}
                autoFocus
                multiline
                style={styles.description}
            />
        ) : (
            <TouchableOpacity onPress={() => setIsEditingDescription(true)}>
                <Text style={styles.description}>{description || 'Sem descrição'}</Text>
            </TouchableOpacity>
        )}

        <View style={{ marginTop: 'auto', paddingTop: 20 }}>
            <Button title="Mover para Lixeira" color="red" onPress={handleDelete} />
        </View>
    </ThemedView>
  );
}
