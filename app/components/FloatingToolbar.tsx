'use client'

import React, { useEffect, useState, useRef } from 'react'
import {
  CircleQuestionMark,
  Sparkles,
  MessageSquareText,
  SmilePlus,
  Edit3,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Sigma,
  Link2,
  Palette,
  MoreHorizontal,
  ChevronDown,
} from 'lucide-react'

type Position = {
  top: number
  left: number
}

const TOOLBAR_ITEMS = [
  { id: 'explain', icon: <CircleQuestionMark size={16} />, label: 'Explicar' },
  { id: 'ai', icon: <Sparkles size={16} />, label: 'Pedir à IA' },
  { type: 'divider' },
  { id: 'comment', icon: <MessageSquareText size={16} />, label: 'Comentário' },
  { id: 'reaction', icon: <SmilePlus size={16} /> },
  { id: 'edit', icon: <Edit3 size={16} /> },
  { type: 'divider' },
  { id: 'text', icon: <ChevronDown size={16} />, label: 'Text' },
  { id: 'bold', icon: <Bold size={16} /> },
  { id: 'italic', icon: <Italic size={16} /> },
  { id: 'underline', icon: <Underline size={16} /> },
  { id: 'strikethrough', icon: <Strikethrough size={16} /> },
  { type: 'divider' },
  { id: 'code', icon: <Code size={16} /> },
  { id: 'sigma', icon: <Sigma size={16} /> },
  { id: 'link', icon: <Link2 size={16} /> },
  { id: 'palette', icon: <Palette size={16} /> },
  { type: 'divider' },
  { id: 'more', icon: <MoreHorizontal size={16} /> },
]

export default function FloatingToolbar() {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>({})
  const [showColorModal, setShowColorModal] = useState(false)
  const toolbarRef = useRef<HTMLDivElement>(null)

  const updateActiveStates = () => {
    setActiveStates({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikethrough: document.queryCommandState('strikeThrough'),
      code: document.queryCommandValue('formatBlock') === 'pre',
    })
  }

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection()

      if (!selection || selection.rangeCount === 0) {
        if (!showColorModal) setVisible(false)
        return
      }

      const text = selection.toString().trim()

      if (text.length === 0) {
        if (!showColorModal) setVisible(false)
        return
      }

      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      setPosition({
        top: rect.top + window.scrollY - 60,
        left: rect.left + window.scrollX + rect.width / 2 + 300
      })

      updateActiveStates()
      setVisible(true)
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        // Only close if not clicking inside a modal that might be appended elsewhere
        // but since we render it inside the same container it should be fine
      }
    }

    document.addEventListener('mouseup', handleSelection)
    document.addEventListener('keyup', handleSelection)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mouseup', handleSelection)
      document.removeEventListener('keyup', handleSelection)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showColorModal])

  const clickableItems = TOOLBAR_ITEMS.filter(item => item.type !== 'divider')

  const handleAction = (id: string, e?: React.MouseEvent) => {
    switch (id) {
      case 'bold':
        document.execCommand('bold', false)
        break
      case 'italic':
        document.execCommand('italic', false)
        break
      case 'underline':
        document.execCommand('underline', false)
        break
      case 'strikethrough':
        document.execCommand('strikeThrough', false)
        break
      case 'code':
        document.execCommand('formatBlock', false, 'pre')
        break
      case 'palette':
        setShowColorModal(!showColorModal)
        return // Don't update active states yet
      default:
        console.log('Action not implemented:', id)
    }
    updateActiveStates()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!visible) return

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % clickableItems.length)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + clickableItems.length) % clickableItems.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const selectedItem = clickableItems[selectedIndex]
      if (selectedItem && selectedItem.id) {
        handleAction(selectedItem.id)
      }
    } else if (e.key === 'Escape') {
      setVisible(false)
      setShowColorModal(false)
    }
  }

  if (!visible) return null

  return (
    <div
      ref={toolbarRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        top: position.top,
        left: position.left,
        transform: 'translateX(-50%)',
      }}
      className="absolute z-50 flex items-center rounded-xl border border-[#2f2f2f] bg-[#1f1f1f] p-1 shadow-2xl text-sm text-[#d4d4d4] outline-none whitespace-nowrap"
    >
      {TOOLBAR_ITEMS.map((item, index) => {
        if (item.type === 'divider' || !item.id) {
          return <Divider key={`divider-${index}`} />
        }

        const isSelected = clickableItems[selectedIndex]?.id === item.id
        const isActive = activeStates[item.id]

        return (
          <ToolbarButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            isSelected={isSelected}
            isActive={isActive}
            iconPosition={item.id === 'text' ? 'right' : 'left'}
            onMouseDown={(e) => {
              e.preventDefault()
              if (item.id) handleAction(item.id, e)
            }}
            onMouseEnter={() => {
              if (item.id) {
                const clickIndex = clickableItems.findIndex(ci => ci.id === item.id)
                if (clickIndex !== -1) setSelectedIndex(clickIndex)
              }
            }}
          />
        )
      })}

      {showColorModal && (
        <ColorModal 
          onClose={() => setShowColorModal(false)}
          onApplyColor={(type, color) => {
            if (type === 'text') {
              document.execCommand('foreColor', false, color)
            } else {
              document.execCommand('backColor', false, color)
            }
            updateActiveStates()
          }}
        />
      )}
    </div>
  )
}

