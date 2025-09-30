import { Link } from 'expo-router';
import React from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, Pressable } from 'react-native';
import { ThemedText } from './themed-text';
import { PageIconFilledDark } from './ui/PageIconFilledDark';
import { Note } from '../types/note';
import { useThemeColor } from '@/hooks/use-theme-color';

type RecentNotesProps = {
  notes: Note[];
};

const RecentNotes: React.FC<RecentNotesProps> = ({ notes }) => {
  const iconColor = useThemeColor({}, 'icon');

  if (!notes || notes.length === 0) {
    return null;
  }

const renderItem = ({ item }: { item: Note }) => (
  <Link href={`/note/${item.id}`} asChild>
    <Pressable style={styles.card}>
      <View style={styles.cardBackground}>
        <View style={styles.topHalf} />
        <View style={styles.bottomHalf} />
      </View>

      <View style={styles.contentContainer}>
        <PageIconFilledDark color={iconColor} />
        <ThemedText style={styles.title} numberOfLines={2}>
          {item.title}
        </ThemedText>
      </View>
    </Pressable>
  </Link>
);


  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.subtitle}>Retornar</ThemedText>
      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  subtitle: {
    color: '#838383',
    fontWeight: '500',
    fontSize: 14,
  },
  listContent: {
    paddingVertical: 12,
    gap: 16,
  },
  card: {
    width: 130,
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#393939',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  topHalf: {
    height: '50%',
    backgroundColor: '#333333',
  },
  bottomHalf: {
    height: '50%',
    backgroundColor: '#000000',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default RecentNotes;
