'use client'

import { useState, useRef, useEffect } from 'react'
import { Lock, Link2, ChevronDown } from 'lucide-react'
import Toast from './Toast'

interface ShareModalProps {
  onClose: () => void;
}

export default function ShareModal({ onClose }: ShareModalProps) {
  const [activeTab, setActiveTab] = useState<'share' | 'publish'>('share')
  const [email, setEmail] = useState('')
  const [showToast, setShowToast] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setShowToast(true);
  };

  return (
    <>
      <div 
        ref={modalRef}
        className="absolute right-0 top-[calc(100%+8px)] z-50 w-[420px] rounded-2xl border border-[#2f2f2f] bg-[#1f1f1f] shadow-2xl text-sm text-[#d4d4d4] overflow-hidden"
      >
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
        <div className="p-6 space-y-5">
          
          {/* Invite Input */}
          <div className="flex gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or group, separated by commas"
              className="flex-1 rounded-lg bg-[#1f1f1f] border border-[#3a3a3a] px-3 py-2.5 text-sm placeholder:text-[#8a8a8a] outline-none focus:border-[#4c8bf5] focus:ring-1 focus:ring-[#4c8bf5]"
            />

            <button className="rounded-lg bg-[#4c8bf5] hover:bg-[#3f7ae0] px-4 font-medium text-white transition-colors">
              Invite
            </button>
          </div>

          {/* User Row */}
          <div className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-[#2a2a2a] transition-colors">
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

            <div className="flex items-center justify-between rounded-xl bg-[#2a2a2a] px-4 py-3 cursor-pointer hover:bg-[#333] transition-colors">
              <div className="flex items-center gap-3">
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
            <button className="text-[#8a8a8a] hover:text-[#d4d4d4] transition-colors">
              Learn about sharing
            </button>

            <button 
              onClick={handleCopyLink}
              className="flex items-center gap-2 rounded-lg border border-[#3a3a3a] bg-[#262626] hover:bg-[#2f2f2f] px-3 py-2 transition-colors"
            >
              <Link2 size={16} />
              Copy link
            </button>
          </div>
        </div>
      </div>
      {showToast && (
        <Toast 
          message="Link copiado para o clipboard" 
          onClose={() => setShowToast(false)} 
        />
      )}
    </>
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
