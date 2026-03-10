import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import { Ellipsis, Settings, Users, Check, Plus } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
  onOpenSettings?: () => void;
} 

export default function UserModal({ isOpen, onClose, position, onOpenSettings }: UserModalProps) {
  const t = useTranslations('UserModal');
  const { session, signOut } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isSignOutConfirmOpen, setIsSignOutConfirmOpen] = useState(false);
  const userName = session?.user?.name?.trim() || t('user.fallbackName');
  const avatarInitial = (userName.trim().charAt(0) || 'N').toUpperCase();

  const handleClose = useCallback(() => {
    setIsSignOutConfirmOpen(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    }

    if (isOpen && !isSignOutConfirmOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isSignOutConfirmOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed z-50 bg-[#202020] border border-[#3f3f3f] rounded-lg shadow-xl text-[#9b9b9b] w-[320px] h-auto overflow-hidden pb-2"
      style={{ top: position.top, left: position.left }}
    >
      <div className='border-b border-[#3f3f3f] bg-[#252525]'>
        <div className="flex items-center p-3 gap-2 ">
          <div className="w-9 h-9 bg-[#2f2f2f] rounded flex items-center justify-center text-2xl font-medium text-[#ada9a3] shrink-0 leading-none uppercase">
            {avatarInitial}
          </div>

          <div className='flex flex-col min-w-0'>
            <div className="flex items-center text-sm text-[#f0efed] font-medium truncate">
              {t('workspaceTitle', { name: userName })}
            </div>
            <div className="text-xs text-[#ada9a3]">{t('freeAccount')}</div>
          </div>
        </div>

        <div className='flex items-left gap-2 px-3 mb-2'>
          <button
            onClick={() => {
              onOpenSettings?.();
              handleClose();
            }}
            className="rounded-md border border-[#3f3f3f] px-2 py-1  hover:bg-[#2f2f2f] flex items-center gap-2 text-xs font-medium transition-colors"
          >
            <Settings size={16} />
            <span>{t('actions.settings')}</span>
          </button>

          <button className="rounded-md border border-[#3f3f3f] px-2 py-1 hover:bg-[#2f2f2f] flex items-center gap-2 text-xs font-medium transition-colors">
            <Users size={16} />
            <span>{t('actions.inviteMembers')}</span>
          </button>
        </div>
      </div>

      <div className='my-1'>
        <div className='flex items-center justify-between px-4 py-1'>
          <span className="text-xs font-medium text-[#ada9a3] truncate">{session?.user.email}</span>

          <button className='p-1 hover:bg-[#3f3f3f] rounded-md transition-colors'>
            <Ellipsis size={16} />
          </button>
        </div>

        <div className='flex items-center px-2 mx-1 py-1.5 hover:bg-[#3f3f3f] rounded-md transition-colors'>
          <div className="w-6 h-6 bg-[#2f2f2f] rounded flex items-center justify-center text-base font-medium text-neutral-400 shrink-0 leading-none uppercase">
            {avatarInitial}
          </div>

          <div className='flex items-center justify-between flex-1 px-2 text-white min-w-0'>
            <span className="text-sm truncate">{t('workspaceTitle', { name: userName })}</span>
            <Check size={16} className="shrink-0" />
          </div>
        </div>

        <div className='px-2 mx-1 py-1.5 hover:bg-[#3f3f3f] rounded-md transition-colors'>
          <button className="flex items-center gap-2 text-blue-400 text-sm w-full">
            <Plus size={16} />
            <span>{t('actions.newWorkspace')}</span>
          </button>
        </div>
      </div>

      <div className='h-0.5 mx-3 border-b border-[#3f3f3f] transition-all duration-300' />

      <div className="flex flex-col mx-auto my-1">
        <button className="text-left px-2 mx-1 py-1 hover:bg-[#2f2f2f] rounded-md flex items-center gap-2 text-sm transition-colors">
          {t('actions.createWorkAccount')}
        </button>

        <button className="text-left px-2 mx-1 py-1 hover:bg-[#2f2f2f] rounded-md flex items-center gap-2 text-sm transition-colors">
          {t('actions.addAnotherAccount')}
        </button>

        <button
          onClick={() => {
            setIsSignOutConfirmOpen(true);
          }}
          className="text-left px-2 mx-1 py-1 hover:bg-[#2f2f2f] rounded-md flex items-center gap-2 text-sm transition-colors text-red-400 hover:text-red-300"
        >
          {t('actions.signOut')}
        </button>
      </div>

      <div className='h-0.5 mx-3 my-1 border-b border-[#3f3f3f] transition-all duration-300' />

        <div className="px-2 mx-1 py-1 hover:bg-[#2f2f2f] rounded-md flex items-center gap-2 text-sm transition-colors">{t('actions.getMacApp')}
        </div>
        
        <a 
          href="https://github.com/jefersonprimer/nolio/releases/latest/download/nolio.apk"
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 mx-1 py-1 hover:bg-[#2f2f2f] rounded-md flex items-center gap-2 text-sm transition-colors"
        >
          {t('actions.downloadAndroid')}
        </a>

      {isSignOutConfirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-80 text-center rounded-xl border border-[#3f3f3f] bg-[#202020] p-5 text-[#f0efed] shadow-2xl">
            <h3 className="text-lg font-semibold">{t('signOutConfirm.title')}</h3>
            <p className="mt-2 text-sm text-[#ada9a3]">
              {t('signOutConfirm.description')}
            </p>

            <div className="mt-5 flex flex-col gap-2">
              <button
                onClick={() => {
                  signOut();
                  setIsSignOutConfirmOpen(false);
                  handleClose();
                }}
                className="w-full rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
              >
                {t('signOutConfirm.confirmButton')}
              </button>
              <button
                onClick={() => setIsSignOutConfirmOpen(false)}
                className="w-full rounded-md border border-[#3f3f3f] px-3 py-2 text-sm font-medium text-[#f0efed] transition-colors hover:bg-[#2a2a2a]"
              >
                {t('signOutConfirm.cancelButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
