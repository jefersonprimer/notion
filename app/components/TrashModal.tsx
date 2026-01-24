'use client'
import React, { useEffect, useState } from 'react';
import { Trash2, RotateCcw, X, FileText } from 'lucide-react';
import api from '@/lib/api';
import { Note } from '@/types/note';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function TrashModal({ open, onClose }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchDeletedNotes();
    }
  }, [open]);

  // Handle escape key
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const fetchDeletedNotes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/notes/trash');
      setNotes(response.data);
    } catch (error) {
      console.error('Failed to fetch deleted notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      // PATCH to /notes/trash/[id] handles restore
      await api.patch(`/notes/trash/${id}`);
      setNotes(prev => prev.filter(n => n.id !== id));
      // Optionally trigger a global refresh of notes if needed, 
      // but usually the sidebar handles its own state or refetches on navigation.
      // If the user is currently viewing the parent of the restored note, they might need a refresh.
      // For now, we just remove from trash list.
    } catch (error) {
      console.error('Failed to restore note:', error);
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (!confirm("Tem certeza? Essa ação não pode ser desfeita.")) return;
    try {
      await api.delete(`/notes/trash/${id}`);
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to permanently delete note:', error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div 
        className="absolute inset-0 pointer-events-auto" 
        onClick={onClose}
      />
      
      {/* 300px by 300px modal positioned at bottom-12 and slightly overlapping sidebar */}
      <div className="absolute bottom-2 left-[220px] pointer-events-auto w-[414px] h-[327px] bg-[#252525] border border-[#3f3f3f] rounded-lg shadow-2xl flex flex-col overflow-hidden text-[#9b9b9b]">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#3f3f3f] bg-[#2f2f2f] text-white shrink-0">
          <span className="text-sm font-medium flex items-center gap-2">
            <Trash2 size={16} />
            Lixeira
          </span>
          <button 
            onClick={onClose}
            className="text-[#9b9b9b] hover:text-white p-1 rounded hover:bg-[#3f3f3f] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading ? (
            <div className="flex items-center justify-center h-full text-xs">Carregando...</div>
          ) : notes.length === 0 ? (
            <div className="flex items-center justify-center h-full text-xs text-center px-4">
              A lixeira está vazia.
            </div>
          ) : (
            notes.map(note => (
              <div 
                key={note.id} 
                className="group flex items-center justify-between p-2 rounded hover:bg-[#2f2f2f] transition-colors"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText size={14} className="shrink-0" />
                  <span className="text-sm truncate text-white">{note.title || "Sem título"}</span>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleRestore(note.id)}
                    className="p-1 hover:bg-[#3f3f3f] rounded text-[#9b9b9b] hover:text-white"
                    title="Restaurar"
                  >
                    <RotateCcw size={14} />
                  </button>
                  <button 
                    onClick={() => handlePermanentDelete(note.id)}
                    className="p-1 hover:bg-[#3f3f3f] rounded text-[#ff5f5f] hover:text-[#ff8f8f]"
                    title="Excluir permanentemente"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
