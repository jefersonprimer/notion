import React from 'react';
import { View } from 'react-native';
import { Note } from '../types/note';
import NoteCard from './NoteCard';
import { ThemedText } from './themed-text';

type NoteTreeProps = {
  notes: Note[];
  onNoteUpdate: (notes: Note[]) => void;
  onToggleFavorite: (noteId: string, isFavorite: boolean) => void;
  onDelete: (noteId: string) => void;
  onToggleExpand: (noteId: string) => void;
  expandedNotes: Record<string, boolean>;
  childNodes: Record<string, Note[]>;
  indentationLevel?: number;
};

const NoteTree: React.FC<NoteTreeProps> = ({ 
  notes, 
  onNoteUpdate,
  onToggleFavorite,
  onDelete,
  onToggleExpand, 
  expandedNotes, 
  childNodes, 
  indentationLevel = 0 
}) => {
  return (
    <View>
      {notes.map(note => (
        <View key={note.id}>
          <NoteCard 
            item={note} 
            onNoteUpdate={onNoteUpdate}
            onToggleFavorite={onToggleFavorite}
            onDelete={onDelete}
            onToggleExpand={onToggleExpand}
            isExpanded={!!expandedNotes[note.id]}
            indentationLevel={indentationLevel}
            notes={notes}
          />
          {expandedNotes[note.id] && childNodes[note.id] && childNodes[note.id].length > 0 && (
            <NoteTree
              notes={childNodes[note.id]}
              onNoteUpdate={onNoteUpdate}
              onToggleFavorite={onToggleFavorite}
              onDelete={onDelete}
              onToggleExpand={onToggleExpand}
              expandedNotes={expandedNotes}
              childNodes={childNodes}
              indentationLevel={indentationLevel + 1}
            />
          )}
          {expandedNotes[note.id] && childNodes[note.id] && childNodes[note.id].length === 0 && (
            <View style={{ marginLeft: (indentationLevel + 1) * 20, paddingHorizontal: 14 }}>
              <ThemedText>Não contém páginas</ThemedText>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default NoteTree;
