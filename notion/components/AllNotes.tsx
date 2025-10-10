import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';

import { Note } from '../types/note';
import NoteTree from './NoteTree';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

import { EllipsisIcon } from './ui/EllipsisIcon';
import { PlusSmallIcon } from './ui/PlusSmallIcon';
import { Link } from 'expo-router';

type AllNotesProps = {
  notes: Note[];
  onOpenModal: (note: Note) => void;
  onAddChild: (noteId: string) => void;
  onToggleExpand: (noteId: string) => void;
  expandedNotes: Record<string, boolean>;
  childNodes: Record<string, Note[]>;
};

const AllNotes: React.FC<AllNotesProps> = ({ 
  notes, 
  onOpenModal, 
  onAddChild, 
  onToggleExpand, 
  expandedNotes, 
  childNodes 
}) => {
  const colorScheme = useColorScheme();

  if (!notes || notes.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.title}>Particular</ThemedText>
        <View style={styles.headerIcons}>
          <EllipsisIcon color={Colors[colorScheme ?? 'light'].icon} size={20} />
          <Link href="/create">
            <PlusSmallIcon color={Colors[colorScheme ?? 'light'].icon} size={20} />
          </Link>
        </View>
      </View> 
      <NoteTree
        notes={notes}
        onToggleExpand={onToggleExpand}
        expandedNotes={expandedNotes}
        childNodes={childNodes}
        onOpenModal={onOpenModal}
        onAddChild={onAddChild}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
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
  title: {
    color: '#838383',
    fontWeight: '500',
    fontSize: 14,
    paddingVertical: 10
  },
});

export default AllNotes;
