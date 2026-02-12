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

import { useState } from 'react'

export default function PageOptionsModal() {
  const [smallText, setSmallText] = useState(false)
  const [fullWidth, setFullWidth] = useState(false)
  const [lockPage, setLockPage] = useState(false)

  return (
    <div className="absolute right-0 top-8 z-50 w-72 rounded-xl border border-[#2f2f2f] bg-[#1f1f1f] shadow-2xl text-sm text-[#d4d4d4] overflow-hidden">
      {/* Search */}
      <div className="p-3 border-b border-[#2a2a2a]">
        <input
          placeholder="Search actions..."
          className="w-full rounded-md bg-[#2a2a2a] px-3 py-2 text-sm placeholder:text-[#8a8a8a] outline-none focus:ring-1 focus:ring-[#3a3a3a]"
        />
      </div>

      <div className="max-h-[500px] overflow-y-auto">

        {/* Font Options */}
        <div className="flex justify-between px-4 py-3 border-b border-[#2a2a2a]">
          <FontOption label="Default" active />
          <FontOption label="Serif" />
          <FontOption label="Mono" />
        </div>

        <MenuItem icon={<Link size={16} />} label="Copy link" shortcut="Ctrl+Alt+L" />
        <MenuItem icon={<Clipboard size={16} />} label="Copy page contents" />
        <MenuItem icon={<Copy size={16} />} label="Duplicate" shortcut="Ctrl+D" />
        <MenuItem icon={<ArrowRight size={16} />} label="Move to" shortcut="Ctrl+Shift+P" />
        <MenuItem icon={<Trash2 size={16} />} label="Move to Trash" />

        <Divider />

        <ToggleItem
          icon={<Text size={16} />}
          label="Small text"
          checked={smallText}
          onChange={() => setSmallText(!smallText)}
        />

        <ToggleItem
          icon={<Maximize2 size={16} />}
          label="Full width"
          checked={fullWidth}
          onChange={() => setFullWidth(!fullWidth)}
        />

        <MenuItem icon={<SlidersHorizontal size={16} />} label="Customize page" />

        <ToggleItem
          icon={<Lock size={16} />}
          label="Lock page"
          checked={lockPage}
          onChange={() => setLockPage(!lockPage)}
        />

        <MenuItem icon={<Pencil size={16} />} label="Suggest edits" />
        <MenuItem icon={<Languages size={16} />} label="Translate" hasArrow />
        <MenuItem icon={<Undo2 size={16} />} label="Undo" shortcut="Ctrl+Z" />

        <Divider />

        <MenuItem icon={<Download size={16} />} label="Import" />
        <MenuItem icon={<Upload size={16} />} label="Export" />
        <MenuItem icon={<Repeat size={16} />} label="Turn into wiki" />

        <Divider />

        <MenuItem icon={<Clock size={16} />} label="Updates & analytics" />
        <MenuItem icon={<Clock size={16} />} label="Version history" />
        <MenuItem icon={<Bell size={16} />} label="Notify me" shortcut="Mentions" hasArrow />
        <MenuItem icon={<GitBranch size={16} />} label="Connections" shortcut="None" hasArrow />

        <div className="px-4 py-3 text-xs text-[#7a7a7a] border-t border-[#2a2a2a] space-y-1">
          <p>Word count: 60 words</p>
          <p>Last edited by Jeferson Primer</p>
          <p>Yesterday at 7:43 AM</p>
        </div>
      </div>
    </div>
  )
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
    <div className="flex items-center justify-between px-4 py-2.5 hover:bg-[#2a2a2a] cursor-pointer transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-[#bdbdbd]">{icon}</span>
        <span>{label}</span>
      </div>

      <div className="flex items-center gap-2 text-xs text-[#8a8a8a]">
        {shortcut && <span>{shortcut}</span>}
        {hasArrow && <span>›</span>}
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
    <div className="flex items-center justify-between px-4 py-2.5 hover:bg-[#2a2a2a] cursor-pointer transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-[#bdbdbd]">{icon}</span>
        <span>{label}</span>
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
