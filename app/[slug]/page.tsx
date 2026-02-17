'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import api from '@/lib/api';
import { Note } from '@/types/note';
import { useAuth } from '@/context/AuthContext';
import { useLayout } from '@/context/LayoutContext';
import { useFavorite } from '@/context/FavoriteContext';
import { useNote } from '@/context/NoteContext';
import { extractIdFromSlug, createNoteSlug, isLikelyCode } from '@/lib/utils';
import {
MoreHorizontal,
Menu,
ChevronsRight,
LockKeyhole,
ChevronDown,
Star,
ChevronRight,
Share,
Smile,
Image as ImageIcon,
MessageSquareText,
Trash2,
RotateCcw
} from 'lucide-react';
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
import PageOptionsModal from '../components/PageOptionsModal';
import ShareModal from '../components/ShareModal';
import FloatingToolbar from '../components/FloatingToolbar';
import FloatingMobileToolbar from '../components/FloatingMobileToolbar';

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
  page: 'p: ',
  image: 'img: ',
  video: 'vid: ',
};

export default function NotePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { session } = useAuth();
  const { isSidebarOpen, setIsSidebarOpen } = useLayout();
  const { favoriteNotes, toggleFavorite, removeNoteFromFavorites } = useFavorite();
  const { updatedTitles, updateNoteTitle, updateNoteHasContent } = useNote();
  const [note, setNote] = useState<Note | null>(null);
  const [parentNote, setParentNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<{ id: string; type: string; content: string }[]>([]);
  const [history, setHistory] = useState<{ past: typeof blocks[], future: typeof blocks[] }>({ past: [], future: [] });
  const [childTitles, setChildTitles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFloatingOpen, setIsFloatingOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectionBox, setSelectionBox] = useState<{ x1: number, y1: number, x2: number, y2: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [toolbarPosition, setToolbarPosition] = useState<{ top: number, left: number } | undefined>(undefined);
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);

  const titleDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const blocksDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const inputRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleBlockFocus = (id: string) => {
    setFocusedBlockId(id);
    if (window.innerWidth < 768) {
      setIsToolbarVisible(true);
      const el = id === 'title' ? titleInputRef.current : inputRefs.current.get(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        setToolbarPosition({
          top: rect.bottom + 10,
          left: rect.left
        });
      }
    }
  };

  const handleBlockBlur = () => {
    setTimeout(() => {
      const activeEl = document.activeElement;
      const isInput = activeEl?.getAttribute('contenteditable') === 'true' ||
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA';
      const isToolbarButton = activeEl?.closest('.floating-mobile-toolbar');

      if (!isInput && !isToolbarButton) {
        setIsToolbarVisible(false);
        setFocusedBlockId(null);
      }
    }, 150);
  };

  // Helper to update blocks with history
  const updateBlocks = (newBlocks: typeof blocks | ((prev: typeof blocks) => typeof blocks), saveToHistory = true) => {
    if (saveToHistory) {
      setHistory(prev => ({
        past: [blocks, ...prev.past].slice(0, 50), // Limit to 50 steps
        future: []
      }));
    }
    if (typeof newBlocks === 'function') {
      setBlocks(newBlocks);
    } else {
      setBlocks(newBlocks);
    }
  };

  const undo = () => {
    if (history.past.length === 0) return;
    const previous = history.past[0];
    const newPast = history.past.slice(1);
    setHistory(prev => ({
      past: newPast,
      future: [blocks, ...prev.future]
    }));
    setBlocks(previous);
  };

  const redo = () => {
    if (history.future.length === 0) return;
    const next = history.future[0];
    const newFuture = history.future.slice(1);
    setHistory(prev => ({
      past: [blocks, ...prev.past],
      future: newFuture
    }));
    setBlocks(next);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      // Start selection only if clicking on the container or empty space, not on inputs/buttons
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('input') || target.closest('[contenteditable="true"]') || target.closest('a')) {
        return;
      }

      setSelectionBox({ x1: e.clientX, y1: e.clientY, x2: e.clientX, y2: e.clientY });
      if (!e.shiftKey) setSelectedIds(new Set());
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!selectionBox) return;

      setSelectionBox(prev => prev ? { ...prev, x2: e.clientX, y2: e.clientY } : null);

      // Collision detection
      const xMin = Math.min(selectionBox.x1, e.clientX);
      const xMax = Math.max(selectionBox.x1, e.clientX);
      const yMin = Math.min(selectionBox.y1, e.clientY);
      const yMax = Math.max(selectionBox.y1, e.clientY);

      const newSelected = new Set(e.shiftKey ? selectedIds : []);

      blocks.forEach(block => {
        const el = inputRefs.current.get(block.id)?.closest('.group');
        if (el) {
          const rect = el.getBoundingClientRect();
          const isIntersecting = !(rect.right < xMin || rect.left > xMax || rect.bottom < yMin || rect.top > yMax);
          if (isIntersecting) {
            newSelected.add(block.id);
          }
        }
      });

      setSelectedIds(newSelected);
    };

    const handleMouseUp = () => {
      setSelectionBox(null);
    };

    if (selectionBox) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      containerRef.current?.addEventListener('mousedown', handleMouseDown);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      containerRef.current?.removeEventListener('mousedown', handleMouseDown);
    };
  }, [selectionBox, blocks, selectedIds]);

  useEffect(() => {
    async function fetchNote() {
      if (!session) return;

      const slug = params?.slug;
      if (!slug) return;

      const slugString = Array.isArray(slug) ? slug[0] : slug;
      const noteId = extractIdFromSlug(slugString);

      if (note && note.id === noteId) return;

      try {
        const [noteResponse, childrenResponse] = await Promise.all([
          api.get(`/notes/${noteId}`, {
            headers: { Authorization: `Bearer ${session.accessToken}` }
          }),
          api.get(`/notes/${noteId}/children`, {
            headers: { Authorization: `Bearer ${session.accessToken}` }
          })
        ]);

        const noteData = noteResponse.data;
        const childrenData = childrenResponse.data;

        setNote(noteData);
        setTitle(noteData.title === 'Nova página' ? '' : noteData.title);

        const hasInitialContent = (noteData.title && noteData.title !== 'Nova página' && noteData.title.trim() !== '') && (noteData.description && noteData.description.trim() !== '');
        updateNoteHasContent(noteData.id, !!hasInitialContent);

        // Fetch parent note if exists
        if (noteData.parentId) {
          try {
            const parentResponse = await api.get(`/notes/${noteData.parentId}`, {
              headers: { Authorization: `Bearer ${session.accessToken}` }
            });
            setParentNote(parentResponse.data);
          } catch (err) {
            console.error("Error fetching parent note:", err);
          }
        } else {
          setParentNote(null);
        }

        const titlesMap: Record<string, string> = {};
        childrenData.forEach((child: Note) => {
          const cleanChildId = child.id.replace(/-/g, '');
          titlesMap[cleanChildId] = child.title;
        });
        setChildTitles(titlesMap);

        // Parse description into typed blocks
        const desc = noteData.description || '';
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

  useEffect(() => {
    if (!loading && searchParams?.get('showMoveTo')) {
      titleInputRef.current?.focus();
    }
  }, [loading, searchParams]);

  const handleTitlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    const lines = pastedText.split('\n');

    if (lines.length > 1) {
      e.preventDefault();
      const newTitle = lines[0];
      const remainingText = lines.slice(1).join('\n');

      let newContentBlocks;
      if (isLikelyCode(remainingText)) {
        newContentBlocks = [{
          id: generateId(),
          type: 'code',
          content: remainingText
        }];
      } else {
        newContentBlocks = lines.slice(1).filter(line => line.trim() !== '').map(line => ({
          id: generateId(),
          type: 'text',
          content: line
        }));
      }

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
      updateNoteTitle(note.id, newTitle);

      const currentDescription = blocks.map(b => (PREFIXES[b.type] || '') + b.content).join('\n');
      const hasContent = (newTitle.trim() !== '' && newTitle !== 'Nova página') && currentDescription.trim() !== '';
      updateNoteHasContent(note.id, hasContent);

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

      const hasContent = (title.trim() !== '' && title !== 'Nova página') && description.trim() !== '';
      updateNoteHasContent(note.id, hasContent);

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
      updateBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSelect = (id: string, multi: boolean) => {
    setSelectedIds(prev => {
      const newSet = new Set(multi ? prev : []);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }

      if ((e.key === 'Backspace' || e.key === 'Delete') && selectedIds.size > 0) {
        const activeEl = document.activeElement;
        const isEditingTitle = activeEl === titleInputRef.current;

        // Se estiver editando o título, não apaga os blocos selecionados
        if (isEditingTitle) return;

        // Se houver mais de um bloco selecionado, OU se o bloco focado for um dos selecionados
        // e o cursor estiver no início (para Backspace) ou apenas se for Delete
        const isEditingBlock = activeEl?.getAttribute('contenteditable') === 'true';
        const focusedBlockId = activeEl?.id;

        // Check if any selected block is an image or other non-contenteditable block
        const hasNonEditableSelected = Array.from(selectedIds).some(id => {
          const block = blocks.find(b => b.id === id);
          return block && (block.type === 'image' || block.type === 'page');
        });

        if (selectedIds.size > 1 || hasNonEditableSelected || !isEditingBlock || (focusedBlockId && selectedIds.has(focusedBlockId))) {
          // Se houver texto selecionado DENTRO do bloco (seleção nativa), deixamos o comportamento padrão
          const selection = window.getSelection();
          if (selection && !selection.isCollapsed && isEditingBlock && selectedIds.size === 1) {
            return;
          }

          e.preventDefault();
          updateBlocks(prev => prev.filter(b => !selectedIds.has(b.id)));
          setSelectedIds(new Set());
        }
      }
      if (e.key === 'Escape') {
        setSelectedIds(new Set());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds]);

  // Listen for changeBlockType custom events from FloatingToolbar
  useEffect(() => {
    const handleChangeBlockType = (e: Event) => {
      const { blockId, newType } = (e as CustomEvent).detail;
      if (blockId && newType) {
        const block = blocks.find(b => b.id === blockId);
        if (block) {
          handleBlockChange(blockId, block.content, newType);
        }
      }
    };
    document.addEventListener('changeBlockType', handleChangeBlockType);
    return () => document.removeEventListener('changeBlockType', handleChangeBlockType);
  }, [blocks]);

  const handleBlockChange = async (id: string, newContent: string, newType?: string) => {
    if (newType === 'page') {
      if (!session || !note) return;
      try {
        const response = await api.post('/notes', { title: "Nova página", parentId: note.id }, {
          headers: { Authorization: `Bearer ${session.accessToken}` }
        });
        const newNote = response.data;
        const cleanId = newNote.id.replace(/-/g, '');

        // Add the block to current page content
        const newBlock = {
          id: generateId(),
          type: 'page',
          content: `${cleanId}|${newNote.title || "Nova página"}`
        };

        const updatedBlocks = blocks.map(b => b.id === id ? newBlock : b);
        setBlocks(updatedBlocks);

        // Save explicitly before navigating
        const description = updatedBlocks.map(b => {
          const prefix = PREFIXES[b.type] || '';
          return prefix + b.content;
        }).join('\n');

        await api.put(`/notes/${note.id}`, { description }, {
          headers: { Authorization: `Bearer ${session.accessToken}` }
        });

        router.push(`/${cleanId}?showMoveTo=true&saveParent=true`);
      } catch (error) {
        console.error('Error creating child note from slash menu:', error);
      }
      return;
    }
    updateBlocks(prev => prev.map(b =>
      b.id === id ? { ...b, content: newContent, type: newType ?? b.type } : b
    ), false); // Pass false for content changes as contentEditable has its own undo
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (blocks.length > 0) {
        inputRefs.current.get(blocks[0].id)?.focus();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const newBlock = { id: generateId(), type: 'text', content: '' };
      updateBlocks([newBlock, ...blocks]);
      setTimeout(() => {
        inputRefs.current.get(newBlock.id)?.focus();
      }, 0);
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
      const selection = window.getSelection();
      const isAtStart = selection?.anchorOffset === 0;
      const currentBlock = blocks[index];

      let nextType = 'text';
      if (['bullet', 'number', 'todo', 'toggle'].includes(currentBlock.type)) {
        nextType = currentBlock.type;
      }

      const newBlock = { id: generateId(), type: nextType, content: '' };
      const newBlocks = [...blocks];

      if (isAtStart && currentBlock.content.length > 0) {
        // Insert above
        newBlocks.splice(index, 0, newBlock);
        updateBlocks(newBlocks);
        // Focus remains same or we focus the new one above
        setTimeout(() => {
          inputRefs.current.get(currentBlock.id)?.focus();
        }, 0);
      } else {
        // Default: insert below
        newBlocks.splice(index + 1, 0, newBlock);
        updateBlocks(newBlocks);
        setTimeout(() => {
          inputRefs.current.get(newBlock.id)?.focus();
        }, 0);
      }

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
          updateBlocks(newBlocks);

          setTimeout(() => {
            if (index > 0) {
              const prevBlock = blocks[index - 1];
              const prevInput = inputRefs.current.get(prevBlock.id);
              if (prevInput) {
                prevInput.focus();
                setCursor(prevInput, prevBlock.content.length);
              }
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

  const handlePasteMultiLine = (id: string, newLines: string[], isCode = false) => {
    setBlocks(prevBlocks => {
      const index = prevBlocks.findIndex(b => b.id === id);
      if (index === -1) return prevBlocks;

      const updatedBlocks = [...prevBlocks];
      const currentBlock = updatedBlocks[index];

      if (isCode) {
        const codeContent = newLines.join('\n');
        const newBlock = { id: generateId(), type: 'code', content: codeContent };

        if (currentBlock.content === '') {
          updatedBlocks[index] = newBlock;
        } else {
          updatedBlocks.splice(index + 1, 0, newBlock);
        }

        setTimeout(() => {
          inputRefs.current.get(newBlock.id)?.focus();
        }, 0);

        return updatedBlocks;
      }

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

  const calculateWordCount = () => {
    const titleText = title || '';
    const blocksText = blocks.map(b => b.content).join(' ');
    const fullText = `${titleText} ${blocksText}`.trim();
    return fullText ? fullText.split(/\s+/).length : 0;
  };

  const wordCount = calculateWordCount();

  const handleRestore = async () => {
    if (!note || !session) return;
    try {
      await api.patch(`/notes/trash/${note.id}`);
      setNote(prev => prev ? { ...prev, is_deleted: false, deleted_at: null } : null);
    } catch (error) {
      console.error('Failed to restore note:', error);
    }
  };

  const handlePermanentDelete = async () => {
    if (!note || !session) return;
    try {
      await api.delete(`/notes/trash/${note.id}`);
      router.push('/');
    } catch (error) {
      console.error('Failed to permanently delete note:', error);
    }
  };

  const getMinutesSinceDeletion = () => {
    if (!note?.deleted_at) return 0;
    const deletedAt = new Date(note.deleted_at);
    const now = new Date();
    const diff = now.getTime() - deletedAt.getTime();
    const minutes = Math.floor(diff / 60000);
    return minutes > 0 ? minutes : 0;
  };

  useEffect(() => {
    if (title) {
      document.title = `${title}`;
    } else if (note) {
      document.title = `Nova página`;
    }
  }, [title, note]);

  const handleToggleFavorite = () => {
    if (!note) return;
    toggleFavorite(note);
    // Optimistically update local note state as well so the UI reflects it immediately if it depends on note state
    setNote(prev => prev ? { ...prev, is_favorite: !prev.is_favorite } : null);
  };

  const handleDeleteNote = async () => {
    if (!note || !session) return;

    try {
      await api.delete(`/notes/${note.id}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      removeNoteFromFavorites(note.id);
      setIsOptionsModalOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Erro ao excluir nota');
    }
  };

  // Helper for Sidebar logic in Loading/Error states
  const SidebarElement = () => (
    isSidebarOpen ? <Sidebar /> : null
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white dark:bg-[#191919]">
        <SidebarElement />
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header Skeleton */}
          <div className="h-12 flex items-center justify-between px-4 relative z-20">
            <div className="flex items-center gap-4">
              {!isSidebarOpen && <div className="w-8 h-8 bg-[#2f2f2f] rounded animate-pulse" />}
              <div className="flex items-center gap-2">
                <div className="h-4 w-32 bg-[#2f2f2f] rounded animate-pulse" />
                <div className="h-4 w-4 bg-[#2f2f2f] rounded animate-pulse" />
                <div className="h-4 w-24 bg-[#2f2f2f] rounded animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-28 bg-[#2f2f2f] rounded animate-pulse" />
              <div className="h-7 w-7 bg-[#2f2f2f] rounded animate-pulse" />
              <div className="h-7 w-7 bg-[#2f2f2f] rounded animate-pulse" />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#383836] border-t-white/80 rounded-full animate-spin" />
          </div>
        </main>
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
                className="relative group"
                onMouseEnter={() => {
                  if (window.innerWidth >= 768) {
                    setIsFloatingOpen(true);
                  }
                }}
                onMouseLeave={() => setIsFloatingOpen(false)}
              >
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded text-[#e6e5e3] transition-colors"
                >
                  <Menu size={22} className="md:group-hover:hidden" />
                  <ChevronsRight size={20} className="hidden md:group-hover:block" />
                </button>

                {/* Floating Sidebar */}
                {isFloatingOpen && (
                  <div className="absolute top-full left-0 mt-2 w-68 max-h-[80vh] shadow-xl rounded-lg overflow-hidden border border-[#2f2f2f] bg-[#202020] animate-in fade-in zoom-in-95 duration-100 origin-top-left">
                    <Sidebar isFloating={true} />
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2">
              {parentNote && (
                <>
                  <Link
                    href={`/${createNoteSlug(updatedTitles[parentNote.id] || parentNote.title, parentNote.id)}`}
                    className="text-sm text-[#ada9a3] hover:text-[#f0efed] truncate max-w-37.5 hover:bg-[#fffff315] px-2 py-1 rounded-md transition-colors"
                  >
                    {updatedTitles[parentNote.id] || parentNote.title || 'Nova página'}
                  </Link>
                  <ChevronRight size={14} className="text-[#7d7a75]" />
                </>
              )}

              <button
                className="text-base text-[#f0efed] font-normal truncate max-w-60 hover:bg-[#fffff315] px-2 py-1 rounded-md"
              >
                {title.trim() || 'Nova página'}
              </button>

              <div className="hidden md:flex relative group/particular">
                <button
                  className="flex items-center justify-center text-sm font-normal text-[#7d7a75] hover:text-[#f0efed] gap-2 hover:bg-[#202020] px-2 py-1 rounded-md"
                >
                  <LockKeyhole size={14} />
                  Particular
                  <ChevronDown size={14} />
                </button>
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover/particular:block bg-[#2f2f2f] text-[#f0efed] text-xs p-1 rounded-md shadow-xl whitespace-nowrap z-50 border border-[#3f3f3f]">
                  Somente você tem acesso <br />
                  <span className="text-gray-400">Clique para mover</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative group/share">
              <button
                onClick={() => setIsShareModalOpen(!isShareModalOpen)}
                className={`flex items-center justify-center md:gap-2 border border-[#383836] text-sm p-1.5 md:px-2 md:py-1 rounded-md transition-colors ${isShareModalOpen ? 'bg-[#fffff315]' : 'hover:bg-[#fffff315]'}`}
              >
                <Share size={18} className="md:hidden" />
                <LockKeyhole size={14} className="hidden md:inline" />
                <span className="hidden md:inline">Compartilhar</span>
                <ChevronDown size={14} className="hidden md:inline" />
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover/share:block bg-[#2f2f2f] text-[#f0efed] text-xs p-2 rounded-md shadow-xl whitespace-nowrap z-50 border border-[#3f3f3f]">
                Somente você pode acessar
              </div>

              {isShareModalOpen && <ShareModal onClose={() => setIsShareModalOpen(false)} />}
            </div>


            <div className="flex items-center gap-2">
              <div className="relative group/favorite">
                <button
                  onClick={handleToggleFavorite}
                  className={`p-1.5 hover:bg-gray-100 dark:hover:bg-[#fffff315] rounded-md transition-colors ${isFavorite ? 'text-[#ca984d]' : 'text-[#f0efed]'}`}
                >
                  <Star size={18} fill={isFavorite ? "currentColor" : "none"} />
                </button>

                <div className="absolute top-full right-[-28] mt-2 hidden group-hover/favorite:block bg-[#2f2f2f] text-[#f0efed] text-xs p-2 rounded-md shadow-xl whitespace-nowrap z-50 border border-[#3f3f3f]">
                  {isFavorite ? "Remover dos seus Favoritos" : "Adicionar aos seus favoritos"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative group/more">
                <button
                  onClick={() => setIsOptionsModalOpen(!isOptionsModalOpen)}
                  className={`p-1.5 text-[#f0efed] rounded-md transition-colors ${isOptionsModalOpen ? 'bg-[#fffff315]' : 'hover:bg-gray-100 dark:hover:bg-[#fffff315]'}`}
                >
                  <MoreHorizontal size={20} />
                </button>

                <div className="absolute top-full right-0 mt-2 hidden group-hover/more:block bg-[#2f2f2f] text-[#f0efed] text-xs p-2 rounded-md shadow-xl whitespace-nowrap z-50 border border-[#3f3f3f]">
                  Defina estilos, exporte e faça muito mais...
                </div>

                <PageOptionsModal
                  isOpen={isOptionsModalOpen}
                  onClose={() => setIsOptionsModalOpen(false)}
                  userName={session?.user?.displayName || session?.user?.displayName || session?.user?.email}
                  updatedAt={note?.updated_at || note?.updated_at}
                  wordCount={wordCount}
                  onDelete={handleDeleteNote}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Flash Message for Deleted Note */}
        {note?.is_deleted && (
          <div className="bg-[#eb5757] text-[#f0efed] hover:text-white px-4 py-2 flex items-center justify-center md:justify-between text-sm">
            <div className="hidden md:flex items-center gap-2">
              <span>
                {session?.user?.displayName || session?.user?.email} moveu esta página para a lixeira em {getMinutesSinceDeletion()} minutos atrás. Ela será excluída automaticamente em 30 dias.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleRestore}
                className="flex items-center border border-[#f0efed] hover:border-white px-2 py-1 rounded-md gap-2 font-medium"
              >
                <RotateCcw size={16} />
                Restaurar página
              </button>
              <button
                onClick={handlePermanentDelete}
                className="flex items-center border border-[#f0efed] hover:border-white px-2 py-1 rounded-md gap-2 font-medium"
              >
                <Trash2 size={16} />
                Excluir da lixeira
              </button>
            </div>
          </div>
        )}

        {/* Note Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div ref={containerRef} className="max-w-4xl mx-auto px-6 md:px-12 py-6 md:py-12">
            {/* Title Input */}
            <div className="group relative">
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity mb-2 h-10">
                <button className="flex items-center gap-2 p-2 rounded-md text-[#7d7a75] hover:bg-[#fffff315] hover:text-[#f0efed] transition-colors text-base leading-none font-normal">
                  <Smile size={16} />
                  Adicionar ícone
                </button>
                <button className="flex items-center gap-2 p-2 rounded-md text-[#7d7a75] hover:bg-[#fffff315] hover:text-[#f0efed] transition-colors text-base leading-none font-normal">
                  <ImageIcon size={16} />
                  Adicionar capa
                </button>
                <button className="flex items-center gap-2 p-2 rounded-md text-[#7d7a75] hover:bg-[#fffff315] hover:text-[#f0efed] transition-colors text-base leading-none font-normal">
                  <MessageSquareText size={16} />
                  Adicionar comentário
                </button>
              </div>
              <input
                ref={titleInputRef}
                type="text"
                value={title}
                onChange={handleTitleChange}
                onKeyDown={handleTitleKeyDown}
                onPaste={handleTitlePaste} // Add onPaste handler here
                onFocus={() => handleBlockFocus('title')}
                onBlur={handleBlockBlur}
                placeholder="Nova página"
                className="w-full text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6 bg-transparent border-none outline-none placeholder:text-gray-300 dark:placeholder:text-[#373737]"
              />
            </div>

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
                        childTitles={childTitles}
                        onChange={handleBlockChange}
                        onKeyDown={handleBlockKeyDown}
                        isSelected={selectedIds.has(block.id)}
                        onSelect={handleSelect}
                        inputRef={(el) => {
                          if (el) inputRefs.current.set(block.id, el);
                          else inputRefs.current.delete(block.id);
                        }}
                        onPasteMultiLine={handlePasteMultiLine}
                        listNumber={listNumber}
                        onFocus={() => handleBlockFocus(block.id)}
                        onBlur={handleBlockBlur}
                      />
                    );
                  })}
                </SortableContext>
              </DndContext>

              {/* Add block at bottom if empty list (though we initialize with one) or just click area */}
              <div
                className="h-20 cursor-text"
                onClick={() => {
                  if (selectedIds.size > 0) {
                    setSelectedIds(new Set());
                    return;
                  }
                  const newBlock = { id: generateId(), type: 'text', content: '' };
                  setBlocks(prev => [...prev, newBlock]);
                  setTimeout(() => inputRefs.current.get(newBlock.id)?.focus(), 0);
                }}
              />
            </div>
          </div>
        </div>
      </main>
      {!isMobile && <FloatingToolbar />}
      {isMobile && (
        <FloatingMobileToolbar
          isVisible={isToolbarVisible}
          position={toolbarPosition}
        />
      )}
      {selectionBox && (
        <div
          className="fixed border border-transparent bg-[#2383e233] pointer-events-none z-100"
          style={{
            left: Math.min(selectionBox.x1, selectionBox.x2),
            top: Math.min(selectionBox.y1, selectionBox.y2),
            width: Math.abs(selectionBox.x2 - selectionBox.x1),
            height: Math.abs(selectionBox.y2 - selectionBox.y1),
          }}
        />
      )}
    </div>
  );
}
