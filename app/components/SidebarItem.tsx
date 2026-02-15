'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { Note } from '@/types/note';
import { createNoteSlug, formatRelativeDate } from '@/lib/utils';
import { useFavorite } from '@/context/FavoriteContext';
import { useNote } from '@/context/NoteContext';
import { Session } from '@/context/AuthContext';
import Toast from './Toast';

interface SidebarItemProps {
  note: Note;
  depth?: number;
  session: Session | null;
  onAddChild: (parentId: string, e: React.MouseEvent) => void;
  onDelete: (noteId: string) => void;
  currentPathname: string | null;
  isFloating?: boolean;
}

export function SidebarItemSkeleton({ depth = 0 }: { depth?: number }) {
  return (
    <div 
      className="flex items-center gap-2 px-2 py-1.5 animate-pulse"
      style={{ paddingLeft: `${depth * 12 + 8}px` }}
    >
      <div className="w-6 h-6 bg-[#2f2f2f] rounded shrink-0" />
      <div className="h-4 bg-[#2f2f2f] rounded w-full max-w-[140px]" />
    </div>
  );
}

export default function SidebarItem({
  note,
  depth = 0,
  session,
  onAddChild,
  onDelete,
  currentPathname,
  isFloating = false
}: SidebarItemProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [children, setChildren] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const { favoriteNotes, toggleFavorite, removeNoteFromFavorites } = useFavorite();
  const { updatedTitles, updatedHasContent } = useNote();
  const isFavorite = favoriteNotes.some(n => n.id === note.id);

  const displayTitle = (updatedTitles[note.id] !== undefined ? updatedTitles[note.id] : note.title) || "Nova página";
  const hasContent = updatedHasContent[note.id] !== undefined 
    ? updatedHasContent[note.id] 
    : (note.title && note.title !== 'Nova página' && note.title.trim() !== '' && note.description && note.description.trim() !== '');
  
  const noteHref = `/${createNoteSlug(displayTitle, note.id)}`;
  const isActive = currentPathname === noteHref;

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && !isMobile) {
        setShowOptions(false);
      }
    }
    if (showOptions && !isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, isMobile, showOptions]);

  const handleToggle = async (e: React.MouseEvent | React.TouchEvent) => {
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

  const handleToggleFavorite = (e: React.MouseEvent | React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(note);
    setShowOptions(false);
  };

  const handleCopyLink = (e: React.MouseEvent | React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}${noteHref}`;
    navigator.clipboard.writeText(url);
    setShowOptions(false);
    setShowToast(true);
  };

  const handleDuplicate = async (e: React.MouseEvent | React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) return;
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

  const handleDeleteAction = async (e: React.MouseEvent | React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) return;
    
    try {
      await api.delete(`/notes/${note.id}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      removeNoteFromFavorites(note.id);
      onDelete(note.id);
      setShowOptions(false);
      
      if (isActive) {
        router.push('/');
      }
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
        <div className="flex items-center shrink-0">
          {/* Mobile Chevron (Always visible on mobile or floating) */}
          <div
            role="button"
            onClick={handleToggle}
            className={`flex ${isFloating ? '' : 'md:hidden'} items-center justify-center w-5 h-6 cursor-pointer rounded hover:bg-[#3f3f3f]`}
          >
            <ChevronRight
              size={14}
              className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
            />
          </div>

          {/* Desktop Icon (Switches on hover) / Mobile Icon (Always visible) */}
          <div
            role="button"
            onClick={handleToggle}
            className="relative flex items-center justify-center w-6 h-6 shrink-0 z-10 cursor-pointer rounded hover:bg-[#3f3f3f]"
          >
            {hasContent ? (
              <FileText size={20} className={`transition-opacity duration-200 ${!isFloating ? 'md:group-hover:opacity-0' : ''}`} />
            ) : (
              <File size={20} className={`transition-opacity duration-200 ${!isFloating ? 'md:group-hover:opacity-0' : ''}`} />
            )}
            {!isFloating && (
              <div className="hidden md:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <ChevronRight
                  size={16}
                  className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <span className="truncate text-base flex-1 pr-14">{displayTitle}</span>

        {/* Actions (Always visible on mobile, hover on desktop) */}
        <div className="flex md:hidden md:group-hover:flex items-center absolute right-2 gap-1">
          <div className="relative">
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

            {typeof document !== 'undefined' && createPortal(
              <AnimatePresence>
                {showOptions && (
                  <>
                    {/* Mobile Overlay */}
                    {isMobile && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowOptions(false);
                        }}
                        className="fixed inset-0 bg-black/60 z-[9998] backdrop-blur-[2px]"
                      />
                    )}
                    
                    <motion.div
                      ref={menuRef}
                      initial={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.95 }}
                      animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1 }}
                      exit={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.95 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      drag={isMobile ? "y" : false}
                      dragConstraints={{ top: 0, bottom: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(_, info) => {
                        if (info.offset.y > 100 || info.velocity.y > 500) {
                          setShowOptions(false);
                        }
                      }}
                      className={`fixed z-[9999] bg-[#2b2b2b] border-[#3a3a3a] shadow-2xl text-sm text-[#cfcfcf] ${
                        isMobile 
                          ? 'inset-x-0 bottom-0 rounded-t-2xl border-t pb-8' 
                          : 'w-70 border rounded-xl py-2'
                      }`}
                      style={!isMobile ? {
                        bottom: '20px',
                        left: '200px',
                      } : {}}
                    >
                      {/* Mobile Handle */}
                      {isMobile && (
                        <div className="flex justify-center pt-3 pb-1">
                          <div className="w-10 h-1 rounded-full bg-[#3f3f3f]" />
                        </div>
                      )}

                      {/* Section Title */}
                      <div className="px-3 pb-1 text-xs text-[#8f8f8f] pt-1">Página</div>

                      {/* Adicionar/Remover dos favoritos */}
                      <button 
                        className="w-full flex items-center justify-between px-3 py-2 text-[#f0efed] hover:text-white hover:bg-[#ffffff0e] transition-colors"
                        onPointerUp={handleToggleFavorite}
                      >
                        <div className="flex items-center gap-2 ">
                          {isFavorite ? <StarOff size={20} /> : <Star size={20} />}
                          <span className="text-base">{isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}</span>
                        </div>
                      </button>

                      {/* Copiar link */}
                      <button 
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#3a3a3a] transition-colors"
                        onPointerUp={handleCopyLink}
                      >
                        <div className="flex items-center gap-2 text-[#f0efed] hover:text-white">
                          <LinkIcon size={20}/>
                          <span className="text-base">Copiar link</span>
                        </div>
                      </button>

                      {/* Duplicar */}
                      <button 
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#3a3a3a] transition-colors"
                        onPointerUp={handleDuplicate}
                      >
                        <div className="flex items-center gap-2 text-[#f0efed] hover:text-white">
                          <Copy size={20}/>
                          <span className="text-base">Duplicar</span>
                        </div>
                        {!isMobile && <span className="text-xs text-[#8a8a8a]">Ctrl+D</span>}
                      </button>

                      {/* Renomear */}
                      <button className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#3a3a3a] transition-colors">
                        <div className="flex items-center gap-2 text-[#f0efed] hover:text-white">
                          <SquarePen size={20} />
                          <span className="text-base">Renomear</span>
                        </div>
                        {!isMobile && <span className="text-xs text-[#8a8a8a]">Ctrl+R</span>}
                      </button>

                      {/* Mover para */}
                      <button className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#3a3a3a] transition-colors">
                        <div className="flex items-center gap-2 hover:text-[#f0efed] hover:text-white">
                          <CornerRightUp size={20}/>
                          <span className="text-base">Mover para</span>
                        </div>
                        {!isMobile && <span className="text-xs text-[#8a8a8a]">Ctrl+P</span>}
                      </button>

                      {/* Divider */}
                      <div className="my-2 border-t border-[#3a3a3a]" />

                      {/* Mover para lixeira */}
                      <button 
                        className="w-full flex items-center justify-between px-3 py-2 text-[#f0efed] hover:text-red-400 hover:bg-[#3a3a3a] transition-colors"
                        onPointerUp={handleDeleteAction}
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
                        {!isMobile && <span className="text-xs text-[#8a8a8a]">Ctrl+↵</span>}
                      </button>

                      {/* Abrir no modo lado a lado */}
                      {!isMobile && (
                        <button className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#3a3a3a] transition-colors">
                          <div className="flex items-center gap-2 text-[#f0efed] hover:text-white">
                            <PanelRightOpen size={20} />
                            <span className="text-base flex-1 truncate max-w-40">Abrir no modo lado a lado</span>
                          </div>
                          <span className="text-xs text-[#8a8a8a]">Alt+Click</span>
                        </button>
                      )}

                      {/* Footer */}
                      <div className="mt-2 pt-2 border-t border-[#3a3a3a] px-3 text-xs text-[#7a7a7a]">
                        Última edição por {session?.user?.displayName || 'Usuário'} <br />
                        {formatRelativeDate(new Date(note.updated_at))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>,
              document.body
            )}
          </div>
          
          <button
            className="p-1 hover:bg-[#3f3f3f] rounded text-[#ada9a3] hover:text-white"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddChildLocal(e);
            }}
          >
            <Plus size={16} />
          </button>
        </div>
      </Link>

      {showToast && (
        <Toast 
          message="Link copiado para o clipboard" 
          onClose={() => setShowToast(false)} 
        />
      )}

      {/* Children */}
      {isOpen && (
        <div>
          {isLoading && (
            <div className="flex flex-col gap-0.5">
              {[...Array(3)].map((_, i) => (
                <SidebarItemSkeleton key={i} depth={depth + 1} />
              ))}
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
              isFloating={isFloating}
            />
          ))}
        </div>
      )}
    </div>
  );
}

