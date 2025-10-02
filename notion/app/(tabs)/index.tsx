import { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Modal, TouchableOpacity, Text, Alert, Button } from 'react-native';
import api from '@/lib/axios';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthProvider';

import { Note } from '@/types/note';
import RecentNotes from '@/components/RecentNotes';
import AllFavoritesNotes from '@/components/AllFavoritesNotes';
import NoteTree from '@/components/NoteTree';

import { StarSlashIcon } from '@/components/ui/StarSlashIcon';
import { StarIcon } from '@/components/ui/StarIcon';
import { TrashIcon } from '@/components/ui/TrashIcon';

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [favoriteNotes, setFavoriteNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [childNodes, setChildNodes] = useState<Record<string, Note[]>>({});
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const { session, signOut } = useAuth();

  const fetchNotes = useCallback(async () => {
    if (!session) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/notes');
      setNotes(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch notes.';
      if (err.response?.status === 401) {
        signOut();
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [session, signOut]);

  const fetchFavoriteNotes = useCallback(async () => {
    if (!session) return;

    try {
      const response = await api.get('/notes/favorites');
      setFavoriteNotes(response.data);
    } catch (err: any) {
      console.error('Failed to fetch favorite notes.', err);
    }
  }, [session]);

  useEffect(() => {
    fetchNotes();
    fetchFavoriteNotes();
  }, [fetchNotes, fetchFavoriteNotes]);

  const handleToggleExpand = async (noteId: string) => {
    const isCurrentlyExpanded = !!expandedNotes[noteId];
    const newExpandedState = { ...expandedNotes, [noteId]: !isCurrentlyExpanded };
    setExpandedNotes(newExpandedState);

    if (!isCurrentlyExpanded && !childNodes[noteId]) {
      try {
        const response = await api.get(`/notes/${noteId}/children`);
        setChildNodes(prev => ({ ...prev, [noteId]: response.data }));
      } catch (err) {
        console.error(`Failed to fetch child notes for ${noteId}`, err);
        setExpandedNotes(expandedNotes); // Rollback on error
      }
    }
  };

  const openModal = (note: Note) => {
    setSelectedNote(note);
    setModalVisible(true);
  };

  const handleToggleFavorite = (id: string, isFavorite: boolean) => {
    const recursiveUpdate = (noteList: Note[]): Note[] => {
      return noteList.map(note => {
        if (note.id === id) {
          return { ...note, is_favorite: isFavorite };
        }
        return note;
      });
    };

    setNotes(prevNotes => recursiveUpdate(prevNotes));
    setChildNodes(prevChildNodes => {
      const newChildNodes: Record<string, Note[]> = {};
      for (const parentId in prevChildNodes) {
        newChildNodes[parentId] = recursiveUpdate(prevChildNodes[parentId]);
      }
      return newChildNodes;
    });

    if (isFavorite) {
      const noteToAdd = notes.find(note => note.id === id) || Object.values(childNodes).flat().find(note => note.id === id);
      if (noteToAdd) {
        setFavoriteNotes(prevFavorites => [...prevFavorites, { ...noteToAdd, is_favorite: true }]);
      }
    } else {
      setFavoriteNotes(prevFavorites => prevFavorites.filter(note => note.id !== id));
    }

    api.patch(`/notes/${id}/favorite`, { isFavorite }).catch(err => {
      console.error('Failed to toggle favorite', err);
    });
  };

  const handleDelete = (id: string) => {
    const recursiveDelete = (noteList: Note[]): Note[] => {
        return noteList.filter(note => note.id !== id);
    };

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
              setNotes(prevNotes => recursiveDelete(prevNotes));
              setFavoriteNotes(prevFavorites => prevFavorites.filter(note => note.id !== id));
              setChildNodes(prevChildNodes => {
                const newChildNodes: Record<string, Note[]> = {};
                for (const parentId in prevChildNodes) {
                  newChildNodes[parentId] = recursiveDelete(prevChildNodes[parentId]);
                }
                return newChildNodes;
              });
              setModalVisible(false);
            } catch (err: any) {
              Alert.alert('Erro', err.response?.data?.message || 'Não foi possível mover a nota.');
            }
          },
        },
      ]
    );
  };

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
          <RefreshControl refreshing={loading} onRefresh={() => { fetchNotes(); fetchFavoriteNotes(); }} />
        }
      >
        <RecentNotes notes={recentNotes} />
        <AllFavoritesNotes notes={favoriteNotes} onToggleFavorite={handleToggleFavorite} onDelete={handleDelete} />
        
        <View style={styles.container}>
          <ThemedText type="subtitle" style={styles.subtitle}>Particular</ThemedText>
          <NoteTree 
            notes={notes}
            openModal={openModal}
            onToggleExpand={handleToggleExpand}
            expandedNotes={expandedNotes}
            childNodes={childNodes}
          />
        </View>

      </ScrollView>

      {selectedNote && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPressOut={() => setModalVisible(false)}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedNote.title}</Text>
              <TouchableOpacity style={styles.modalButton} onPress={() => {
                handleToggleFavorite(selectedNote.id, !selectedNote.is_favorite);
                setModalVisible(false);
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                  {selectedNote.is_favorite ? <StarSlashIcon /> : <StarIcon />}
                  <Text style={styles.modalButtonText}>{selectedNote.is_favorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => handleDelete(selectedNote.id)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                  <TrashIcon />
                  <Text style={[styles.modalButtonText, { color: 'red' }]}>Mover para a Lixeira</Text>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
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
    },
    container: {
      flex: 1,
      marginBottom: 20,
    },
    subtitle: {
      color: '#838383',
      fontWeight: '500',
      fontSize: 14,
      marginBottom: 10,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    modalButton: {
      padding: 15,
      alignItems: 'center',
    },
    modalButtonText: {
      fontSize: 16,
    }
});
