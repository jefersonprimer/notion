import React, { useEffect, useRef } from 'react';
import { FileText, Brain, Database, Component } from 'lucide-react';

interface MoreOptionsModalProps {
  open: boolean;
  onClose: () => void;
  position?: { top: number; left: number };
}

export default function MoreOptionsModal({ open, onClose, position }: MoreOptionsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  const style = position
    ? { top: position.top, left: position.left, position: 'fixed' as const }
    : {};

  return (
    <div 
      ref={modalRef}
      style={style}
      className="z-50 w-48 bg-[#252525] border border-[#3f3f3f] rounded-md shadow-lg p-1 flex flex-col text-[#9b9b9b] text-base"
    >
      <button className="flex items-center gap-2 text-left px-2 py-1.5 rounded-md hover:bg-[#3f3f3f] hover:text-white transition-colors w-full">
        <FileText size={20}/>
        Pagina
      </button>
      <button className="flex items-center gap-2 text-left px-2 py-1.5 rounded-md hover:bg-[#3f3f3f] hover:text-white transition-colors w-full">
        <Brain size={20}/>
        Anotacoes IA
      </button>
      <button className="flex items-center gap-2 text-left px-2 py-1.5 rounded-md hover:bg-[#3f3f3f] hover:text-white transition-colors w-full">
        <Database size={20}/>
        Base de dados
      </button>

      <div className="h-[1px] bg-[#3f3f3f] my-1 mx-2" />
      
      <button className="flex items-center gap-2 text-left px-2 py-1.5 rounded-md hover:bg-[#3f3f3f] hover:text-white transition-colors w-full">
        <Component size={20}/>
        Modelos
      </button>
    </div>
  );
}
