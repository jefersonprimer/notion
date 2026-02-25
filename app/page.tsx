'use client';

import { useEffect, useState, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Carousel from './components/Carousel';
import api from '@/lib/api';
import { Note } from '@/types/note';
import { useAuth } from '@/context/AuthContext';
import { useLayout } from '@/context/LayoutContext';
import { useRouter } from 'next/navigation';
import { Menu, ChevronsRight, MoreHorizontal, ChevronRight, Home as HomeIcon, Clock, ArrowUpCircle, Sparkles, Check, FileText, Eye, HelpCircle } from 'lucide-react';

export default function Home() {
  const { session } = useAuth();
  const { isSidebarOpen, setIsSidebarOpen } = useLayout();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFloatingOpen, setIsFloatingOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [showStartPageSubmenu, setShowStartPageSubmenu] = useState(false);
  const [showWidgetsSubmenu, setShowWidgetsSubmenu] = useState(false);
  const [greeting, setGreeting] = useState('');
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    document.title = 'Página inicial | Cognition';
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
        setShowStartPageSubmenu(false);
        setShowWidgetsSubmenu(false);
      }
    }

    if (isMoreMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMoreMenuOpen]);

  useEffect(() => {
    async function fetchNotes() {
      if (!session) return;

      try {
        // Assuming the endpoint is /notes and it returns the user's notes
        // We might need to pass the token in headers if not handled by interceptors/defaults
        // In AuthContext we set localStorage but maybe not axios defaults globally yet for every request?
        // Let's set the header explicitly here to be safe or rely on an interceptor if one exists.
        // The previous setup_database.sql suggests a 'notes' table.
        // The backend 'noteRouter' is at '/api/notes'.

        const response = await api.get('/notes', {
          headers: {
            Authorization: `Bearer ${session.accessToken}`
          }
        });
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, [session]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white dark:bg-[#191919]">
        {isSidebarOpen && <Sidebar />}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header Skeleton */}
          <div className="h-12 flex items-center justify-between px-4 relative z-20">
            <div className="flex items-center gap-4">
              {!isSidebarOpen && <div className="w-8 h-8 bg-[#2f2f2f] rounded animate-pulse" />}
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-[#2f2f2f] rounded animate-pulse" />
                <div className="h-4 w-32 bg-[#2f2f2f] rounded animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 bg-[#2f2f2f] rounded animate-pulse" />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8 w-full max-w-5xl mx-auto">
            <div className="w-6 h-6 border-2 border-[#383836] border-t-white/80 rounded-full animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#191919]">
      {/* Main Sidebar (when open) */}
      {isSidebarOpen && <Sidebar />}

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Top Bar */}
        <div className="h-12 flex items-center justify-between px-4  relative z-20">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">

            {/* Menu / Floating Sidebar Trigger */}
            {!isSidebarOpen && (
              <div
                className="relative group mr-1"
                onMouseEnter={() => {
                  if (window.innerWidth >= 768) {
                    setIsFloatingOpen(true);
                  }
                }}
                onMouseLeave={() => setIsFloatingOpen(false)}
              >
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded transition-colors"
                >
                  <Menu size={20} className="md:group-hover:hidden text-[#f0efed]" />
                  <ChevronsRight size={20} className="hidden md:group-hover:block text-white-500 hover:text-[#e6e5e3s]" />
                </button>

                {/* Floating Sidebar */}
                {isFloatingOpen && (
                  <div className="absolute top-full left-0 mt-2 w-60 max-h-[80vh] shadow-xl rounded-lg overflow-visible border border-[#2f2f2f] bg-[#202020] animate-in fade-in zoom-in-95 duration-100 origin-top-left">
                    <Sidebar isFloating={true} />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2" ref={moreMenuRef}>
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className={`p-1 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded text-[#e6e5e3] transition-colors ${isMoreMenuOpen ? 'bg-[#2f2f2f]' : ''}`}
            >
              <MoreHorizontal size={22} />
            </button>

            {isMoreMenuOpen && (
              <div className="absolute top-full right-3 mt-1 w-72 bg-[#252525] border border-[#3f3f3f] rounded-lg shadow-xl py-1 z-50 text-sm text-[#9b9b9b]">
                {/* Option 1: Alterar a página inicial */}
                <div
                  className="relative px-3 py-1.5 hover:bg-[#3f3f3f] hover:text-white cursor-pointer flex items-center justify-between mx-1 rounded group"
                  onClick={() => {
                    setShowStartPageSubmenu(!showStartPageSubmenu);
                    setShowWidgetsSubmenu(false);
                  }}
                >
                  <span className="flex items-center gap-2 truncate">
                    <FileText size={16} />
                    Alterar a página inicial para...
                  </span>
                  <ChevronRight size={14} />

                  {/* Submenu - Left side */}
                  {showStartPageSubmenu && (
                    <div className="absolute top-0 right-full mr-1 w-64 bg-[#252525] border border-[#3f3f3f] rounded-lg shadow-xl py-1 text-[#9b9b9b] z-50">
                      <button className="w-full text-left px-3 py-1.5 hover:bg-[#3f3f3f] hover:text-white flex items-center gap-2">
                        <HomeIcon size={16} /> <span>Página inicial</span>
                      </button>
                      <button className="w-full text-left px-3 py-1.5 hover:bg-[#3f3f3f] hover:text-white flex items-center gap-2">
                        <Clock size={16} /> <span>Última página visitada</span>
                      </button>
                      <button className="w-full text-left px-3 py-1.5 hover:bg-[#3f3f3f] hover:text-white flex items-center gap-2">
                        <ArrowUpCircle size={16} /> <span>Página superior na barra lateral</span>
                      </button>
                      <button className="w-full text-left px-3 py-1.5 hover:bg-[#3f3f3f] hover:text-white flex items-center gap-2">
                        <Sparkles size={16} /> <span>IA do Notion</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Option 2: Mostrar/ocultar widgets */}
                <div
                  className="relative px-3 py-1.5 hover:bg-[#3f3f3f] hover:text-white cursor-pointer flex items-center justify-between mx-1 rounded group"
                  onClick={() => {
                    setShowWidgetsSubmenu(!showWidgetsSubmenu);
                    setShowStartPageSubmenu(false);
                  }}
                >
                  <span className="flex items-center gap-2 truncate">
                    <Eye size={16} />
                    Mostrar/ocultar widgets
                  </span>
                  <ChevronRight size={14} />

                  {/* Submenu - Left side for Widgets */}
                  {showWidgetsSubmenu && (
                    <div className="absolute top-0 right-full mr-1 w-64 bg-[#252525] border border-[#3f3f3f] rounded-lg shadow-xl py-1 text-[#9b9b9b] z-50">
                      {[
                        "Saudação",
                        "Próximos eventos",
                        "Minhas tarefas",
                        "Visualizações de base de dados",
                        "Dicas",
                        "Modelos em destaque"
                      ].map((widget) => (
                        <button key={widget} className="w-full text-left px-3 py-1.5 hover:bg-[#3f3f3f] hover:text-white flex items-center justify-between">
                          <span>{widget}</span>
                          <Check size={16} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Option 3: Saiba mais... */}
                <button
                  className="w-full text-left px-3 py-1.5 hover:bg-[#3f3f3f] hover:text-white flex items-center gap-2 mx-1 rounded"
                  style={{ width: 'calc(100% - 8px)' }}
                  onClick={() => router.push('/help/home-and-my-tasks')}
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle size={16} />
                    Saiba mais sobre a página in...
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 flex-col items-center w-full max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-[#f0efed] text-center">
              {greeting}
            </h1>
          </header>

          <div className="space-y-8">
            <Carousel title="Acessos recentes" notes={notes} />
            {/* We can filter notes for different carousels if needed, e.g. Favorites */}
            {notes.some(n => n.is_favorite) && (
              <Carousel
                title="Favoritos"
                notes={notes.filter(n => n.is_favorite)}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
