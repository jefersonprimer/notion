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
  const toolbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection()

      if (!selection || selection.rangeCount === 0) {
        setVisible(false)
        return
      }

      const text = selection.toString().trim()

      if (text.length === 0) {
        setVisible(false)
        return
      }

      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      setPosition({
        top: rect.top + window.scrollY - 50,
        left: rect.left + window.scrollX + 200
      })

      setVisible(true)
    }

    document.addEventListener('mouseup', handleSelection)
    document.addEventListener('keyup', handleSelection)

    return () => {
      document.removeEventListener('mouseup', handleSelection)
      document.removeEventListener('keyup', handleSelection)
    }
  }, [])

  const clickableItems = TOOLBAR_ITEMS.filter(item => item.type !== 'divider')

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
      console.log('Selected:', clickableItems[selectedIndex].id)
      // Here you would call the actual action
    } else if (e.key === 'Escape') {
      setVisible(false)
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
      className="absolute z-50 flex items-center rounded-xl border border-[#2f2f2f] bg-[#1f1f1f] px-3 py-2 shadow-2xl text-sm text-[#d4d4d4] outline-none whitespace-nowrap"
    >
      {TOOLBAR_ITEMS.map((item, index) => {
        if (item.type === 'divider') {
          return <Divider key={`divider-${index}`} />
        }

        const isSelected = clickableItems[selectedIndex]?.id === item.id

        return (
          <ToolbarButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            isSelected={isSelected}
            iconPosition={item.id === 'text' ? 'right' : 'left'}
            onClick={() => {
              console.log('Clicked:', item.id)
            }}
            onMouseEnter={() => {
              const clickIndex = clickableItems.findIndex(ci => ci.id === item.id)
              if (clickIndex !== -1) setSelectedIndex(clickIndex)
            }}
          />
        )
      })}
    </div>
  )
}

/* ---------------- Button ---------------- */

function ToolbarButton({
  icon,
  label,
  isSelected,
  onClick,
  onMouseEnter,
  iconPosition = 'left',
}: {
  icon: React.ReactNode
  label?: string
  isSelected?: boolean
  onClick?: () => void
  onMouseEnter?: () => void
  iconPosition?: 'left' | 'right'
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors whitespace-nowrap ${
        isSelected ? 'bg-[#2a2a2a] text-white' : 'hover:bg-[#2a2a2a]'
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
