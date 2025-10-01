import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { ThemedText } from './themed-text';
import { Note } from '../types/note';
import api from '@/lib/axios';
import NoteCard from './NoteCard';

import { EllipsisIcon } from '@/components/ui/EllipsisIcon';
import { PlusSmallIcon } from '@/components/ui/PlusSmallIcon';
import { StarIcon } from '@/components/ui/StarIcon';
import { StarSlashIcon } from '@/components/ui/StarSlashIcon';
import { TrashIcon } from '@/components/ui/TrashIcon';

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
    <NoteCard 
      item={item}
      handleToggleFavorite={handleToggleFavorite}
      openModal={openModal}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.subtitle}>Particular</ThemedText>
        <View style={styles.headerIcons}>
          <EllipsisIcon />
          <PlusSmallIcon />
        </View>
      </View> 

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
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                  {selectedNote.is_favorite ? <StarSlashIcon  /> : <StarIcon />}
                  <Text style={styles.modalButtonText}>{selectedNote.is_favorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16
  },
  subtitle: {
    color: '#838383',
    fontWeight: '500',
    fontSize: 14
  },
  listContent: {
    paddingVertical: 12
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
