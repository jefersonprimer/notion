import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  Home,
  Users,
  Sparkles,
  Inbox,
  FileText,
  Plus,
  Mail,
  Calendar,
  Monitor,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  SquarePen,
  Layers,
  Trash2,
  MoreHorizontal,
  ChevronsLeft,
  Star
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLayout } from '@/context/LayoutContext';
import { useFavorite } from '@/context/FavoriteContext';
import api from '@/lib/api';
import { Note } from '@/types/note';
import { createNoteSlug } from '@/lib/utils';
import UserModal from './UserModal';
import SearchModal from './SearchModal';
import TrashModal from './TrashModal';
import SettingsModal from './SettingsModal';
import MoreOptionsModal from  './MoreOptionsModal';

export default function Sidebar({ isFloating = false }: { isFloating?: boolean }) {
  const { session } = useAuth();
  const { setIsSidebarOpen } = useLayout();
  const { favoriteNotes, toggleFavorite } = useFavorite();
  const router = useRouter();
  const pathname = usePathname();
  const [rootNotes, setRootNotes] = useState<Note[]>([]);
  const [expandedSections, setExpandedSections] = useState({
    favoritos: true,
    particular: true,
    compartilhado: true,
    aplicativos: true,
    configs: false
  });
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isMoreOptionsModalOpen, setIsMoreOptionsModalOpen] = useState(false);
  const [userModalPos, setUserModalPos] = useState({ top: 0, left: 0 });
  const [moreOptionsModalPos, setMoreOptionsModalPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    async function fetchRootNotes() {
      if (!session) return;
      try {
        const response = await api.get('/notes', {
          headers: {
            Authorization: `Bearer ${session.accessToken}`
          }
        });
        setRootNotes(response.data);
      } catch (error) {
        console.error('Error fetching root notes:', error);
      }
    }
    fetchRootNotes();
  }, [session]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCreateNote = async () => {
    if (!session) return;
    try {
      const response = await api.post('/notes', { title: "" }, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      });
      const newNote = response.data;
      const cleanId = newNote.id.replace(/-/g, '');
      const url = `/${cleanId}?showMoveTo=true&saveParent=true`;

      router.push(url);
      setRootNotes(prev => [newNote, ...prev]);
    } catch (error: any) {
      console.error('Error creating note:', error.response?.data || error.message);
    }
  };

  const handleAddChild = async (parentId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) return;
    try {
      const response = await api.post('/notes', { title: "", parentId }, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      const newNote = response.data;
      const cleanId = newNote.id.replace(/-/g, '');
      const url = `/${cleanId}?showMoveTo=true&saveParent=true`;
      router.push(url);
    } catch (error: any) {
      console.error('Error creating child note:', error);
    }
  };

  const handleDeleteRootNote = (noteId: string) => {
    setRootNotes(prev => prev.filter(n => n.id !== noteId));
  };

  return (
    <div className={`group/sidebar w-60 bg-[#202020] text-[#ada9a3] flex flex-col text-sm border-r border-[#2f2f2f] select-none ${isFloating ? 'h-full max-h-[70vh] overflow-y-auto' : 'h-screen'}`}>
      {/* Header */}
      <div
        className={`group relative flex items-center justify-between mt-2 mx-2 rounded-sm transition-colors cursor-pointer hover:bg-[#252525] ${isUserModalOpen ? 'bg-[#252525]' : ''}`}
      >
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setUserModalPos({ top: rect.bottom + 5, left: rect.left + 10 });
            setIsUserModalOpen(true);
          }}
          className="flex items-center p-2 gap-2 transition-all duration-200 group-hover:opacity-100 flex-1 min-w-0"
        >
          <div className="w-5.5 h-6 bg-[#2f2f2f] rounded flex items-center justify-center text-sm font-medium text-white shrink-0">
            <span className="leading-none select-none">P</span>
          </div>
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-white text-sm truncate font-medium leading-none">
              Notion de {session?.user.displayName || 'Usuário'}
            </span>
            <div className="hidden group-hover:flex items-center text-[#ada9a3] hover:text-white">
              <ChevronDown size={14} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center shrink-0 pr-2 gap-0.5">
          {/* Collapse Button (Shown on Hover) */}
          {!isFloating && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(false); }}
              className="hidden group-hover/sidebar:flex items-center justify-center w-7 h-7 hover:bg-[#3f3f3f] rounded text-[#ada9a3] hover:text-white"
              title="Fechar barra lateral"
            >
              <ChevronsLeft size={20} />
            </button>
          )}

          {/* Default Icons */}
          <button
            onClick={(e) => { e.stopPropagation(); handleCreateNote(); }}
            className="flex items-center justify-center w-7 h-7 text-white hover:bg-[#2f2f2f] rounded transition-colors"
            title="Crie uma nova página"
          >
            <SquarePen size={18} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation(); 
              const rect = e.currentTarget.getBoundingClientRect();
              setMoreOptionsModalPos({ top: rect.bottom + 5, left: rect.left - 40 }); 
              setIsMoreOptionsModalOpen(true); 
            }}
            className={`flex items-center justify-center w-5 h-7 hover:bg-[#3f3f3f] rounded hover:text-white ${isMoreOptionsModalOpen ? 'bg-[#3f3f3f] text-white' : 'text-[#ada9a3]'}`}
            title="Mais opções"
          >
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      <div className="px-2 py-1 text-base">
        <NavItem icon={<Search size={22} />} label="Buscar" onClick={() => setIsSearchModalOpen(true)} />
        <NavItem icon={<Home size={22} />} label="Página inicial" href="/" isActive={pathname === '/'} />
        <NavItem icon={<Users size={22} />} label="Reuniões" />
        <NavItem icon={<Sparkles size={22} />} label="IA do Notion" />
        <NavItem icon={<Inbox size={22} />} label="Caixa de entrada" />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Main Navigation */}

        {/* Favorites Section */}
        {favoriteNotes.length > 0 && (
          <div className="mt-4 px-2">
            <div className="px-2 py-1 text-xs font-medium text-[#9b9b9b]">
              Favoritos
            </div>
            {expandedSections.favoritos && (
              <div className="py-1">
                {favoriteNotes.map(note => (
                  <SidebarItem
                    key={`fav-${note.id}`}
                    note={note}
                    session={session}
                    onAddChild={handleAddChild}
                    onDelete={() => {}} // Placeholder, overridden by onRemove
                    onRemove={() => toggleFavorite(note)}
                    currentPathname={pathname}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Particular Section */}
        <div className="mt-4 px-2">
          <button
            onClick={() => toggleSection('particular')}
            className="w-full flex items-center justify-between px-2 py-1 text-xs font-medium text-[#9b9b9b] hover:bg-[#2f2f2f] hover:text-[#ada9a3] transition-colors group"
          >
            <span>Particular</span>
            <Plus size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {expandedSections.particular && (
            <div className="py-1">
              {rootNotes.length === 0 ? (
                <div className="px-2 py-1 text-xs text-[#555]">Nenhuma nota</div>
              ) : (
                rootNotes.map(note => (
                  <SidebarItem
                    key={note.id}
                    note={note}
                    session={session}
                    onAddChild={handleAddChild}
                    onDelete={handleDeleteRootNote}
                    currentPathname={pathname}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* Compartilhado Section */}
        <div className="mt-4 px-2">
          <div className="px-2 py-1 text-xs font-medium text-[#9b9b9b]">
            Compartilhado
          </div>
          <div className=" py-1">
            <button className="flex items-center text-base gap-2 px-2 py-1.5 hover:bg-[#2f2f2f] rounded w-full text-left transition-colors">
              <Plus size={16} />
              <span>Começar a colaborar</span>
            </button>
          </div>
        </div>

        {/* Aplicativos do Notion */}
        <div className="mt-4 px-2">
          <div className="px-2 py-1 text-xs font-medium text-[#9b9b9b]">
            Aplicativos do Notion
          </div>
          <div className="py-1 text-base">
            <NavItem icon={<Mail size={22} />} label="Notion Mail" />
            <NavItem icon={<Calendar size={22} />} label="Notion Calendar" />
            <NavItem icon={<Monitor size={22} />} label="Notion para desktop" />

          </div>

          <div className="my-4 text-base">
            <NavItem icon={<Settings size={22} />} label="Settings" onClick={() => setIsSettingsModalOpen(true)} />
            <NavItem icon={<Layers size={22} />} label="Modelos" />
            <NavItem icon={<Trash2 size={22} />} label="Lixeira" onClick={() => setIsTrashModalOpen(true)} />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-[#2f2f2f]">
        <div className="p-2">
          <button className="hover:bg-[#2f2f2f] p-2 rounded w-full flex items-center transition-colors text-base text-[#ada9a3] hover:text-white">
            <HelpCircle size={22} />
          </button>
        </div>
      </div>

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        position={userModalPos}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />
      <SearchModal
        open={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
      <TrashModal
        open={isTrashModalOpen}
        onClose={() => setIsTrashModalOpen(false)}
      />
      <SettingsModal
        open={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
      <MoreOptionsModal
        open={isMoreOptionsModalOpen}
        onClose={() => setIsMoreOptionsModalOpen(false)}
        position={moreOptionsModalPos}
      />
    </div>

  );
}

function NavItem({ icon, label, href, onClick, isActive }: { icon: React.ReactNode; label: string; href?: string; onClick?: () => void; isActive?: boolean }) {
  const content = (
    <div className={`flex items-center gap-2 px-2 py-1.5 rounded w-full text-left transition-colors truncate ${isActive ? 'bg-[#2f2f2f] text-white' : 'hover:bg-[#2f2f2f] text-[#ada9a3] hover:text-white'}`}>
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  );

  if (href) {
    return <Link href={href} className="block w-full">{content}</Link>;
  }

  return <button className="w-full" onClick={onClick}>{content}</button>;
}

function SidebarItem({
  note,
  depth = 0,
  session,
  onAddChild,
  onDelete,
  onRemove,
  currentPathname
}: {
  note: Note;
  depth?: number;
  session: any;
  onAddChild: (parentId: string, e: React.MouseEvent) => void;
  onDelete: (noteId: string) => void;
  onRemove?: () => void;
  currentPathname: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [children, setChildren] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const { favoriteNotes, toggleFavorite } = useFavorite();
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

  const handleDeleteAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If onRemove is present (e.g. for favorites), simply call it and close menu
    if (onRemove) {
        onRemove();
        setShowOptions(false);
        return;
    }

    if (!confirm("Tem certeza que deseja excluir esta nota?")) return;

    try {
      await api.delete(`/notes/${note.id}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      onDelete(note.id);
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
        className={`group flex items-center gap-2 px-2 py-1.5 rounded transition-colors relative text-base ${isActive ? 'bg-[#2f2f2f] text-white' : 'hover:bg-[#2f2f2f] text-[#ada9a3] hover:text-white'}`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {/* Icon & Toggle */}
        <div
          role="button"
          onClick={handleToggle}
          className="relative flex items-center justify-center w-6 h-6 shrink-0 z-10 cursor-pointer rounded hover:bg-[#3f3f3f]"
        >
          <FileText size={22} className="transition-opacity duration-200 group-hover:opacity-0" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <ChevronRight
              size={18}
              className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
            />
          </div>
        </div>

        {/* Title */}
        <span className="truncate flex-1">{note.title || "Sem título"}</span>

        {/* Hover Actions */}
        <div className="hidden group-hover:flex items-center absolute right-2 bg-[#2f2f2f]">
          <button
            className="p-0.5 hover:bg-[#3f3f3f] rounded text-[#ada9a3] hover:text-white relative"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowOptions(!showOptions);
            }}
          >
            <MoreHorizontal size={14} />
          </button>
          <button
            className="p-0.5 hover:bg-[#3f3f3f] rounded text-[#ada9a3] hover:text-white"
            onClick={handleAddChildLocal}
          >
            <Plus size={14} />
          </button>
        </div>
      </Link>

      {/* Options Dropdown */}
      {showOptions && (
        <div
          ref={menuRef}
          className="absolute z-50 bg-[#252525] border border-[#3f3f3f] rounded shadow-xl py-1 w-32"
          style={{
            top: '28px',
            right: '10px',
            // Dynamic positioning could be better but sticking to simple relative for now
          }}
        >
          {!onRemove && (
            <button
                onClick={handleToggleFavorite}
                className="w-full text-left px-3 py-1.5 text-xs text-[#ada9a3] hover:text-white hover:bg-[#3f3f3f] flex items-center gap-2"
            >
                <Star size={14} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "text-yellow-400" : ""} />
                <span>{isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}</span>
            </button>
          )}

          <button
            onClick={handleDeleteAction}
            className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#3f3f3f] flex items-center gap-2 ${onRemove ? 'text-[#ada9a3] hover:text-white' : 'text-[#ff5f5f]'}`}
          >
            {onRemove ? (
                <>
                    <Star size={14} /> {/* Or Minus/X icon */}
                    <span>Remover dos favoritos</span>
                </>
            ) : (
                <>
                    <Trash2 size={14} />
                    <span>Excluir</span>
                </>
            )}
          </button>
        </div>
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
            <div className="py-1 text-xs text-[#555]" style={{ paddingLeft: `${(depth + 1) * 12 + 24}px` }}>
              Sem páginas
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
              // onRemove is NOT passed recursively to children. 
              // Children of favorites are not favorites themselves by default (in this view).
              currentPathname={currentPathname}
            />
          ))}
        </div>
      )}
    </div>
  );
}