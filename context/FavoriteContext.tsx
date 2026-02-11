'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Note } from '@/types/note';

interface FavoriteContextType {
  favoriteNotes: Note[];
  isLoading: boolean;
  toggleFavorite: (note: Note) => Promise<void>;
  refreshFavorites: () => Promise<void>;
  removeNoteFromFavorites: (noteId: string) => void;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export function FavoriteProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [favoriteNotes, setFavoriteNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!session) {
      setFavoriteNotes([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.get('/notes?favorites=true');
      setFavoriteNotes(response.data);
    } catch (error) {
      console.error('Error fetching favorite notes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const removeNoteFromFavorites = useCallback((noteId: string) => {
    setFavoriteNotes(prev => prev.filter(n => n.id !== noteId));
  }, []);

  const toggleFavorite = async (note: Note) => {
    if (!session) return;

    // Optimistic update
    const isCurrentlyFavorite = favoriteNotes.some(n => n.id === note.id);
    const newStatus = !isCurrentlyFavorite;

    // Update local list optimistically
    if (newStatus) {
        setFavoriteNotes(prev => [...prev, { ...note, is_favorite: true }]);
    } else {
        setFavoriteNotes(prev => prev.filter(n => n.id !== note.id));
    }

    try {
      await api.patch(`/notes/${note.id}`, { is_favorite: newStatus });
      // Optionally refresh to ensure consistency, or trust the optimistic update
      // fetchFavorites(); 
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert on error
      fetchFavorites();
    }
  };

  return (
    <FavoriteContext.Provider value={{ favoriteNotes, isLoading, toggleFavorite, refreshFavorites: fetchFavorites, removeNoteFromFavorites }}>
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorite() {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorite must be used within a FavoriteProvider');
  }
  return context;
}
