"use client";

import React, { useEffect, useRef } from 'react';
import { 
  Type, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  CheckSquare, 
  ChevronRight,
  FileText
} from 'lucide-react';

interface SlashMenuProps {
  position: { top: number; left: number };
  onSelect: (type: string) => void;
  onClose: () => void;
}

const MENU_ITEMS = [
  { id: 'text', label: 'Texto', icon: <Type size={18} /> },
  { id: 'page', label: 'Página', icon: <FileText size={18} /> },
  { id: 'h1', label: 'Título 1', icon: <Heading1 size={18} /> },
  { id: 'h2', label: 'Título 2', icon: <Heading2 size={18} /> },
  { id: 'h3', label: 'Título 3', icon: <Heading3 size={18} /> },
  { id: 'bullet', label: 'Lista com marcadores', icon: <List size={18} /> },
  { id: 'number', label: 'Lista numerada', icon: <ListOrdered size={18} /> },
  { id: 'todo', label: 'Lista de tarefas', icon: <CheckSquare size={18} /> },
  { id: 'toggle', label: 'Lista de alternantes', icon: <ChevronRight size={18} /> },
];

export function SlashMenu({ position, onSelect, onClose }: SlashMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div 
      ref={menuRef}
      className="absolute z-50 w-64 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#3f3f3f] rounded-lg shadow-xl overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-100"
      style={{ top: position.top, left: position.left }}
    >
      <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">Blocos básicos</div>
      {MENU_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-[#3f3f3f] text-left transition-colors"
        >
          <div className="w-6 h-6 border border-gray-200 dark:border-[#3f3f3f] rounded flex items-center justify-center bg-white dark:bg-[#2f2f2f] text-gray-600 dark:text-gray-300">
            {item.icon}
          </div>
          <div className="flex flex-col">
             <span className="text-sm text-gray-700 dark:text-gray-200">{item.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
