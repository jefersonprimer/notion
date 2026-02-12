'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { 
  File,
  FileText, 
  ChevronRight, 
  MoreHorizontal, 
  Plus, 
  Star,
  StarOff, 
  Trash2,
  Link as LinkIcon,
  Copy,
  CornerRightUp,
  SquarePen,
  ExternalLink,
  PanelRightOpen,
} from 'lucide-react';
import api from '@/lib/api';
import { Note } from '@/types/note';
import { createNoteSlug, formatRelativeDate } from '@/lib/utils';
import { useFavorite } from '@/context/FavoriteContext';
import { Session } from '@/context/AuthContext';
import Toast from './Toast';

interface SidebarItemProps {
  note: Note;
  depth?: number;
  session: Session | null;
  onAddChild: (parentId: string, e: React.MouseEvent) => void;
  onDelete: (noteId: string) => void;
  currentPathname: string | null;
}

export default function SidebarItem({
  note,
  depth = 0,
  session,
  onAddChild,
  onDelete,
  currentPathname
}: SidebarItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [children, setChildren] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const { favoriteNotes, toggleFavorite, removeNoteFromFavorites } = useFavorite();
  const isFavorite = favoriteNotes.some(n => n.id === note.id);

  const noteHref = `/${createNoteSlug(note.title || "Sem título", note.id)}`;
  const isActive = currentPathname === noteHref;

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isOpen && !hasLoaded) {
      if (!session) return;
      setIsLoading(true);
      try {
        const response = await api.get(`/notes/${note.id}/children`, {
          headers: { Authorization: `Bearer ${session.accessToken}` }
        });
        setChildren(response.data);
        setHasLoaded(true);
      } catch (error) {
        console.error('Error fetching children:', error);
      } finally {
        setIsLoading(false);
      }
    }
    setIsOpen(!isOpen);
  };

  const handleAddChildLocal = (e: React.MouseEvent) => {
    onAddChild(note.id, e);
    if (!isOpen) setIsOpen(true);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(note);
    setShowOptions(false);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}${noteHref}`;
    navigator.clipboard.writeText(url);
    setShowOptions(false);
    setShowToast(true);
  };

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.post(`/notes/${note.id}/duplicate`, {}, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      window.location.reload();
    } catch (error) {
      console.error('Error duplicating note:', error);
      alert('Erro ao duplicar nota');
    }
    setShowOptions(false);
  };

  const handleDeleteAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await api.delete(`/notes/${note.id}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      removeNoteFromFavorites(note.id);
      onDelete(note.id);
      setShowOptions(false);
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Erro ao excluir nota');
    }
  };

  const handleDeleteChild = (childId: string) => {
    setChildren(prev => prev.filter(c => c.id !== childId));
  };

  return (
    <div className="flex flex-col relative">
      <Link
        href={noteHref}
        className={`group flex items-center gap-2 px-2 py-1.5 rounded transition-colors relative text-base font-medium ${isActive ? 'bg-[#2f2f2f] text-white' : 'hover:bg-[#ffffff0e] text-[#9b9b9b] hover:text-white'}`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {/* Icon & Toggle */}
        <div
          role="button"
          onClick={handleToggle}
          className="relative flex items-center justify-center w-6 h-6 shrink-0 z-10 cursor-pointer rounded hover:bg-[#3f3f3f]"
        >
          {note.title && note.description ? (
            <FileText size={20} className="transition-opacity duration-200 group-hover:opacity-0" />
          ) : (
            <File size={20} className="transition-opacity duration-200 group-hover:opacity-0" />
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <ChevronRight
              size={16}
              className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
            />
          </div>
        </div>

        {/* Title */}
        <span className="truncate text-base flex-1 pr-14">{note.title || "Sem título"}</span>

        {/* Hover Actions */}
        <div className="hidden group-hover:flex items-center absolute right-2 gap-1">
          <button
            className="p-1 hover:bg-[#3f3f3f] rounded text-[#ada9a3] hover:text-white relative"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowOptions(!showOptions);
            }}
          >
            <MoreHorizontal size={16} />
          </button>
          <button
            className="p-1 hover:bg-[#3f3f3f] rounded text-[#ada9a3] hover:text-white"
            onClick={handleAddChildLocal}
          >
            <Plus size={16} />
          </button>
        </div>
      </Link>

{showOptions && typeof document !== 'undefined' && createPortal(
  <div
    ref={menuRef}
    className="fixed z-[9999] w-70 bg-[#2b2b2b] border border-[#3a3a3a] rounded-xl shadow-2xl py-2 text-sm text-[#cfcfcf]"
    style={{
      bottom: '20px',
      left: '200px',
    }}
  >
    {/* Section Title */}
    <div className="px-3 pb-1 text-xs text-[#8f8f8f]">Página</div>

    {/* Adicionar/Remover dos favoritos */}
    <button 
      className="w-full flex items-center justify-between px-3 py-2 text-[#f0efed] hover:text-white hover:bg-[#ffffff0e] transition-colors"
      onClick={handleToggleFavorite}
    >
      <div className="flex items-center gap-2 ">
        {
        isFavorite ?  
        <StarOff 
          size={20} 
        /> :
        <Star
          size={20}
        />
      }
       
        <span className="text-base">{isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}</span>
      </div>
    </button>

    {/* Copiar link */}
    <button 
      className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#3a3a3a] transition-colors"
      onClick={handleCopyLink}
    >
      <div className="flex items-center gap-2 text-[#f0efed] hover:text-white">
        <LinkIcon size={20}/>
        <span className="text-base">Copiar link</span>
      </div>
    </button>

    {/* Duplicar */}
    <button 
      className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#3a3a3a] transition-colors"
      onClick={handleDuplicate}
    >
      <div className="flex items-center gap-2 text-[#f0efed] hover:text-white">
        <Copy size={20}/>
        <span className="text-base">Duplicar</span>
      </div>
      <span className="text-xs text-[#8a8a8a]">Ctrl+D</span>
    </button>

    {/* Renomear */}
    <button className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#3a3a3a] transition-colors">
      <div className="flex items-center gap-2 text-[#f0efed] hover:text-white">
        <SquarePen size={20} />
        <span className="text-base">Renomear</span>
      </div>
      <span className="text-xs text-[#8a8a8a]">Ctrl+R</span>
    </button>

    {/* Mover para */}
    <button className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#3a3a3a] transition-colors">
      <div className="flex items-center gap-2 hover:text-[#f0efed] hover:text-white">
        <CornerRightUp size={20}/>
        <span className="text-base">Mover para</span>
      </div>
      <span className="text-xs text-[#8a8a8a]">Ctrl+P</span>
    </button>

    {/* Divider */}
    <div className="my-2 border-t border-[#3a3a3a]" />

    {/* Mover para lixeira */}
    <button 
      className="w-full flex items-center justify-between px-3 py-2 text-[#f0efed] hover:text-red-400 hover:bg-[#3a3a3a] transition-colors"
      onClick={handleDeleteAction}
    >
      <div className="flex items-center gap-2">
        <Trash2 size={20} />
        <span className="text-base">Mover para a lixeira</span>
      </div>
    </button>

    {/* Transformar em wiki */}
    <button className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#3a3a3a] transition-colors">
      <div className="flex items-center gap-2 text-[#f0efed] hover:text-white">
        <FileText size={20} />
        <span className="text-base">Transformar em wiki</span>
      </div>
    </button>

    {/* Abrir em nova guia */}
    <button className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#3a3a3a] transition-colors">
      <div className="flex items-center gap-2 text-[#f0efed] hover:text-white">
        <ExternalLink size={20}/>
        <span className="text-base">Abrir em nova guia</span>
      </div>
      <span className="text-xs text-[#8a8a8a]">Ctrl+↵</span>
    </button>

    {/* Abrir no modo lado a lado */}
    <button className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#3a3a3a] transition-colors">
      <div className="flex items-center gap-2 text-[#f0efed] hover:text-white">
        <PanelRightOpen size={20} />
        <span className="text-base flex-1 truncate max-w-40">Abrir no modo lado a lado</span>
      </div>
      <span className="text-xs text-[#8a8a8a]">Alt+Click</span>
    </button>

    {/* Footer */}
    <div className="mt-2 pt-2 border-t border-[#3a3a3a] px-3 text-xs text-[#7a7a7a]">
      Última edição por {session?.user?.displayName || 'Usuário'} <br />
      {formatRelativeDate(new Date(note.updated_at))}
    </div>
  </div>,
  document.body
)}

      {/* Children */}
      {isOpen && (
        <div>
          {isLoading && (
            <div className="pl-4 py-1 text-xs text-[#555]" style={{ paddingLeft: `${(depth + 1) * 12 + 8}px` }}>
              Carregando...
            </div>
          )}
          {!isLoading && children.length === 0 && hasLoaded && (
            <div className="py-1 text-base text-[#555]" style={{ paddingLeft: `${(depth + 1) * 12 + 24}px` }}>
              Não contém páginas
            </div>
          )}
          {children.map(child => (
            <SidebarItem
              key={child.id}
              note={child}
              depth={depth + 1}
              session={session}
              onAddChild={onAddChild}
              onDelete={handleDeleteChild}
              currentPathname={currentPathname}
            />
          ))}
        </div>
      )}
      {showToast && (
        <Toast 
          message="Link copiado para o clipboard" 
          onClose={() => setShowToast(false)} 
        />
      )}
    </div>
  );
}
