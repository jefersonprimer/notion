'use client';

import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Carousel from './components/Carousel';
import api from '@/lib/api';
import { Note } from '@/types/note';
import { useAuth } from '@/context/AuthContext';
import { useLayout } from '@/context/LayoutContext';
import { Menu, ChevronsRight, MoreHorizontal } from 'lucide-react';

export default function Home() {
  const { session } = useAuth();
  const { isSidebarOpen, setIsSidebarOpen } = useLayout();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFloatingOpen, setIsFloatingOpen] = useState(false);

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

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#191919]">
      {/* Main Sidebar (when open) */}
      {isSidebarOpen && <Sidebar />}

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <div className="h-12 flex items-center justify-between px-4  relative z-20">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">

            {/* Menu / Floating Sidebar Trigger */}
            {!isSidebarOpen && (
              <div
                className="relative group mr-1"
                onMouseEnter={() => setIsFloatingOpen(true)}
                onMouseLeave={() => setIsFloatingOpen(false)}
              >
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded transition-colors"
                >
                  <Menu size={20} className="group-hover:hidden text-white" />
                  <ChevronsRight size={20} className="hidden group-hover:block text-white-500 hover:text-white" />
                </button>

                {/* Floating Sidebar */}
                {isFloatingOpen && (
                  <div className="absolute top-full left-0 mt-2 w-60 max-h-[70vh] shadow-xl rounded-lg overflow-hidden border border-[#2f2f2f] bg-[#202020] animate-in fade-in zoom-in-95 duration-100 origin-top-left">
                    <Sidebar isFloating={true} />
                  </div>
                )}
              </div>
            )}

          </div>

          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded text-white-500 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto flex-col items-center w-full max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center">
              Bom dia, {session?.user.displayName || 'Usuário'}
            </h1>
          </header>

          {loading ? (
            <div className="flex items-center justify-center h-40 text-gray-500">
              Carregando notas...
            </div>
          ) : (
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
          )}
        </div>
      </main>
    </div>
  );
}
