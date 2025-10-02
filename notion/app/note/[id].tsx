import { useEffect, useState } from 'react';
import { View, TextInput, Text, Alert, ActivityIndicator, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import api from '@/lib/axios';
import { useDebounce } from '@/hooks/use-debouncer';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

import { AngleLeftIcon } from '@/components/ui/AngleLeftIcon';
import { StarIcon } from '@/components/ui/StarIcon';
import { StarSlashIcon } from '@/components/ui/StarSlashIcon';
import { TrashIcon } from '@/components/ui/TrashIcon';
import { Note } from '@/types/note';
import ChildNoteCard from '@/components/ChildNoteCard';

export default function NoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();

  // Note content state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [children, setChildren] = useState<Note[]>([]);

  // UI editing state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);

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
        setIsFavorite(response.data.is_favorite);
      })
      .catch(err => setError(err.response?.data?.message || 'Failed to fetch note.'))
      .finally(() => setLoading(false));

    api.get(`/notes/${id}/children`)
      .then(response => {
        setChildren(response.data);
      })
      .catch(err => console.error('Failed to fetch child notes.', err));
  }, [id]);

  // Auto-save title when debounced value changes
  useEffect(() => {
    if (debouncedTitle !== undefined && !loading) { // Avoid saving on initial fetch
      api.put(`/notes/${id}`, { title: debouncedTitle });
    }
  }, [debouncedTitle, id, loading]);

  // Auto-save description when debounced value changes
  useEffect(() => {
    if (debouncedDescription !== undefined && !loading) { // Avoid saving on initial fetch
      api.put(`/notes/${id}`, { description: debouncedDescription });
    }
  }, [debouncedDescription, id, loading]);

  const handleToggleFavorite = async () => {
    try {
      const newIsFavorite = !isFavorite;
      setIsFavorite(newIsFavorite);
      await api.patch(`/notes/${id}/favorite`, { isFavorite: newIsFavorite });
    } catch (err) {
      console.error('Failed to toggle favorite', err);
      // Revert the state if the API call fails
      setIsFavorite(!isFavorite);
      Alert.alert('Error', 'Failed to update favorite status.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Mover para a Lixeira',
      'Tem certeza que quer mover esta nota para a lixeira?',
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => setModalVisible(false) },
        {
          text: 'Mover',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/notes/${id}`);
              Alert.alert('Sucesso', 'Nota movida para a lixeira.');
              setModalVisible(false);
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
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: Colors[colorScheme ?? 'light'].background,
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    modalButton: {
        padding: 15,
        alignItems: 'flex-start',
    },
    modalButtonText: {
        fontSize: 18,
    }
  });

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  if (error) {
    return <ThemedText>Error: {error}</ThemedText>;
  }

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
        <Stack.Screen
            options={{
                headerTitle: '',
                headerBackVisible: false,
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                        <AngleLeftIcon color={Colors[colorScheme ?? 'light'].text} />
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Ionicons name="ellipsis-horizontal" size={24} color={Colors[colorScheme ?? 'light'].text} />
                    </TouchableOpacity>
                ),
            }}
        />
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

        {children.length > 0 && (
          <View style={{ marginTop: 20 }}>
            {children.map(child => (
              <ChildNoteCard key={child.id} item={child} />
            ))}
          </View>
        )}

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPressOut={() => setModalVisible(false)}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.modalButton} onPress={handleToggleFavorite}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {isFavorite ? <StarSlashIcon color={Colors[colorScheme ?? 'light'].text} /> : <StarIcon color={Colors[colorScheme ?? 'light'].text} />}
                            <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>
                                {isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalButton} onPress={handleDelete}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TrashIcon color={Colors[colorScheme ?? 'light'].text}/>
                        <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>Mover para Lixeira</Text>
                      </View>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    </ThemedView>
  );
}
