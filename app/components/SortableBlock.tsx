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
  inputRef?: (el: HTMLInputElement | null) => void;
}

export function SortableBlock({ id, type, content, onChange, onKeyDown, inputRef }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const [showMenu, setShowMenu] = useState(false);
  const localInputRef = useRef<HTMLInputElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
    position: 'relative' as 'relative',
    opacity: isDragging ? 0.5 : 1,
  };

  const setRefs = (el: HTMLInputElement | null) => {
      localInputRef.current = el;
      if (inputRef) inputRef(el);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    if (val === '/') {
      setShowMenu(true);
    } else if (showMenu && !val.includes('/')) {
      setShowMenu(false); 
    }
    
    onChange(id, val);
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
      case 'h1': return 'h-[2.25rem]';
      case 'h2': return 'h-[2rem]';
      case 'h3': return 'h-[1.75rem]';
      default: return 'h-[1.5rem]';
    }
  };

  const isTodo = type === 'todo' || type === 'todo_checked';
  const isChecked = type === 'todo_checked';

  const toggleTodo = () => {
    onChange(id, content, isChecked ? 'todo' : 'todo_checked');
  };

  const lineHeight = getLineHeight();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-start -ml-12 pl-2 py-1 relative rounded transition-colors hover:bg-gray-50 dark:hover:bg-white/5 ${getContainerMargins()}`}
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
        {type === 'number' && <span className="mr-2 text-gray-500">1.</span>}
      </div>

      {/* Content Input */}
      <div className="flex-1 relative">
        <input
            ref={setRefs}
            className={`w-full bg-transparent border-none outline-none text-gray-800 dark:text-gray-300 resize-none ${getStyles()}`}
            value={content}
            onChange={handleChange}
            onKeyDown={(e) => onKeyDown(e, id)}
            placeholder={type === 'text' ? "Digite '/' para comandos" : ""}
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