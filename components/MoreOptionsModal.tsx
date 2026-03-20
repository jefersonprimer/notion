'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { FileText, Brain, Database, Component } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface MoreOptionsModalProps {
  open: boolean;
  onClose: () => void;
  position?: { top: number; left: number };
}

export default function MoreOptionsModal({ open, onClose, position }: MoreOptionsModalProps) {
  const t = useTranslations('MoreOptionsModal');
  const modalRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && !isMobile) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose, isMobile]);

  if (typeof document === 'undefined') return null;

  const style = position && !isMobile
    ? { top: position.top, left: position.left, position: 'fixed' as const }
    : {};

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Mobile Overlay */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 z-[9998] backdrop-blur-[2px]"
            />
          )}

          <motion.div 
            ref={modalRef}
            initial={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.95 }}
            animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1 }}
            exit={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            drag={isMobile ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
              }
            }}
            style={style}
            className={`z-[9999] bg-white border-gray-200 shadow-2xl flex flex-col text-gray-700 text-sm dark:bg-[#252525] dark:border-[#3f3f3f] dark:text-[#cfcfcf] ${
              isMobile 
                ? 'fixed inset-x-0 bottom-0 rounded-t-2xl border-t pb-8 p-4' 
                : 'fixed w-48 border rounded-md p-1 shadow-lg'
            }`}
          >
            {/* Mobile Handle */}
            {isMobile && (
              <div className="flex justify-center pb-4">
                <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-[#3f3f3f]" />
              </div>
            )}

            <button className="flex items-center gap-2 text-left px-2 py-1.5 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors w-full dark:hover:bg-[#3f3f3f] dark:hover:text-white">
              <FileText size={18}/>
              {t('items.page')}
            </button>
            <button className="flex items-center gap-2 text-left px-2 py-1.5 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors w-full dark:hover:bg-[#3f3f3f] dark:hover:text-white">
              <Brain size={18}/>
              {t('items.aiNotes')}
            </button>
            <button className="flex items-center gap-2 text-left px-2 py-1.5 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors w-full dark:hover:bg-[#3f3f3f] dark:hover:text-white">
              <Database size={18}/>
              {t('items.database')}
            </button>

            <div className="h-[1px] bg-gray-200 my-1 mx-2 dark:bg-[#3f3f3f]" />
            
            <button className="flex items-center gap-2 text-left px-2 py-1.5 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors w-full dark:hover:bg-[#3f3f3f] dark:hover:text-white">
              <Component size={18}/>
              {t('items.templates')}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
