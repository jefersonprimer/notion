import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import HomeHeader from '@/components/HomeHeader';

import { HomeIcon } from '@/components/ui/HomeIcon';
import { SearchIcon } from '@/components/ui/SearchIcon';
import { InboxIcon } from '@/components/ui/InboxIcon';
import { CreateNoteIcon } from '@/components/ui/CreateNoteIcon';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          header: () => <HomeHeader />,
          tabBarIcon: ({ color }) => (
            <HomeIcon color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Busca',
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
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <CreateNoteIcon color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
