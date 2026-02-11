'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import api from '@/lib/api';
import { Note } from '@/types/note';
import { useAuth } from '@/context/AuthContext';
import { useLayout } from '@/context/LayoutContext';
import { useFavorite } from '@/context/FavoriteContext';
import { extractIdFromSlug, createNoteSlug } from '@/lib/utils';
import { MoreHorizontal, Menu, ChevronsRight, LockKeyhole, ChevronDown, Star } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { SortableBlock } from '../components/SortableBlock';

const generateId = () => Math.random().toString(36).substr(2, 9);

const PREFIXES: Record<string, string> = {
  h1: '# ',
  h2: '## ',
  h3: '### ',
  bullet: '- ',
  number: '1. ',
  todo: '[] ',
  todo_checked: '[x] ',
  toggle: '> ',
};

export default function NotePage() {
  const params = useParams();
  const { session } = useAuth();
  const { isSidebarOpen, setIsSidebarOpen } = useLayout();
  const { favoriteNotes, toggleFavorite } = useFavorite();
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<{ id: string; type: string; content: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFloatingOpen, setIsFloatingOpen] = useState(false);
  
  const titleDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const blocksDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const inputRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    async function fetchNote() {
      if (!session) return;
      
      const slug = params?.slug;
      if (!slug) return;

      const slugString = Array.isArray(slug) ? slug[0] : slug;
      const noteId = extractIdFromSlug(slugString);
      
      if (note && note.id === noteId) return;

      try {
        const response = await api.get(`/notes/${noteId}`, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`
            }
        });
        setNote(response.data);
        setTitle(response.data.title === 'Sem título' ? '' : response.data.title);
        
        // Parse description into typed blocks
        const desc = response.data.description || '';
        const initialBlocks = desc.split('\n').map((line: string) => {
            let type = 'text';
            let content = line;

            for (const [key, prefix] of Object.entries(PREFIXES)) {
                if (line.startsWith(prefix)) {
                    type = key;
                    content = line.slice(prefix.length);
                    break;
                }
            }
            return { id: generateId(), type, content };
        });

        if (initialBlocks.length === 0 || (initialBlocks.length === 1 && initialBlocks[0].content === '')) {
            setBlocks([{ id: generateId(), type: 'text', content: '' }]);
        } else {
            setBlocks(initialBlocks);
        }

      } catch (error) {
        console.error('Error fetching note:', error);
        setError('Nota não encontrada');
      } finally {
        setLoading(false);
      }
    }

    fetchNote();
  }, [session, params]);

  const handleTitlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    const lines = pastedText.split('\n');

    if (lines.length > 1) {
        e.preventDefault();
        const newTitle = lines[0];
        const newContentBlocks = lines.slice(1).filter(line => line.trim() !== '').map(line => ({
            id: generateId(),
            type: 'text',
            content: line
        }));

        setTitle(newTitle);
        
        // Insert new content blocks at the beginning of the blocks array
        setBlocks(prevBlocks => [...newContentBlocks, ...prevBlocks]);

        // Focus the first new block if any were added
        if (newContentBlocks.length > 0) {
            setTimeout(() => {
                inputRefs.current.get(newContentBlocks[0].id)?.focus();
            }, 0);
        } else {
            // If only title was pasted or only empty lines after title, focus title
            titleInputRef.current?.focus();
        }
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    if (note) {
        const cleanId = note.id.replace(/-/g, '');
        let newSlug;
        if (!newTitle.trim()) {
            newSlug = cleanId;
        } else {
            newSlug = createNoteSlug(newTitle, note.id);
        }
        
        const searchParams = window.location.search;
        window.history.replaceState(null, '', `/${newSlug}${searchParams}`);

        if (titleDebounceRef.current) clearTimeout(titleDebounceRef.current);
        titleDebounceRef.current = setTimeout(async () => {
            if (!session) return;
            try {
                await api.put(`/notes/${note.id}`, { title: newTitle }, {
                     headers: { Authorization: `Bearer ${session.accessToken}` }
                });
            } catch (err) {
                console.error("Failed to save title", err);
            }
        }, 800);
    }
  };

  // Save blocks when they change
  useEffect(() => {
      if (!note || loading) return;

      if (blocksDebounceRef.current) clearTimeout(blocksDebounceRef.current);
      blocksDebounceRef.current = setTimeout(async () => {
          if (!session) return;
          // Join blocks back with prefixes
          const description = blocks.map(b => {
              const prefix = PREFIXES[b.type] || '';
              return prefix + b.content;
          }).join('\n');

          try {
              await api.put(`/notes/${note.id}`, { description }, {
                      headers: { Authorization: `Bearer ${session.accessToken}` }
              });
          } catch (err) {
              console.error("Failed to save description", err);
          }
      }, 1000);
  }, [blocks, note, session, loading]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleBlockChange = (id: string, newContent: string, newType?: string) => {
      setBlocks(prev => prev.map(b => 
          b.id === id ? { ...b, content: newContent, type: newType ?? b.type } : b
      ));
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
          e.preventDefault();
          if (blocks.length > 0) {
              inputRefs.current.get(blocks[0].id)?.focus();
          }
      }
  };

  const setCursor = (el: HTMLDivElement, position: number) => {
    const range = document.createRange();
    const sel = window.getSelection();
    if (el.childNodes.length > 0) {
      range.setStart(el.childNodes[0], position);
      range.collapse(true);
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  };

  const handleBlockKeyDown = (e: React.KeyboardEvent, id: string) => {
      const index = blocks.findIndex(b => b.id === id);
      const el = inputRefs.current.get(id);

      if (e.key === 'ArrowUp') {
          if (index > 0) {
              e.preventDefault();
              const prevId = blocks[index - 1].id;
              inputRefs.current.get(prevId)?.focus();
          } else {
              e.preventDefault();
              titleInputRef.current?.focus();
          }
      } else if (e.key === 'ArrowDown') {
          if (index < blocks.length - 1) {
              e.preventDefault();
              const nextId = blocks[index + 1].id;
              inputRefs.current.get(nextId)?.focus();
          }
      } else if (e.key === 'Enter') {
          e.preventDefault();
          const currentBlock = blocks[index];
          
          let nextType = 'text';
          if (['bullet', 'number', 'todo', 'toggle'].includes(currentBlock.type)) {
              nextType = currentBlock.type;
          }

          const newBlock = { id: generateId(), type: nextType, content: '' };
          const newBlocks = [...blocks];
          newBlocks.splice(index + 1, 0, newBlock);
          setBlocks(newBlocks);
          
          setTimeout(() => {
              inputRefs.current.get(newBlock.id)?.focus();
          }, 0);

      } else if (e.key === 'Backspace') {
          if (!el) return;
          const selection = window.getSelection();
          if (!selection || !selection.anchorNode) return;

          const isAtStart = selection.isCollapsed && selection.anchorOffset === 0;

          const prefixedTypes = ['bullet', 'number', 'todo', 'toggle'];
          const isPrefixedType = prefixedTypes.includes(blocks[index].type);

          if (isAtStart) {
              if (blocks[index].content.length === 0) {
                  e.preventDefault();
                  const newBlocks = blocks.filter(b => b.id !== id);
                  setBlocks(newBlocks);

                  setTimeout(() => {
                      if (index > 0) {
                          const prevBlock = blocks[index - 1];
                          inputRefs.current.get(prevBlock.id)?.focus();
                      } else {
                          titleInputRef.current?.focus();
                      }
                  }, 0);
              } else if (isPrefixedType) {
                  e.preventDefault();
                  setBlocks(prev => prev.map(b => 
                      b.id === id ? { ...b, type: 'text' } : b
                  ));
              } else if (index > 0) {
                  e.preventDefault();
                  const prevBlock = blocks[index - 1];
                  const currentBlock = blocks[index];
                  
                  const cursorPosition = prevBlock.content.length;
                  
                  const updatedPrevBlock = {
                      ...prevBlock,
                      content: prevBlock.content + currentBlock.content
                  };

                  const newBlocks = blocks.filter(b => b.id !== id);
                  newBlocks[index - 1] = updatedPrevBlock;
                  setBlocks(newBlocks);

                  setTimeout(() => {
                      const prevInput = inputRefs.current.get(prevBlock.id);
                      if (prevInput) {
                          prevInput.focus();
                          setCursor(prevInput, cursorPosition);
                      }
                  }, 0);
              } else {
                  e.preventDefault();
                  titleInputRef.current?.focus();
              }
          }
      } else if (e.key === 'Delete') {
          if (!el) return;
          const selection = window.getSelection();
          if (!selection || !selection.anchorNode) return;

          const isAtEnd = selection.isCollapsed && selection.anchorOffset === el.innerText.length;
          
          if (isAtEnd) {
              const nextBlock = blocks[index + 1];
              if (nextBlock) {
                  e.preventDefault();
                  const currentBlock = blocks[index];
                  const cursorPosition = currentBlock.content.length;
                  
                  const updatedBlock = {
                      ...currentBlock,
                      content: currentBlock.content + nextBlock.content
                  };
                  
                  const newBlocks = [...blocks];
                  newBlocks[index] = updatedBlock;
                  newBlocks.splice(index + 1, 1);
                  setBlocks(newBlocks);

                  setTimeout(() => {
                      const currentInput = inputRefs.current.get(id);
                      if (currentInput) {
                          currentInput.focus();
                          setCursor(currentInput, cursorPosition);
                      }
                  }, 0);
              }
          }
      }
  };

  const handlePasteMultiLine = (id: string, newLines: string[]) => {
      setBlocks(prevBlocks => {
          const index = prevBlocks.findIndex(b => b.id === id);
          if (index === -1) return prevBlocks;

          const updatedBlocks = [...prevBlocks];
          const currentBlock = updatedBlocks[index];

          // Update current block with the first line
          updatedBlocks[index] = { ...currentBlock, content: currentBlock.content + newLines[0] };

          // Add remaining lines as new blocks
          const newBlockElements = newLines.slice(1).map(line => ({
              id: generateId(),
              type: 'text', // New blocks are text by default
              content: line
          }));

          updatedBlocks.splice(index + 1, 0, ...newBlockElements);
          
          // Focus the last new block if any were added
          if (newBlockElements.length > 0) {
              setTimeout(() => {
                  inputRefs.current.get(newBlockElements[newBlockElements.length - 1].id)?.focus();
              }, 0);
          }

          return updatedBlocks;
      });
  };

  const isFavorite = note ? favoriteNotes.some(n => n.id === note.id) : false;

  useEffect(() => {
    if (title) {
      document.title = `${title}`;
    } else if (note) {
      document.title = `Sem título`;
    }
  }, [title, note]);

  const handleToggleFavorite = () => {
    if (!note) return;
    toggleFavorite(note);
    // Optimistically update local note state as well so the UI reflects it immediately if it depends on note state
    setNote(prev => prev ? { ...prev, is_favorite: !prev.is_favorite } : null);
  };

  // Helper for Sidebar logic in Loading/Error states
  const SidebarElement = () => (
      isSidebarOpen ? <Sidebar /> : null
  );

  if (loading) {
    return (
       <div className="flex min-h-screen bg-white dark:bg-[#191919]">
        <SidebarElement />
        <div className="flex-1 flex items-center justify-center text-gray-500">
            Carregando...
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
        <div className="flex min-h-screen bg-white dark:bg-[#191919]">
        <SidebarElement />
        <div className="flex-1 flex items-center justify-center text-gray-500">
            {error || 'Nota não encontrada'}
        </div>
      </div>
    );
  }

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
                            className="p-1 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded text-gray-500 transition-colors"
                        >
                            <Menu size={20} className="group-hover:hidden" />
                            <ChevronsRight size={20} className="hidden group-hover:block" />
                        </button>

                        {/* Floating Sidebar */}
                        {isFloatingOpen && (
                            <div className="absolute top-full left-0 mt-2 w-60 max-h-[70vh] shadow-xl rounded-lg overflow-hidden border border-[#2f2f2f] bg-[#202020] animate-in fade-in zoom-in-95 duration-100 origin-top-left">
                                <Sidebar isFloating={true} />
                            </div>
                        )}
                     </div>
                 )}

                <div className="flex items-center">
                  <button className="text-sm text-[#f0efed] font-normal truncate max-w-[240px] hover:bg-[#fffff315] px-2 py-1 rounded-md">
                    {title.trim() || 'Sem título'}
                  </button>
                  <button 
                      className="flex items-center justify-center text-sm font-normal text-[#7d7a75] hover:text-[#f0efed] gap-2 hover:bg-[#202020] px-2 py-1 rounded-md"
                      title="Somente voce tem acesso"
                  >
                      <LockKeyhole size={14}/>
                      Particular
                      <ChevronDown size={14}/>
                  </button>
                </div>
              </div>
             <div className="flex items-center gap-2">
              <button 
                className="flex items-center justify-center gap-2 border border-[#383836] text-sm hover:bg-[#fffff315] px-2 py-1 rounded-md"
                title="Compartilhar"
              >
                <LockKeyhole size={14}/>
                Compartilhar
                <ChevronDown size={14}/>
              </button>

              <button 
                onClick={handleToggleFavorite}
                className={`p-1.5 hover:bg-gray-100 dark:hover:bg-[#fffff315] rounded-md transition-colors ${isFavorite ? 'text-[#ca984d]' : 'text-[#f0efed]'}`}
                title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                <Star size={18} fill={isFavorite ? "currentColor" : "none"} />
              </button>

              <button 
                className="p-1.5 text-[#f0efed] hover:bg-gray-100 dark:hover:bg-[#fffff315] rounded-md"
                title="Mais opções"
              >
                <MoreHorizontal size={20}/>
              </button>
             </div>
        </div>

        {/* Note Content Area */}
        <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-12 py-12">
                {/* Title Input */}
                <input
                    ref={titleInputRef}
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    onKeyDown={handleTitleKeyDown}
                    onPaste={handleTitlePaste} // Add onPaste handler here
                    placeholder="Sem título"
                    className="w-full text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6 bg-transparent border-none outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600"
                />
                
                {/* Blocks List */}
                <div className="pb-40">
                    <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext 
                            items={blocks.map(b => b.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {blocks.map((block, i) => {
                                let listNumber = undefined;
                                if (block.type === 'number') {
                                    // Find previous number block to determine sequence
                                    let currentNumber = 1;
                                    for (let j = 0; j < i; j++) {
                                        if (blocks[j].type === 'number') {
                                            currentNumber++;
                                        }
                                    }
                                    listNumber = currentNumber;
                                }
                                return (
                                    <SortableBlock
                                        key={block.id}
                                        id={block.id}
                                        type={block.type}
                                        content={block.content}
                                        onChange={handleBlockChange}
                                        onKeyDown={handleBlockKeyDown}
                                        inputRef={(el) => {
                                            if (el) inputRefs.current.set(block.id, el);
                                            else inputRefs.current.delete(block.id);
                                        }}
                                        onPasteMultiLine={handlePasteMultiLine}
                                        listNumber={listNumber}
                                    />
                                );
                            })}
                        </SortableContext>
                    </DndContext>
                    
                    {/* Add block at bottom if empty list (though we initialize with one) or just click area */}
                    <div 
                        className="h-20 cursor-text"
                        onClick={() => {
                             const newBlock = { id: generateId(), type: 'text', content: '' };
                             setBlocks(prev => [...prev, newBlock]);
                             setTimeout(() => inputRefs.current.get(newBlock.id)?.focus(), 0);
                        }}
                    />
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
