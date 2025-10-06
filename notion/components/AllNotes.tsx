import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ThemedText } from './themed-text';
import { Note } from '../types/note';
import api from '@/lib/axios';
import NoteTree from './NoteTree';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

import { EllipsisIcon } from '@/components/ui/EllipsisIcon';
import { PlusSmallIcon } from '@/components/ui/PlusSmallIcon';

type AllNotesProps = {
  notes: Note[];
  onNoteUpdate: (notes: Note[]) => void;
};

const AllNotes: React.FC<AllNotesProps> = ({ notes, onNoteUpdate }) => {
  const colorScheme = useColorScheme();

  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [childNodes, setChildNodes] = useState<Record<string, Note[]>>({});

  if (!notes || notes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText>No notes yet. Create one!</ThemedText>
      </View>
    );
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.subtitle}>Particular</ThemedText>
        <View style={styles.headerIcons}>
          <EllipsisIcon color={Colors[colorScheme ?? 'light'].icon} size={20} />
          <PlusSmallIcon color={Colors[colorScheme ?? 'light'].icon} size={20} />
        </View>
      </View> 

      <NoteTree
        notes={notes}
        onNoteUpdate={onNoteUpdate}
        onToggleExpand={handleToggleExpand}
        expandedNotes={expandedNotes}
        childNodes={childNodes}
      />
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
  } 
});

export default AllNotes;
