"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Square, CheckSquare } from 'lucide-react';
import { SlashMenu } from './SlashMenu';

interface SortableBlockProps {
  id: string;
  type: string;
  content: string;
  onChange: (id: string, newContent: string, newType?: string) => void;
  onKeyDown: (e: React.KeyboardEvent, id: string) => void;
  inputRef?: (el: HTMLDivElement | null) => void; // Changed from HTMLInputElement
  onPasteMultiLine?: (id: string, newLines: string[]) => void;
  listNumber?: number; // New prop for numbered lists
}

const PREFIXES: Record<string, string> = {
  h1: '# ',
  h2: '## ',
  h3: '### ',
  bullet: '- ',
  number: '1. ',
  todo: '[] ',
  todo_checked: '[x] ', // todo_checked should not trigger auto-format on typing
  toggle: '> ',
};

export function SortableBlock({ id, type, content, onChange, onKeyDown, inputRef, onPasteMultiLine, listNumber }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const [showMenu, setShowMenu] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false); // New state for input focus
  const localInputRef = useRef<HTMLDivElement>(null); // Changed to HTMLDivElement

  // Effect to update the contentEditable div's innerText when content prop changes
  useEffect(() => {
    if (localInputRef.current && localInputRef.current.innerText !== content) {
      localInputRef.current.innerText = content;
    }
  }, [content]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
    position: 'relative' as 'relative',
    opacity: isDragging ? 0.5 : 1,
  };

  const setRefs = (el: HTMLDivElement | null) => { // Changed to HTMLDivElement
      localInputRef.current = el;
      if (inputRef) inputRef(el);
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const val = (e.target as HTMLDivElement).innerText;
    
    // Check for auto-formatting
    if (type === 'text' && val.endsWith(' ')) {
        for (const [key, prefix] of Object.entries(PREFIXES)) {
            if (key !== 'todo_checked' && val.startsWith(prefix)) { // Exclude todo_checked from auto-format trigger
                // Instead of clearing content, we update content to remove the prefix
                // and then trigger a type change
                onChange(id, val.slice(prefix.length), key); 
                // Manual focus is needed after type change if content is modified
                // setTimeout(() => localInputRef.current?.focus(), 0);
                return; // Stop after first match
            }
        }
    }

    if (val === '/') {
      setShowMenu(true);
    } else if (showMenu && !val.includes('/')) {
      setShowMenu(false); 
    }
    
    onChange(id, val);
  };

  const handleFocus = () => setIsInputFocused(true);
  const handleBlur = () => {
    setIsInputFocused(false);
    // When blurring, ensure content is clean (e.g., no extra newlines from contentEditable)
    if (localInputRef.current) {
        onChange(id, localInputRef.current.innerText.trim());
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => { // Changed to HTMLDivElement
    e.preventDefault(); // Prevent default paste behavior
    const text = e.clipboardData.getData('text/plain'); // Get plain text from clipboard
    const lines = text.split('\n');

    if (lines.length > 1 && onPasteMultiLine) {
        // If multi-line, use the multi-line handler
        onPasteMultiLine(id, lines);
    } else {
        // If single line, insert text at cursor position
        document.execCommand('insertText', false, text);
        // And then call onChange to update the block content
        if (localInputRef.current) {
            onChange(id, localInputRef.current.innerText);
        }
    }
  };

  const handleMenuSelect = (newType: string) => {
    // When selecting from menu, we clear the content (remove '/') and set the new type
    onChange(id, '', newType);
    setShowMenu(false);
    // Use timeout to ensure state update before focusing
    setTimeout(() => localInputRef.current?.focus(), 10);
  };

  const getStyles = () => {
    switch (type) {
      case 'h1': return 'text-3xl font-bold';
      case 'h2': return 'text-2xl font-bold';
      case 'h3': return 'text-xl font-bold';
      case 'toggle': return 'text-base italic border-l-2 border-gray-300 dark:border-gray-600 pl-4';
      case 'todo_checked': return 'text-base line-through text-gray-400';
      default: return 'text-base';
    }
  };

  const getContainerMargins = () => {
    switch (type) {
      case 'h1': return 'mt-6 mb-2';
      case 'h2': return 'mt-5 mb-2';
      case 'h3': return 'mt-4 mb-1';
      default: return '';
    }
  };

  const getLineHeight = () => {
    switch (type) {
      case 'h1': return 'min-h-[2.25rem]'; // Use min-h for contentEditable
      case 'h2': return 'min-h-[2rem]';
      case 'h3': return 'min-h-[1.75rem]';
      default: return 'min-h-[1.5rem]';
    }
  };

  const isTodo = type === 'todo' || type === 'todo_checked';
  const isChecked = type === 'todo_checked';

  const toggleTodo = () => {
    onChange(id, content, isChecked ? 'todo' : 'todo_checked');
  };

  const lineHeight = getLineHeight();

  const isVisuallyCollapsed = content === '' && !isInputFocused && type === 'text';

  const currentPlaceholder = (isInputFocused && content === '' && type === 'text') ? "Digite '/' para comandos" : "";

  const isContentEmptyAndUnfocused = content === '' && !isInputFocused && type === 'text';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-start -ml-12 pl-2 py-1 relative rounded transition-colors ${getContainerMargins()}`}
    >
      {/* Drag Handle & Add Button Container */}
      <div className={`absolute left-0 top-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity px-1 select-none z-10 ${lineHeight}`}>
         <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">
            <Plus size={16} />
         </button>
         <button 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
         >
            <GripVertical size={16} />
         </button>
      </div>

      {/* Prefix Indicators */}
      <div className={`flex items-center ml-10 shrink-0 select-none ${lineHeight}`}>
        {isTodo && (
          <button 
            onClick={toggleTodo}
            className="mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {isChecked ? <CheckSquare size={16} /> : <Square size={16} />}
          </button>
        )}
        {type === 'bullet' && <span className="mr-3 text-gray-500">•</span>}
        {type === 'number' && <span className="mr-2 text-gray-500">{listNumber}.</span>}
      </div>

      {/* Content Editable Div */}
      <div className="flex-1 relative">
        <div
            ref={setRefs}
            contentEditable="true"
            className={`w-full bg-transparent border-none outline-none text-gray-800 dark:text-gray-300 resize-none focus:outline-none ${getStyles()} ${isContentEmptyAndUnfocused ? 'py-0' : ''}`}
            onInput={handleInput}
            onKeyDown={(e) => onKeyDown(e, id)}
            onPaste={handlePaste}
            onFocus={handleFocus}
            onBlur={handleBlur}
            // Placeholder for contentEditable can be handled with CSS or by inserting a span
            data-placeholder={currentPlaceholder} 
            suppressContentEditableWarning={true} // To suppress React warning
        />
        
        {/* Slash Menu */}
        {showMenu && (
          <SlashMenu 
            position={{ top: type.startsWith('h') ? 40 : 32, left: 0 }} 
            onSelect={handleMenuSelect}
            onClose={() => setShowMenu(false)}
          />
        )}
      </div>
    </div>
  );
}