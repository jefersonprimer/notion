import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Text, Alert } from 'react-native';
import { ThemedText } from './themed-text';
import { Note } from '../types/note';
import { PageFilledDarkIcon } from './ui/PageFilledDarkIcon';
import { EllipsisIcon } from './ui/EllipsisIcon';
import { Link, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { StarIcon } from './ui/StarIcon';
import { StarSlashIcon } from './ui/StarSlashIcon';
import { TrashIcon } from './ui/TrashIcon';
import api from '@/lib/axios';

type ChildNoteCardProps = {
  item: Note;
};

const ChildNoteCard: React.FC<ChildNoteCardProps> = ({ item }) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(item.is_favorite);

  const handleToggleFavorite = async () => {
    try {
      const newIsFavorite = !isFavorite;
      setIsFavorite(newIsFavorite);
      await api.patch(`/notes/${item.id}/favorite`, { isFavorite: newIsFavorite });
    } catch (err) {
      console.error('Failed to toggle favorite', err);
      setIsFavorite(!isFavorite);
      Alert.alert('Error', 'Failed to update favorite status.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Mover para a Lixeira',
      'Tem certeza que quer mover esta nota para a lixeira?',
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => setModalVisible(false) },
        {
          text: 'Mover',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/notes/${item.id}`);
              Alert.alert('Sucesso', 'Nota movida para a lixeira.');
              setModalVisible(false);
              router.back();
            } catch (err: any) {
              Alert.alert('Erro', err.response?.data?.message || 'Não foi possível mover a nota.');
            }
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    noteItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      gap: 10,
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
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: Colors[colorScheme ?? 'light'].background,
      padding: 20,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    modalButton: {
      padding: 15,
      alignItems: 'flex-start',
    },
    modalButtonText: {
      fontSize: 18,
    },
  });

  return (
    <>
      <View style={styles.noteItem}>
        <Link href={`/note/${item.id}`} style={styles.noteHead}>
          <View style={styles.noteHeadContent}>
            <PageFilledDarkIcon />
            <ThemedText type="defaultSemiBold" style={{ textDecorationLine: 'underline' }}>
              {item.title}
            </ThemedText>
          </View>
        </Link>
        <View style={styles.noteTail}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <EllipsisIcon />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPressOut={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalButton} onPress={handleToggleFavorite}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {isFavorite ? <StarSlashIcon color={Colors[colorScheme ?? 'light'].text} /> : <StarIcon color={Colors[colorScheme ?? 'light'].text} />}
                <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>
                  {isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleDelete}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TrashIcon color={Colors[colorScheme ?? 'light'].text} />
                <Text style={[styles.modalButtonText, { color: Colors[colorScheme ?? 'light'].text, marginLeft: 10 }]}>Mover para Lixeira</Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default ChildNoteCard;
