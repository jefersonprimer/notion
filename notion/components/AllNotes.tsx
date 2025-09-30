import { Link } from 'expo-router';
import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { ThemedText } from './themed-text';
import { Note } from '../types/note';
import { PageIconFilledDark } from './ui/PageIconFilledDark';
import { EllipsisIcon } from './ui/EllipsisIcon';
import { PlusSmall } from './ui/PlusSmall';


type AllNotesProps = {
  notes: Note[];
};

const AllNotes: React.FC<AllNotesProps> = ({ notes }) => {
  if (!notes || notes.length === 0) {
    return (
        <View style={styles.emptyContainer}>
            <ThemedText>No notes yet. Create one!</ThemedText>
        </View>
    )
  }

  const renderItem = ({ item }: { item: Note }) => (
    <Link href={`/note/${item.id}`} style={styles.noteItem}>
      <View style={styles.noteContent}>
        <View style={styles.noteHead}>
          <PageIconFilledDark />
          <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
        </View>
        <View style={styles.noteTail}>
          <EllipsisIcon />
          <PlusSmall/>
        </View>
      </View>
    </Link>
  );

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.subtitle}>Particular</ThemedText>
      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false} // The parent ScrollView will handle scrolling
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
    fontWeight: 500,
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
    paddingHorizontal: 0,
    paddingVertical: 10 
  },
  noteContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    width: '100%',
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
  }
});

export default AllNotes;
