import { useState, useRef } from 'react';
import { View, TouchableOpacity, Modal, Button, StyleSheet, Image, SafeAreaView, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

import { ArrowChevronSingleDownIcon } from '@/components/ui/ArrowChevronSingleDownIcon';
import { EllipsisIcon } from '@/components/ui/EllipsisIcon';
import { TrashIcon } from '@/components/ui/TrashIcon';
import { SettingsIcon } from '@/components/ui/SettingsIcon';
import { PeopleIcon } from '@/components/ui/PeopleIcon';
import { SacIcon } from '@/components/ui/SacIcon';
import { ArrowInCircleUpFillIcon } from '@/components/ui/ArrowInCircleUpFillIcon'

export default function HomeHeader() {
  const { session, setSession } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const [userModalVisible, setUserModalVisible] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [menuModalPosition, setMenuModalPosition] = useState({ top: 0, right: 0 });
  const ellipsisIconRef = useRef<TouchableOpacity>(null);

  const handleLogout = () => {
    setSession(null);
    setUserModalVisible(false);
    // The AuthProvider will handle the redirect to the login screen
  };

  const handleNavigate = (path: string) => {
    setMenuModalVisible(false);
    router.push(path as any);
  };

  const openMenuModal = () => {
    ellipsisIconRef.current?.measure((fx, fy, width, height, px, py) => {
      setMenuModalPosition({ top: py + height, right: 20 });
      setMenuModalVisible(true);
    });
  };

  const styles = StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: Colors[colorScheme ?? 'light'].background,
    },
    headerUserMenu: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 0,
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
    },
    menuModalOverlay: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    menuModalContent: {
      position: 'absolute',
      alignItems: 'flex-start',
      backgroundColor: '#252525',
      padding: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      gap: 15,
    }  });

  return (
    <SafeAreaView style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <View style={styles.headerContainer}>
        <View style={styles.headerUserMenu}>
          <Pressable style={styles.logo}>
            <Text style={styles.logoText}>n</Text>
          </Pressable>

          <TouchableOpacity onPress={() => setUserModalVisible(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <ThemedText style={styles.emailText}>Notion de {session?.user?.displayName || session?.user?.email}</ThemedText>
            <ArrowChevronSingleDownIcon color={Colors[colorScheme ?? 'light'].text}/>
          </TouchableOpacity>
        </View>
        
        <View>
          <TouchableOpacity ref={ellipsisIconRef} onPress={openMenuModal}>
            <EllipsisIcon color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
          
          <Modal
            animationType="fade"
            transparent={true}
            visible={menuModalVisible}
            onRequestClose={() => setMenuModalVisible(false)}
          >
            <TouchableOpacity style={styles.menuModalOverlay} activeOpacity={1} onPressOut={() => setMenuModalVisible(false)}>
              <View style={[styles.menuModalContent, { top: menuModalPosition.top, right: menuModalPosition.right }]}>
                <TouchableOpacity onPress={() => handleNavigate('#')}>
                  <ThemedText><ArrowInCircleUpFillIcon/>Fazer upgrade do plano</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigate('#')}>
                  <ThemedText><PeopleIcon/>Membros</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigate('/settings')}>
                  <ThemedText><SettingsIcon/>Configurações</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigate('/trash')}>
                  <ThemedText><TrashIcon/>Lixeira</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigate('#')}>
                  <ThemedText><SacIcon />Ajuda e suporte</ThemedText>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>

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
      </View>
    </SafeAreaView>
  );
}
