import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from './themed-text';
import { Note } from '../types/note';
import api from '@/lib/axios';
import NoteActionsModal from './NoteActionsModal';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Link , useRouter } from 'expo-router';

import { ArrowChevronSingleDownIcon } from './ui/ArrowChevronSingleDownIcon';
import { ChevronRightIcon } from './ui/ChevronRightIcon';
import { PageFilledDarkIcon } from './ui/PageFilledDarkIcon';
import { PageEmptyIcon } from './ui/PageEmptyIcon';
import { EllipsisIcon } from './ui/EllipsisIcon';
import { PlusSmallIcon } from './ui/PlusSmallIcon';

type NoteCardProps = {
  item: Note;
  onNoteUpdate: (notes: Note[]) => void;
  onToggleFavorite: (noteId: string, isFavorite: boolean) => void;
  onDelete: (noteId: string) => void;
  onToggleExpand: (noteId: string) => void;
  isExpanded: boolean;
  indentationLevel: number;
  notes: Note[];
};

const NoteCard: React.FC<NoteCardProps> = ({ item, onNoteUpdate, onToggleFavorite, onDelete, onToggleExpand, isExpanded, indentationLevel, notes }) => {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const handleToggleFavorite = () => {
    const newFavStatus = !item.is_favorite;
    api.patch(`/notes/${item.id}/favorite`, { isFavorite: newFavStatus }).then(() => {
      if (typeof onToggleFavorite === 'function') {
        onToggleFavorite(item.id, newFavStatus);
      }
    }).catch(err => {
        console.error('Failed to toggle favorite', err);
        Alert.alert('Erro', 'Não foi possível atualizar o favorito.');
    });
    setModalVisible(false);
  };

  const handleMoveToTrash = () => {
    if (typeof onDelete === 'function') {
      onDelete(item.id);
    }
    setModalVisible(false);
  };

  const handleDuplicate = () => {
    api.post(`/notes/${item.id}/duplicate`).then(response => {
        const newNote = response.data;
        const updatedNotes = [...notes, newNote];
        onNoteUpdate(updatedNotes);
    }).catch(err => {
        Alert.alert('Erro', 'Não foi possível duplicar a nota.');
    });
    setModalVisible(false);
  };
  
  const handleMakeOffline = (isOffline: boolean) => {
    api.patch(`/notes/${item.id}/offline`, { isOffline }).then(() => {
        const updatedNotes = notes.map(n => n.id === item.id ? {...n, is_offline: isOffline} : n);
        onNoteUpdate(updatedNotes);
    }).catch(err => {
        Alert.alert('Erro', 'Não foi possível alterar o status offline.');
    });
  };

  const handleCreateChild = () => {
    router.push({ pathname: '/create', params: { parentId: item.id } });
  };

  return (
    <View style={[styles.noteItem, { marginLeft: indentationLevel * 20 }]}>
      <TouchableOpacity onPress={() => onToggleExpand(item.id)} style={styles.nestedListview}>
        {isExpanded ? <ArrowChevronSingleDownIcon color={Colors[colorScheme ?? 'light'].icon} size={20} /> : <ChevronRightIcon color={Colors[colorScheme ?? 'light'].icon} size={20} />}
      </TouchableOpacity>
      <Link href={`/note/${item.id}`} style={styles.noteHead}>
        <View style={styles.noteHeadContent}>
          {item.title && item.description ? <PageFilledDarkIcon color={Colors[colorScheme ?? 'light'].icon} size={20} /> : <PageEmptyIcon color={Colors[colorScheme ?? 'light'].icon} size={20} />}
          <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
        </View>
      </Link>
      <View style={styles.noteTail}>
        <TouchableOpacity onPress={openModal}>
          <EllipsisIcon color={Colors[colorScheme ?? 'light'].icon} size={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCreateChild}>
          <PlusSmallIcon color={Colors[colorScheme ?? 'light'].icon} size={20} />
        </TouchableOpacity>
      </View>
      <NoteActionsModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        note={item}
        variant="all-notes"
        onToggleFavorite={handleToggleFavorite}
        onDuplicate={handleDuplicate}
        onMoveToTrash={handleMoveToTrash}
        onMakeOffline={handleMakeOffline}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  noteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10
  }, 
  noteHead: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  noteHeadContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  noteTail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});

export default NoteCard;
