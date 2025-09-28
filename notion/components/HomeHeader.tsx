import { useState } from 'react';
import { View, TouchableOpacity, Modal, Button, StyleSheet, Image, SafeAreaView, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

import { ArrowChevronSingleDownIcon } from '@/components/ui/ArrowChevronSingleDownIcon';
import { EllipsisIcon } from '@/components/ui/EllipsisIcon';

export default function HomeHeader() {
  const { session, setSession } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const [userModalVisible, setUserModalVisible] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false);

  const handleLogout = () => {
    setSession(null);
    setUserModalVisible(false);
    // The AuthProvider will handle the redirect to the login screen
  };

  const handleNavigate = (path: string) => {
    setMenuModalVisible(false);
    router.push(path as any);
  };

  const styles = StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: Colors[colorScheme ?? 'light'].background,
    },
    headerUserMenu: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 10,
      gap: '15px'
    }
    ,
    logo: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 30,
      height: 30,
      backgroundColor: '#404040',
      borderRadius: '0.25rem'
    },
    logoText: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textTransform: 'uppercase',
      fontWeight: 500,
      width: 30,
      height: 30,
      color: 'rgb(168, 164, 156)',

    },
    emailText: {
      fontWeight: 'bold',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: Colors[colorScheme ?? 'light'].backgroundOffset,
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 40, // For home indicator
    },
    modalButtonSpacer: {
        marginVertical: 8,
    }
  });

  return (
    <SafeAreaView style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <View style={styles.headerContainer}>
        <View style={styles.headerUserMenu}>
          <Pressable style={styles.logo}>
            <Text style={styles.logoText}>n</Text>
          </Pressable>

          <TouchableOpacity onPress={() => setUserModalVisible(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <ThemedText style={styles.emailText}>Notion de {session?.user?.email}</ThemedText>
            <ArrowChevronSingleDownIcon color={Colors[colorScheme ?? 'light'].text}/>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={() => setMenuModalVisible(true)}>
          <EllipsisIcon color={Colors[colorScheme ?? 'light'].text} />
        </TouchableOpacity>

        {/* User Account Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={userModalVisible}
          onRequestClose={() => setUserModalVisible(false)}
        >
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setUserModalVisible(false)}>
            <View style={styles.modalContent}>
              <Button title="Adicionar nova conta" onPress={handleLogout} />
              <View style={styles.modalButtonSpacer} />
              <Button title="Sair" color="red" onPress={handleLogout} />
              <View style={styles.modalButtonSpacer} />
              <Button title="Cancelar" onPress={() => setUserModalVisible(false)} />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Main Menu Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={menuModalVisible}
          onRequestClose={() => setMenuModalVisible(false)}
        >
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setMenuModalVisible(false)}>
            <View style={styles.modalContent}>
              <Button title="Lixeira" onPress={() => handleNavigate('/trash')} />
              <View style={styles.modalButtonSpacer} />
              <Button title="Configurações" onPress={() => handleNavigate('/settings')} />
              <View style={styles.modalButtonSpacer} />
              <Button title="Cancelar" onPress={() => setMenuModalVisible(false)} />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
