import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { ThemedText } from './themed-text';

import api from '@/lib/axios';

import NoteTree from './NoteTree';
import { Note } from '../types/note';

import { StarIcon } from '@/components/ui/StarIcon';
import { StarSlashIcon } from '@/components/ui/StarSlashIcon';
import { TrashIcon } from '@/components/ui/TrashIcon';

type AllFavoritesNotesProps = {
  notes: Note[];
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onDelete: (id: string) => void;
};

const AllFavoritesNotes: React.FC<AllFavoritesNotesProps> = ({ notes, onToggleFavorite, onDelete }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [childNodes, setChildNodes] = useState<Record<string, Note[]>>({});

  if (!notes || notes.length === 0) {
    return null;
  }

  const handleToggleExpand = async (noteId: string) => {
    const isCurrentlyExpanded = !!expandedNotes[noteId];

    if (!isCurrentlyExpanded && !childNodes[noteId]) {
      try {
        const response = await api.get(`/notes/${noteId}/children`);
        setChildNodes(prev => ({ ...prev, [noteId]: response.data }));
        setExpandedNotes(prev => ({ ...prev, [noteId]: true }));
      } catch (err) {
        console.error(`Failed to fetch child notes for ${noteId}`, err);
        Alert.alert('Erro', 'Failed to fetch child notes');
      }
    } else {
      setExpandedNotes(prev => ({ ...prev, [noteId]: !isCurrentlyExpanded }));
    }
  };

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    onToggleFavorite(id, isFavorite);
    try {
      await api.patch(`/notes/${id}/favorite`, { isFavorite });
    } catch (err) {
      console.error('Failed to toggle favorite', err);
      onToggleFavorite(id, !isFavorite);
    }
  };

  const handleDelete = () => {
    if (!selectedNote) return;

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
              await api.delete(`/notes/${selectedNote.id}`);
              onDelete(selectedNote.id);
              setModalVisible(false);
            } catch (err: any) {
              Alert.alert('Erro', err.response?.data?.message || 'Não foi possível mover a nota.');
            }
          },
        },
      ]
    );
  };

  const openModal = (note: Note) => {
    setSelectedNote(note);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.subtitle}>Favoritos</ThemedText>
      <NoteTree
        notes={notes}
        openModal={openModal}
        onToggleExpand={handleToggleExpand}
        expandedNotes={expandedNotes}
        childNodes={childNodes}
      />
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
                  <StarSlashIcon />
                  <Text style={styles.modalButtonText}>Remover dos Favoritos</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleDelete}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                  <TrashIcon/>
                  <Text style={[styles.modalButtonText, { color: 'red' }]}>Mover para a Lixeira</Text>
                </View> 
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    color: '#838383',
    fontWeight: '500',
    fontSize: 14
  },
  listContent: {
    paddingVertical: 10
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
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

export default AllFavoritesNotes;
