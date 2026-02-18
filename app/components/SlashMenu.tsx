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
  FileText,
  Code
} from 'lucide-react';

interface SlashMenuProps {
  leftOffset?: number;
  position?: { top: number; left: number };
  onSelect: (type: string) => void;
  onClose: () => void;
}

export const MENU_ITEMS = [
  { id: 'text', label: 'Texto', icon: <Type size={18} /> },
  { id: 'h1', label: 'Título 1', icon: <Heading1 size={18} /> },
  { id: 'h2', label: 'Título 2', icon: <Heading2 size={18} /> },
  { id: 'h3', label: 'Título 3', icon: <Heading3 size={18} /> },
  { id: 'bullet', label: 'Lista com marcadores', icon: <List size={18} /> },
  { id: 'number', label: 'Lista numerada', icon: <ListOrdered size={18} /> },
  { id: 'todo', label: 'Lista de tarefas', icon: <CheckSquare size={18} /> },
  { id: 'toggle', label: 'Lista de alternantes', icon: <ChevronRight size={18} /> },
  { id: 'code', label: 'Bloco de código', icon: <Code size={18} /> },
  { id: 'page', label: 'Página', icon: <FileText size={18} /> }
];

export function SlashMenu({ leftOffset, position, onSelect, onClose }: SlashMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [flipAbove, setFlipAbove] = React.useState(false);

  useEffect(() => {
    menuRef.current?.focus();

    // Check if there's enough space below; if not, flip above
    if (menuRef.current) {
      // Only flip if position is not explicitly set, as explicit position should take precedence
      if (!position) {
        const rect = menuRef.current.getBoundingClientRect();
        if (rect.bottom > window.innerHeight) {
          setFlipAbove(true);
        }
      }
    }

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % MENU_ITEMS.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onSelect(MENU_ITEMS[selectedIndex].id);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      ref={menuRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseDown={(e) => e.preventDefault()}
      style={
        position
          ? { top: position.top, left: position.left }
          : (leftOffset !== undefined ? { left: leftOffset } : undefined)
      }
      className={`absolute z-60 w-64 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#3f3f3f] rounded-lg shadow-xl overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-100 outline-none ${position ? '' : (leftOffset === undefined ? 'left-0 ' : '')
        }${flipAbove && !position ? 'bottom-full mb-3' : (position ? '' : 'top-full mt-3')
        }`}
    >

      <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">Blocos básicos</div>

      {MENU_ITEMS.map((item, index) => (

        <button

          key={item.id}

          onClick={() => onSelect(item.id)}

          onMouseEnter={() => setSelectedIndex(index)}

          className={`w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors ${index === selectedIndex

            ? 'bg-gray-100 dark:bg-[#3f3f3f]'

            : 'hover:bg-gray-100 dark:hover:bg-[#3f3f3f]'

            }`}

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
