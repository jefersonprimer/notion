'use client'

import {
  Link,
  Copy,
  Clipboard,
  ArrowRight,
  Trash2,
  Text,
  Maximize2,
  SlidersHorizontal,
  Lock,
  Pencil,
  Languages,
  Undo2,
  Download,
  Upload,
  Repeat,
  Clock,
  Bell,
  GitBranch,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { formatRelativeDate } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

interface PageOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  updatedAt?: string;
  wordCount: number;
}

export default function PageOptionsModal({ isOpen, onClose, userName, updatedAt, wordCount }: PageOptionsModalProps) {
  const [smallText, setSmallText] = useState(false)
  const [fullWidth, setFullWidth] = useState(false)
  const [lockPage, setLockPage] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const formattedDate = updatedAt 
    ? formatRelativeDate(new Date(updatedAt))
    : '';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && !isMobile) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, isMobile]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
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
            className={`fixed z-[9999] bg-[#1f1f1f] border-[#2f2f2f] shadow-2xl text-base text-[#d4d4d4] overflow-hidden ${
              isMobile 
                ? 'inset-x-0 bottom-0 rounded-t-2xl border-t' 
                : 'right-[20px] top-[50px] w-80 rounded-xl border'
            }`}
          >
            {/* Mobile Handle */}
            {isMobile && (
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-[#3f3f3f]" />
              </div>
            )}

            {/* Search */}
            <div className="p-3 border-b border-[#2a2a2a]">
              <input
                placeholder="Search actions..."
                className="w-full rounded-md bg-[#2a2a2a] px-3 py-2 text-base placeholder:text-[#8a8a8a] outline-none focus:ring-1 focus:ring-[#3a3a3a]"
              />
            </div>

            <div className={`${isMobile ? 'max-h-[70vh]' : 'max-h-[500px]'} overflow-y-auto`}>

              {/* Font Options */}
              <div className="flex justify-between px-4 py-3 border-b border-[#2a2a2a]">
                <FontOption label="Default" active />
                <FontOption label="Serif" />
                <FontOption label="Mono" />
              </div>

              <MenuItem icon={<Link size={20} />} label="Copy link" shortcut={!isMobile ? "Ctrl+Alt+L" : undefined} />
              <MenuItem icon={<Clipboard size={20} />} label="Copy page contents" />
              <MenuItem icon={<Copy size={20} />} label="Duplicate" shortcut={!isMobile ? "Ctrl+D" : undefined} />
              <MenuItem icon={<ArrowRight size={20} />} label="Move to" shortcut={!isMobile ? "Ctrl+Shift+P" : undefined} />
              <MenuItem icon={<Trash2 size={20} />} label="Move to Trash" />

              <Divider />

              <ToggleItem
                icon={<Text size={20} />}
                label="Small text"
                checked={smallText}
                onChange={() => setSmallText(!smallText)}
              />

              <ToggleItem
                icon={<Maximize2 size={20} />}
                label="Full width"
                checked={fullWidth}
                onChange={() => setFullWidth(!fullWidth)}
              />

              <MenuItem icon={<SlidersHorizontal size={20} />} label="Customize page" />

              <ToggleItem
                icon={<Lock size={20} />}
                label="Lock page"
                checked={lockPage}
                onChange={() => setLockPage(!lockPage)}
              />

              <MenuItem icon={<Pencil size={20} />} label="Suggest edits" />
              <MenuItem icon={<Languages size={20} />} label="Translate" hasArrow />
              <MenuItem icon={<Undo2 size={20} />} label="Undo" shortcut={!isMobile ? "Ctrl+Z" : undefined} />

              <Divider />

              <MenuItem icon={<Download size={20} />} label="Import" />
              <MenuItem icon={<Upload size={20} />} label="Export" />
              <MenuItem icon={<Repeat size={20} />} label="Turn into wiki" />

              <Divider />

              <MenuItem icon={<Clock size={20} />} label="Updates & analytics" />
              <MenuItem icon={<Clock size={20} />} label="Version history" />
              <MenuItem icon={<Bell size={20} />} label="Notify me" shortcut={!isMobile ? "Mentions" : undefined} hasArrow />
              <MenuItem icon={<GitBranch size={20} />} label="Connections" shortcut={!isMobile ? "None" : undefined} hasArrow />

              <div className="px-4 py-3 text-xs text-[#7a7a7a] border-t border-[#2a2a2a] space-y-1 pb-8">
                <p>Contagem de palavras: {wordCount}</p>
                <div className="mt-1">
                  Última edição por {userName || 'Usuário'} <br />
                  {formattedDate}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ---------------- Components ---------------- */

function MenuItem({
  icon,
  label,
  shortcut,
  hasArrow,
}: {
  icon: React.ReactNode
  label: string
  shortcut?: string
  hasArrow?: boolean
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-[#bdbdbd] flex items-center justify-center w-5 h-5">{icon}</span>
        <span className="leading-none">{label}</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-[#8a8a8a]">
        {shortcut && <span className="leading-none">{shortcut}</span>}
        {hasArrow && <span className="leading-none text-lg">›</span>}
      </div>
    </div>
  )
}

function ToggleItem({
  icon,
  label,
  checked,
  onChange,
}: {
  icon: React.ReactNode
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-[#bdbdbd] flex items-center justify-center w-5 h-5">{icon}</span>
        <span className="leading-none">{label}</span>
      </div>

      <button
        onClick={onChange}
        className={`relative h-5 w-9 rounded-full transition-colors ${
          checked ? 'bg-blue-500' : 'bg-[#3a3a3a]'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}

function Divider() {
  return <div className="my-1 h-px bg-[#2a2a2a]" />
}

function FontOption({ label, active }: { label: string; active?: boolean }) {
  return (
    <div className="flex flex-col items-center cursor-pointer group">
      <span
        className={`text-lg ${
          active ? 'text-blue-400' : 'text-[#d4d4d4]'
        }`}
      >
        Ag
      </span>
      <span className="text-xs text-[#8a8a8a] group-hover:text-[#d4d4d4]">
        {label}
      </span>
    </div>
  )
}

