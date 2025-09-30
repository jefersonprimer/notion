import { Link } from 'expo-router';
import React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';
import { Note } from '../types/note';
import { PageIconFilledDark } from './ui/PageIconFilledDark';
import { EllipsisIcon } from './ui/EllipsisIcon';
import { PlusSmall } from './ui/PlusSmall';
import { Ionicons } from '@expo/vector-icons';
import api from '@/lib/axios';


type AllFavoritesNotesProps = {
  notes: Note[];
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
};

const AllFavoritesNotes: React.FC<AllFavoritesNotesProps> = ({ notes, onToggleFavorite }) => {
  if (!notes || notes.length === 0) {
    return null;
  }

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    onToggleFavorite(id, isFavorite);
    try {
      await api.patch(`/notes/${id}/favorite`, { isFavorite });
    } catch (err) {
      console.error('Failed to toggle favorite', err);
      // Revert the state if the API call fails
      onToggleFavorite(id, !isFavorite);
    }
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
        <EllipsisIcon />
        <PlusSmall/>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.subtitle}>Favorites</ThemedText>
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
  }
});

export default AllFavoritesNotes;
