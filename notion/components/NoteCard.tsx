import React from 'react';

import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';
import { Note } from '../types/note';

import { ArrowChevronSingleDownIcon } from './ui/ArrowChevronSingleDownIcon';
import { ChevronRightIcon } from './ui/ChevronRightIcon';
import { PageFilledDarkIcon } from './ui/PageFilledDarkIcon';
import { PageEmptyIcon } from './ui/PageEmptyIcon';
import { EllipsisIcon } from './ui/EllipsisIcon';
import { PlusSmallIcon } from './ui/PlusSmallIcon';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';


import { Link , useRouter } from 'expo-router';

type NoteCardProps = {
  item: Note;
  openModal: (note: Note) => void;
  onToggleExpand: (noteId: string) => void;
  isExpanded: boolean;
  indentationLevel: number;
};

const NoteCard: React.FC<NoteCardProps> = ({ item, openModal, onToggleExpand, isExpanded, indentationLevel }) => {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const handleCreateChild = () => {
    router.push({ pathname: '/create', params: { parentId: item.id } });
  };

  return (
    <View style={[styles.noteItem, { marginLeft: indentationLevel * 20 }]}>
      <TouchableOpacity onPress={() => onToggleExpand(item.id)} style={styles.nestedListview}>
        {isExpanded ? <ArrowChevronSingleDownIcon /> : <ChevronRightIcon />}
      </TouchableOpacity>
      <Link href={`/note/${item.id}`} style={styles.noteHead}>
        <View style={styles.noteHeadContent}>
          {item.title && item.description ? <PageFilledDarkIcon /> : <PageEmptyIcon color={Colors[colorScheme ?? 'light'].text} />}
          <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
        </View>
      </Link>
      <View style={styles.noteTail}>
        <TouchableOpacity onPress={() => openModal(item)}>
          <EllipsisIcon />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCreateChild}>
          <PlusSmallIcon />
        </TouchableOpacity>
      </View>
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
