'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface NoteContextType {
  updatedTitles: Record<string, string>;
  updatedHasContent: Record<string, boolean>;
  updateNoteTitle: (id: string, title: string) => void;
  updateNoteHasContent: (id: string, hasContent: boolean) => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export function NoteProvider({ children }: { children: ReactNode }) {
  const [updatedTitles, setUpdatedTitles] = useState<Record<string, string>>({});
  const [updatedHasContent, setUpdatedHasContent] = useState<Record<string, boolean>>({});

  const updateNoteTitle = useCallback((id: string, title: string) => {
    setUpdatedTitles(prev => {
      if (prev[id] === title) return prev;
      return { ...prev, [id]: title };
    });
  }, []);

  const updateNoteHasContent = useCallback((id: string, hasContent: boolean) => {
    setUpdatedHasContent(prev => {
      if (prev[id] === hasContent) return prev;
      return { ...prev, [id]: hasContent };
    });
  }, []);

  return (
    <NoteContext.Provider value={{ updatedTitles, updatedHasContent, updateNoteTitle, updateNoteHasContent }}>
      {children}
    </NoteContext.Provider>
  );
}

export function useNote() {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error('useNote must be used within a NoteProvider');
  }
  return context;
}
