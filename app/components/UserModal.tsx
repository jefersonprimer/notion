import React, { useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Ellipsis, LogOut, Settings, Users, Check, Plus } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
  onOpenSettings?: () => void;
} 

export default function UserModal({ isOpen, onClose, position, onOpenSettings }: UserModalProps) {
  const { session, signOut } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed z-50 bg-[#202020] border border-[#3f3f3f] rounded-lg shadow-xl text-[#9b9b9b] w-[320px] h-auto overflow-hidden pb-2"
      style={{ top: position.top, left: position.left }}
    >
      <div className='border-b border-[#3f3f3f] bg-[#252525]'>
        <div className="flex items-center p-3 gap-2 ">
          <div className="w-9 h-9 bg-[#2f2f2f] rounded flex items-center justify-center text-lg font-medium text-white shrink-0">
            P
          </div>

          <div className='flex flex-col min-w-0'>
            <div className="flex items-center text-base text-white font-medium truncate">
              Notion de {session?.user.displayName || 'Usuário'}
            </div>
            <div className="text-sm text-neutral-400">Conta Gratuita</div>
          </div>
        </div>

        <div className='flex items-center justify-center gap-2 px-3 mb-2'>
          <button
            onClick={() => {
              onOpenSettings?.();
              onClose();
            }}
            className="rounded-md border border-[#3f3f3f] px-2 py-1.5  hover:bg-[#2f2f2f] flex items-center gap-2 text-base transition-colors"
          >
            <Settings size={20} />
            <span>Configurações</span>
          </button>

          <button className="rounded-md border border-[#3f3f3f] px-2 py-1.5 hover:bg-[#2f2f2f] flex items-center gap-2 text-base transition-colors">
            <Users size={20} />
            <span>Membros</span>
          </button>
        </div>
      </div>

      <div className='my-1'>
        <div className='flex items-center justify-between px-4 py-1'>
          <span className="text-base truncate">{session?.user.email}</span>

          <button className='p-1 hover:bg-[#3f3f3f] rounded-md transition-colors'>
            <Ellipsis size={20} />
          </button>
        </div>

        <div className='flex items-center px-2 mx-1 py-2 hover:bg-[#3f3f3f] rounded-md transition-colors'>
          <div className="w-6 h-6 bg-[#2f2f2f] rounded flex items-center justify-center text-base font-medium text-neutral-400 shrink-0">
            P
          </div>

          <div className='flex items-center justify-between flex-1 px-2 text-white min-w-0'>
            <span className="text-base truncate">Notion de {session?.user.displayName}</span>
            <Check size={20} className="shrink-0" />
          </div>
        </div>

        <div className='px-2 mx-1 py-2 hover:bg-[#3f3f3f] rounded-md transition-colors'>
          <button className="flex items-center gap-2 text-blue-400 text-base w-full">
            <Plus size={20} />
            <span>Novo espaço de trabalho</span>
          </button>
        </div>
      </div>

      <div className='h-0.5 mx-3 border-b border-[#3f3f3f] transition-all duration-300' />

      <div className="flex flex-col mx-auto my-1">
        <button className="text-left px-2 mx-1 py-1.5 hover:bg-[#2f2f2f] rounded-md flex items-center gap-2 text-base transition-colors">
          Criar conta de trabalho
        </button>

        <button className="text-left px-2 mx-1 py-1.5 hover:bg-[#2f2f2f] rounded-md flex items-center gap-2 text-base transition-colors">
          Adicionar outra conta
        </button>

        <button
          onClick={() => {
            signOut();
            onClose();
          }}
          className="text-left px-2 mx-1 py-1.5 hover:bg-[#2f2f2f] rounded-md flex items-center gap-2 text-base transition-colors text-red-400 hover:text-red-300"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>

      <div className='h-0.5 mx-3 border-b border-[#3f3f3f] transition-all duration-300' />

      <div className="my-1">
        <div className="px-2 mx-1 py-1.5 hover:bg-[#2f2f2f] rounded-md flex items-center gap-2 text-base transition-colors">Obter App Mac</div>
      </div>
    </div>
  );
}
