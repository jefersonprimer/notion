"use client";

import React, { useEffect, useRef } from 'react';
import { AtSign, Link as LinkIcon, Bookmark, Image as ImageIcon } from 'lucide-react';

interface ImagePasteModalProps {
  onClose: () => void;
  onSelect: (option: 'mention' | 'url' | 'bookmark' | 'embed') => void;
  position: { top: number; left: number };
}

export default function ImagePasteModal({ onClose, onSelect, position }: ImagePasteModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const options = [
    { id: 'mention', label: 'Menção', icon: <AtSign size={16} /> },
    { id: 'url', label: 'URL', icon: <LinkIcon size={16} /> },
    { id: 'bookmark', label: 'Criar marcador', icon: <Bookmark size={16} /> },
    { id: 'embed', label: 'Incorporar', icon: <ImageIcon size={16} /> },
  ] as const;

  return (
    <div
      ref={modalRef}
      className="fixed z-[200] w-64 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#3f3f3f] rounded-lg shadow-xl py-1.5 animate-in fade-in zoom-in-95 duration-100"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => {
            onSelect(option.id);
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f3f3f] transition-colors text-left"
        >
          <span className="text-gray-400 dark:text-gray-500">{option.icon}</span>
          {option.label}
        </button>
      ))}
    </div>
  );
}
