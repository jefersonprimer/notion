'use client'

import { useState, useRef, useEffect } from 'react'
import { Lock, Link2, ChevronDown, HelpCircle } from 'lucide-react'
import Toast from './Toast'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  buttonPosition?: { top: number; left: number } | null;
}

export default function ShareModal({ isOpen, onClose, buttonPosition }: ShareModalProps) {
  const [activeTab, setActiveTab] = useState<'share' | 'publish'>('share')
  const [email, setEmail] = useState('')
  const [showToast, setShowToast] = useState(false)
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

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, isMobile]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setShowToast(true);
  };

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
              className="fixed inset-0 bg-black/60 z-9998 backdrop-blur-[2px]"
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
            style={!isMobile && buttonPosition ? { 
              position: 'fixed', 
              left: buttonPosition.left - 80, 
              top: buttonPosition.top + 10 
            } : undefined}
            className={`${
              isMobile 
                ? 'fixed inset-x-0 bottom-0 rounded-t-2xl border-t border-[#2f2f2f]' 
                : 'fixed left-1/2 -translate-x-1/2 top-20 rounded-2xl border border-[#2f2f2f] w-114'
            } z-9999 bg-[#1f1f1f] shadow-2xl text-sm text-[#d4d4d4] overflow-hidden`}
          >
            {/* Mobile Handle */}
            {isMobile && (
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-[#3f3f3f]" />
              </div>
            )}

            {/* Tabs */}
            <div className="flex px-6 pt-4 border-b border-[#2a2a2a]">
              <Tab
                label="Share"
                active={activeTab === 'share'}
                onClick={() => setActiveTab('share')}
              />
              <Tab
                label="Publish"
                active={activeTab === 'publish'}
                onClick={() => setActiveTab('publish')}
              />
            </div>

            {/* Content */}
            <div className={`p-3 space-y-2 ${isMobile ? 'max-h-[70vh]' : ''} overflow-y-auto`}>
              
              {/* Invite Input */}
              <div className="flex gap-2">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email or group, separated by commas"
                  className="flex-1 rounded-lg bg-[#1f1f1f] border border-[#3a3a3a] px-3 py-2 text-sm placeholder:text-[#8a8a8a] outline-none focus:border-[#4c8bf5] focus:ring-1 focus:ring-[#4c8bf5]"
                />

                <button className="rounded-md bg-[#4c8bf5] hover:bg-[#3f7ae0] px-2 font-medium text-white transition-colors">
                  Invite
                </button>
              </div>

              {/* User Row */}
              <div className="flex items-center justify-between rounded-xl p-2 hover:bg-[#2a2a2a] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#333] text-sm text-[#cfcfcf]">
                    J
                  </div>

                  <div>
                    <p className="text-[#e4e4e4]">
                      Jeferson Primer <span className="text-[#8a8a8a]">(You)</span>
                    </p>
                    <p className="text-xs text-[#8a8a8a]">
                      jefersonprimer@gmail.com
                    </p>
                  </div>
                </div>

                <button className="text-[#bdbdbd] hover:text-white transition-colors flex items-center gap-1">
                  Full access <ChevronDown size={14} />
                </button>
              </div>

              {/* General Access */}
              <div className="space-y-2">
                <p className="text-xs text-[#8a8a8a]">General access</p>

                <div className="flex items-center justify-between py-2 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#333]">
                      <Lock size={16} className="text-[#bdbdbd]" />
                    </div>

                    <span>Only people invited</span>
                  </div>

                  <ChevronDown size={14} className="text-[#bdbdbd]" />
                </div>
              </div>

              {/* Bottom */}
              <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
                <button className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-[#8a8a8a] hover:text-[#d4d4d4] hover:bg-[#fffff315] transition-colors">
                  <HelpCircle size={16}/>
                  Learn about sharing
                </button>

                <button 
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 text-sm text-[#f0efed] font-medium rounded-md border border-[#ffffeb1a] hover:bg-[#fffff315] bg-[#191919] px-2 py-1.5 transition-colors"
                >
                  <Link2 size={16} />
                  Copy link
                </button>
              </div>
            </div>
          </motion.div>
          {showToast && (
            <Toast 
              message="Link copiado para o clipboard" 
              onClose={() => setShowToast(false)} 
            />
          )}
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

/* ---------------- Tab Component ---------------- */

function Tab({
  label,
  active,
  onClick,
}: {
  label: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`relative pb-3 mr-6 transition-colors ${
        active
          ? 'text-white'
          : 'text-[#8a8a8a] hover:text-[#d4d4d4]'
      }`}
    >
      {label}

      {active && (
        <span className="absolute bottom-0 left-0 h-[2px] w-full bg-white rounded-full" />
      )}
    </button>
  )
}
