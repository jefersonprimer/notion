import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, Alert, Switch } from 'react-native';
import { ThemedText } from './themed-text';

import api from '@/lib/axios';

import NoteTree from './NoteTree';
import { Note } from '../types/note';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

import NoteActionsModal from './NoteActionsModal';

type AllFavoritesNotesProps = {
  notes: Note[];
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onDelete: (id: string) => void;
};

const AllFavoritesNotes: React.FC<AllFavoritesNotesProps> = ({ notes, onToggleFavorite, onDelete }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [parentNote, setParentNote] = useState<Note | null>(null);
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

  const handleToggleFavorite = () => {
    if (!selectedNote) return;
    onToggleFavorite(selectedNote.id, !selectedNote.is_favorite);
    setModalVisible(false);
  };

  const handleCopyLink = () => {
    if (!selectedNote) return;
    Alert.alert('Link Copiado', 'O link para a nota foi copiado.');
    setModalVisible(false);
  };

  const handleMoveTo = () => {
    if (!selectedNote) return;
    Alert.alert('Mover Para', 'Funcionalidade de mover ainda não implementada.');
    setModalVisible(false);
  };

  const openModal = async (note: Note) => {
    setSelectedNote(note);
    if (note.parentId) {
      const parent = notes.find(n => n.id === note.parentId);
      if (parent) {
        setParentNote(parent);
      } else {
        try {
          const response = await api.get(`/notes/${note.parentId}`);
          setParentNote(response.data);
        } catch (err) {
          console.error(`Failed to fetch parent note for ${note.id}`, err);
          setParentNote(null);
        }
      }
    } else {
      setParentNote(null);
    }
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.subtitle}>Favoritos</ThemedText>
      <NoteTree
        notes={notes}
        onToggleFavorite={onToggleFavorite}
        onDelete={onDelete}
        onNoteUpdate={() => {}}
        onToggleExpand={handleToggleExpand}
        expandedNotes={expandedNotes}
        childNodes={childNodes}
      />
      <NoteActionsModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        note={selectedNote}
        parentNote={parentNote}
        variant="favorites"
        onToggleFavorite={handleToggleFavorite}
        onCopyLink={handleCopyLink}
        onMoveTo={handleMoveTo}
      />
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
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#202020',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '500'
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: '400'
  },
  modalButton: {
    padding: 15,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#D4D4D4'
  }
});

export default AllFavoritesNotes;
