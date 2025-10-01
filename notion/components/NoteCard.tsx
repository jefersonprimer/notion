import React from 'react';

import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';
import { Note } from '../types/note';

import { PageFilledDarkIcon } from './ui/PageFilledDarkIcon';
import { EllipsisIcon } from './ui/EllipsisIcon';
import { PlusSmallIcon } from './ui/PlusSmallIcon';
import { ChevronRightIcon } from './ui/ChevronRightIcon';

import { Link } from 'expo-router';

type NoteCardProps = {
  item: Note;
  handleToggleFavorite: (id: string, isFavorite: boolean) => void;
  openModal: (note: Note) => void;
};

const NoteCard: React.FC<NoteCardProps> = ({ item, handleToggleFavorite, openModal }) => (
  <View style={styles.noteItem}>
    <View style={styles.nestedListview}>
      <ChevronRightIcon/>
    </View>
    <Link href={`/note/${item.id}`} style={styles.noteHead}>
      <View style={styles.noteHeadContent}>
        <PageFilledDarkIcon />
        <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
      </View> 
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
