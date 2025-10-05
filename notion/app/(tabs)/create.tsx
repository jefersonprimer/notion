import { useState, useEffect, useCallback } from 'react';
import { TextInput, Alert, ActivityIndicator, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import api from '@/lib/axios';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useDebounce } from '@/hooks/use-debouncer';

import { AngleLeftIcon } from '@/components/ui/AngleLeftIcon';
import { PadLockIcon } from '@/components/ui/PadLockIcon';
import { ChevronRightIcon } from '@/components/ui/ChevronRightIcon';
import { EllipsisIcon } from '@/components/ui/EllipsisIcon';

export default function CreateNoteScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [noteId, setNoteId] = useState<string | null>(null);
  const router = useRouter();
  const { parentId } = useLocalSearchParams<{ parentId?: string }>();
  const colorScheme = useColorScheme();

  const debouncedTitle = useDebounce(title, 500);
  const debouncedDescription = useDebounce(description, 500);

  useFocusEffect(
    useCallback(() => {
      // Reset state when the screen is focused
      setNoteId(null);
      setTitle('');
      setDescription('');
    }, [])
  );

  const styles = StyleSheet.create({
    input: {
      fontSize: 18,
      marginBottom: 16,
      padding: 12,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: Colors[colorScheme ?? 'light'].gray,
      color: Colors[colorScheme ?? 'light'].text,
      backgroundColor: Colors[colorScheme ?? 'light'].backgroundOffset,
    },
    descriptionInput: {
      minHeight: 150,
      textAlignVertical: 'top',
    },
  });

  useEffect(() => {
    const saveNote = async () => {
      if (noteId) {
        // Update existing note
        await api.put(`/notes/${noteId}`, { 
          title: debouncedTitle || 'sem titulo', 
          description: debouncedDescription 
        });
      } else {
        // Create new note
        try {
          const response = await api.post('/notes', { 
            title: debouncedTitle || 'sem titulo', 
            description: debouncedDescription, 
            parentId 
          });
          const newNoteId = response.data.id;
          setNoteId(newNoteId);
        } catch (error) {
          console.error('Failed to create note', error);
        }
      }
    };

    saveNote();
  }, [debouncedTitle, debouncedDescription, noteId, parentId, router]);

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
     
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 }}>
        <TouchableOpacity onPress={() => router.push('/(tabs)')}>
        <AngleLeftIcon color={Colors[colorScheme ?? 'light'].icon} size={24} />
      </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <PadLockIcon color={Colors[colorScheme ?? 'light'].icon} size={20} />
          <ThemedText type="title" style={{ fontSize: 14 }}>Particular</ThemedText>
          <ChevronRightIcon color={Colors[colorScheme ?? 'light'].icon} size={16} />
        </View>
        <EllipsisIcon color={Colors[colorScheme ?? 'light'].icon} size={24} />
      </View>
           
      <TextInput
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholderTextColor={Colors[colorScheme ?? 'light'].gray}
      />
      
      <TextInput
        placeholder="Descrição (opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        style={[styles.input, styles.descriptionInput]}
        placeholderTextColor={Colors[colorScheme ?? 'light'].gray}
      />


    </ThemedView>
  );
}