/* ---------------- Color Modal ---------------- */

const TEXT_COLORS = [
  '#37352f', '#787774', '#976d57', '#d9730d', '#cb912f',
  '#448361', '#337ea9', '#7858cc', '#d15796', '#df5452'
]

const BACK_COLORS = [
  '#37352f', '#787774', '#976d57', '#d9730d', '#cb912f',
  '#448361', '#337ea9', '#7858cc', '#d15796', '#df5452'
]

function ColorModal({ 
  onClose,
  onApplyColor 
}: { 
  onClose: () => void,
  onApplyColor: (type: 'text' | 'bg', color: string) => void
}) {
  return (
    <div 
      className="absolute top-full left-[calc(50%+400px)] -translate-x-1/2 mt-3 z-60 w-64 bg-[#1f1f1f] border border-[#2f2f2f] rounded-lg shadow-2xl p-3 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-100"
      onMouseDown={(e) => e.preventDefault()} // Prevent losing selection
    >

      <div>
        <div className="text-[10px] text-gray-500 font-semibold uppercase mb-2 px-1">Recentemente usado</div>
        <div className="flex gap-2 px-1">
           <div className="w-6 h-6 rounded border border-[#2f2f2f] bg-[#df5452]" />
           <div className="w-6 h-6 rounded border border-[#2f2f2f] bg-[#337ea9]" />
        </div>
      </div>

      <div>
        <div className="text-[10px] text-gray-500 font-semibold uppercase mb-2 px-1">Cor do texto</div>
        <div className="grid grid-cols-5 gap-1">
          {TEXT_COLORS.map((color, i) => (
            <button
              key={`text-${i}`}
              onClick={() => onApplyColor('text', color)}
              className="flex items-center justify-center w-10 h-10 rounded hover:bg-[#2a2a2a] transition-colors border border-transparent hover:border-[#3f3f3f]"
            >
              <span className="text-lg font-medium border px-1.5 rounded" style={{ color: color, borderColor: color }}>A</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[10px] text-gray-500 font-semibold uppercase mb-2 px-1">Cor de fundo</div>
        <div className="grid grid-cols-5 gap-1">
          {BACK_COLORS.map((color, i) => (
            <button
              key={`bg-${i}`}
              onClick={() => onApplyColor('bg', color)}
              className="flex items-center justify-center w-10 h-10 rounded hover:bg-[#2a2a2a] transition-colors border border-transparent hover:border-[#3f3f3f]"
            >
              <div className="w-6 h-6 rounded border border-[#333]" style={{ backgroundColor: color }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------------- Button ---------------- */

function ToolbarButton({
  icon,
  label,
  isSelected,
  isActive,
  onMouseDown,
  onMouseEnter,
  iconPosition = 'left',
}: {
  icon: React.ReactNode
  label?: string
  isSelected?: boolean
  isActive?: boolean
  onMouseDown?: (e: React.MouseEvent) => void
  onMouseEnter?: () => void
  iconPosition?: 'left' | 'right'
}) {
  return (
    <button
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      className={`flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors whitespace-nowrap ${
        isActive ? 'text-[#2383e2] bg-[#2383e21a]' : isSelected ? 'bg-[#2a2a2a] text-white' : 'hover:bg-[#2a2a2a]'
      }`}
    >

      {iconPosition === 'left' && icon}
      {label && <span className="text-sm whitespace-nowrap">{label}</span>}
      {iconPosition === 'right' && icon}
    </button>
  )
}

function Divider() {
  return <div className="mx-2 h-5 w-px bg-[#2a2a2a]" />
}
