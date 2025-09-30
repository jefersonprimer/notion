import React, { forwardRef, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useAuth } from '@/context/AuthProvider';
import { useTheme } from '@react-navigation/native';
import { SavedAccount } from '@/types/user';
import { Feather } from '@expo/vector-icons';

interface AccountSwitcherModalProps {
  onClose: () => void;
}

const AccountListItem = ({ item, onSwitch, onRemove }: { item: SavedAccount, onSwitch: () => void, onRemove: () => void }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={onSwitch} style={[styles.itemContainer, { borderBottomColor: colors.border }]}>
      <View style={[styles.avatar, { backgroundColor: colors.border }]} />
      <View style={styles.accountInfo}>
        <Text style={[styles.email, { color: colors.text }]}>{item.email}</Text>
        {item.displayName && <Text style={[styles.displayName, { color: colors.text, opacity: 0.65 }]}>{item.displayName}</Text>}
      </View>
      <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
        <Feather name="trash-2" size={20} color={colors.notification} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export const AccountSwitcherModal = forwardRef<BottomSheet, AccountSwitcherModalProps>(({ onClose }, ref) => {
  const { savedAccounts, switchAccount, removeAccount, signOut } = useAuth();
  const { colors } = useTheme();
  const snapPoints = useMemo(() => ['30%', '60%'], []);

  const handleSwitch = async (accountId: string) => {
    try {
      await switchAccount(accountId);
      onClose();
    } catch (error) {
      console.error("Failed to switch account", error);
    }
  };

  const handleAddNew = () => {
    onClose();
    signOut();
  };

  const handleLogout = () => {
    onClose();
    signOut();
  };

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backgroundStyle={{ backgroundColor: colors.card }}
      handleIndicatorStyle={{ backgroundColor: colors.border }}
    >
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: colors.text }]}>Contas</Text>
        
        <BottomSheetFlatList
          data={savedAccounts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AccountListItem 
              item={item} 
              onSwitch={() => handleSwitch(item.id)} 
              onRemove={() => removeAccount(item.id)}
            />
          )}
          contentContainerStyle={styles.listContentContainer}
        />

        <TouchableOpacity style={[styles.actionButton, { borderColor: colors.border }]} onPress={handleAddNew}>
          <Text style={[styles.actionButtonText, { color: colors.primary }]}>Adicionar uma conta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, { borderColor: colors.border, marginTop: 0 }]} onPress={handleLogout}>
          <Text style={[styles.actionButtonText, { color: colors.notification }]}>Fazer logout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={onClose}>
          <Text style={[styles.footerButtonText, { color: colors.text, opacity: 0.65 }]}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  accountInfo: {
    flex: 1,
  },
  email: {
    fontSize: 16,
    fontWeight: '500',
  },
  displayName: {
    fontSize: 14,
  },
  removeButton: {
    padding: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  footerButton: {
    padding: 15,
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 16,
  },
});
