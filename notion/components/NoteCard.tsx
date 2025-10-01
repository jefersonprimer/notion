import React from 'react';

import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';
import { Note } from '../types/note';

import { PageFilledDarkIcon } from './ui/PageFilledDarkIcon';
import { EllipsisIcon } from './ui/EllipsisIcon';
import { PlusSmallIcon } from './ui/PlusSmallIcon';

import { Link } from 'expo-router';

type NoteCardProps = {
  item: Note;
  handleToggleFavorite: (id: string, isFavorite: boolean) => void;
  openModal: (note: Note) => void;
};

const NoteCard: React.FC<NoteCardProps> = ({ item, handleToggleFavorite, openModal }) => (
  <View style={styles.noteItem}>
    <Link href={`/note/${item.id}`} style={styles.noteHead}>
      <PageFilledDarkIcon />
      <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
    </Link>
    <View style={styles.noteTail}>
      <TouchableOpacity onPress={() => openModal(item)}>
        <EllipsisIcon />
      </TouchableOpacity>
      <PlusSmallIcon />
    </View>
  </View>
);

const styles = StyleSheet.create({
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
});

export default NoteCard;
