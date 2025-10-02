import React, { useRef } from 'react';
import { Tabs } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import HomeHeader from '@/components/HomeHeader';
import { AccountSwitcherModal } from '@/components/auth/AccountSwitcherModal';

import { HomeIcon } from '@/components/ui/HomeIcon';
import { SearchIcon } from '@/components/ui/SearchIcon';
import { InboxIcon } from '@/components/ui/InboxIcon';
import { CreateNoteIcon } from '@/components/ui/CreateNoteIcon';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleOpenSheet = () => bottomSheetRef.current?.expand();
  const handleCloseSheet = () => bottomSheetRef.current?.close();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarShowLabel: false,
            header: () => <HomeHeader onOpenAccountSwitcher={handleOpenSheet} />,
            tabBarIcon: ({ color }) => (
              <HomeIcon color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Busca',
            tabBarShowLabel: false,
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <SearchIcon color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: 'Caixa de entrada',
            tabBarShowLabel: false,
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <InboxIcon color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: 'Criar Nota',
            tabBarShowLabel: false,
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <CreateNoteIcon color={color} />
            ),
          }}
        />
      </Tabs>
      <AccountSwitcherModal ref={bottomSheetRef} onClose={handleCloseSheet} />
    </GestureHandlerRootView>
  );
}