import { Link } from 'expo-router';
import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { ThemedText } from './themed-text';
import { Note } from '../types/note';
import { PageIconFilledDark } from './ui/PageIconFilledDark';
import { EllipsisIcon } from './ui/EllipsisIcon';
import { PlusSmall } from './ui/PlusSmall';
import { Ionicons } from '@expo/vector-icons';
import api from '@/lib/axios';

type AllNotesProps = {
  notes: Note[];
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onDelete: (id: string) => void;
};

const AllNotes: React.FC<AllNotesProps> = ({ notes, onToggleFavorite, onDelete }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  if (!notes || notes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText>No notes yet. Create one!</ThemedText>
      </View>
    );
  }

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

  const renderItem = ({ item }: { item: Note }) => (
    <View style={styles.noteItem}>
      <Link href={`/note/${item.id}`} style={styles.noteHead}>
        <PageIconFilledDark />
        <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
      </Link>
      <View style={styles.noteTail}>
        <TouchableOpacity onPress={() => handleToggleFavorite(item.id, !item.is_favorite)} style={{ marginRight: 15 }}>
          <Ionicons
            name={item.is_favorite ? 'star' : 'star-outline'}
            size={24}
            color={item.is_favorite ? '#FFC700' : '#838383'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openModal(item)}>
          <EllipsisIcon />
        </TouchableOpacity>
        <PlusSmall />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.subtitle}>Particular</ThemedText>
      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
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
                <Text style={styles.modalButtonText}>{selectedNote.is_favorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleDelete}>
                <Text style={[styles.modalButtonText, { color: 'red' }]}>Mover para a Lixeira</Text>
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
    paddingVertical: 12,
    gap: 12,
  },
  noteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  noteHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexShrink: 1,
  },
  noteTail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
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

export default AllNotes;
