import { useState } from 'react';
import { TextInput, Button, Alert, ActivityIndicator, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '@/lib/axios';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

import { AngleLeftIcon } from '@/components/ui/AngleLeftIcon';
import { PadLockIcon } from '@/components/ui/PadLockIcon';
import { ChevronRightIcon } from '@/components/ui/ChevronRightIcon';
import { EllipsisIcon } from '@/components/ui/EllipsisIcon';

export default function CreateNoteScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { parentId } = useLocalSearchParams<{ parentId?: string }>();
  const colorScheme = useColorScheme();

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

  async function handleSaveNote() {
    if (!title.trim()) {
      Alert.alert('Título Necessário', 'Por favor, dê um título para a sua nota.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/notes', { title, description, parentId });
      Alert.alert('Sucesso', 'Sua nota foi salva!');
      // Navigate to home screen after creation and reset fields
      setTitle('');
      setDescription('');
      router.push('/(tabs)'); 
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Não foi possível salvar a nota.';
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  }

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

      {loading ? (
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
      ) : (
        <Button title="Salvar Nota" onPress={handleSaveNote} />
      )}
    </ThemedView>
  );
}
