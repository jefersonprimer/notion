import { Link } from 'expo-router';
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { PageIconFilledDark } from './ui/PageIconFilledDark';
import { Note } from '../types/note';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/context/AuthProvider'; // Import useAuth

type RecentNotesProps = {
  notes: Note[];
};

function formatUpdatedAt(updatedAt: string) {
    const now = new Date();
    const updated = new Date(updatedAt);
    const diffInMs = now.getTime() - updated.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays < 1) {
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        if (diffInHours < 1) {
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
            return `${diffInMinutes}m atrás`;
        }
        return `${diffInHours}h atrás`;
    }

    return `${diffInDays}d atrás`;
}

const RecentNotes: React.FC<RecentNotesProps> = ({ notes }) => {
  const iconColor = useThemeColor({}, 'icon');
  const { session } = useAuth(); // Get session from AuthProvider

  if (!notes || notes.length === 0) {
    return null;
  }

  const getAvatarInitial = () => {
    if (session?.user?.email) {
      return session.user.email.charAt(0).toUpperCase();
    }
    return '?'; // Fallback if no email is found
  };

  const renderItem = ({ item }: { item: Note }) => (
    <Link href={`/note/${item.id}`} style={styles.card}>
      <View style={styles.cardBackground}>
        <View style={styles.topHalf} />
        <View style={styles.bottomHalf} />
      </View>
      <View style={styles.contentContainer}>
        <View>
          <PageIconFilledDark color={iconColor} />
          <ThemedText style={styles.title} numberOfLines={2}>
            {item.title}
          </ThemedText>
        </View>
      </View>
    </Link>
  );

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">Retornar</ThemedText>
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
  listContent: {
    paddingVertical: 12,
    gap: 16,
  },
  card: {
    width: 130,
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4c4c4c',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topHalf: {
    height: '50%',
    backgroundColor: '#2a2a2a',
  },
  bottomHalf: {
    height: '50%',
    backgroundColor: '#1f1f1f',

  },
  contentContainer: {
    flex: 1,
    padding: 12,
    paddingTop: 50,
    justifyContent: 'space-between',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4a4a4a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#aaa',
  },
});

export default RecentNotes;
