'use client'

import React, { useEffect, useState, useRef } from 'react'
import {
  CircleQuestionMark,
  Sparkles,
  MessageSquareText,
  SmilePlus,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link2,
  Palette,
  MoreHorizontal,
  ChevronDown,
} from 'lucide-react'

import { SlashMenu } from './SlashMenu'
import SquareRootSmallIcon from './ui/SquareRootSmallIcon';
import CommentPencilIcon from './ui/CommentPencilIcon';
import LinkModal from './LinkModal';

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
  { id: 'edit', icon: <CommentPencilIcon size={20} /> },
  { type: 'divider' },
  { id: 'text', icon: <ChevronDown size={16} /> },
  { id: 'bold', icon: <Bold size={16} /> },
  { id: 'italic', icon: <Italic size={16} /> },
  { id: 'underline', icon: <Underline size={16} /> },
  { id: 'strikethrough', icon: <Strikethrough size={16} /> },
  { type: 'divider' },
  { id: 'code', icon: <Code size={16} /> },
  { id: 'sigma', icon: <SquareRootSmallIcon size={16} /> },
  { id: 'link', icon: <Link2 size={16} />, hasChevron: true },
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
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [slashMenuLeft, setSlashMenuLeft] = useState(0)
  const [selectedBlockLabel, setSelectedBlockLabel] = useState('Texto')
  const [savedSelection, setSavedSelection] = useState<Range | null>(null) // New state to save selection
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
        if (!showColorModal && !showSlashMenu && !showLinkModal) setVisible(false)
        return
      }

      const text = selection.toString().trim()

      if (text.length === 0) {
        if (!showColorModal && !showSlashMenu && !showLinkModal) setVisible(false)
        return
      }

      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      let calculatedLeft = rect.left + window.scrollX + rect.width / 2 + 300

      // Clamp so toolbar doesn't overflow the viewport horizontally
      if (toolbarRef.current) {
        const toolbarWidth = toolbarRef.current.offsetWidth
        const halfWidth = toolbarWidth / 2
        const viewportWidth = window.innerWidth
        const padding = 8 // small padding from edges

        // Right edge overflow
        if (calculatedLeft + halfWidth > viewportWidth - padding) {
          calculatedLeft = viewportWidth - halfWidth - padding
        }
        // Left edge overflow
        if (calculatedLeft - halfWidth < padding) {
          calculatedLeft = halfWidth + padding
        }
      }

      setPosition({
        top: rect.top + window.scrollY - 60,
        left: calculatedLeft,
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
  }, [showColorModal, showSlashMenu, showLinkModal])

  const clickableItems = TOOLBAR_ITEMS.map((item) => {
    if (item.id === 'text') {
      return { ...item, label: selectedBlockLabel };
    }
    return item;
  }).filter(item => item.type !== 'divider');

  const handleSlashMenuSelect = (type: string) => {
    // Find the contentEditable block element from the saved selection
    let blockEl: HTMLElement | null = null
    if (savedSelection) {
      const node = savedSelection.startContainer
      blockEl = node instanceof HTMLElement
        ? node.closest('[contenteditable]')
        : node.parentElement?.closest('[contenteditable]') || null
    }

    // Dispatch a custom event so that page.tsx can change the block type
    // via the same onChange mechanism used by SortableBlock
    if (blockEl && blockEl.id) {
      const event = new CustomEvent('changeBlockType', {
        bubbles: true,
        detail: { blockId: blockEl.id, newType: type }
      })
      blockEl.dispatchEvent(event)
    }

    let label = 'Texto'
    switch (type) {
      case 'text': label = 'Texto'; break
      case 'h1': label = 'Título 1'; break
      case 'h2': label = 'Título 2'; break
      case 'h3': label = 'Título 3'; break
      case 'bullet': label = 'Lista com marcadores'; break
      case 'number': label = 'Lista numerada'; break
      case 'todo': label = 'Lista de tarefas'; break
      case 'toggle': label = 'Lista de alternantes'; break
      case 'code': label = 'Bloco de código'; break
      case 'page': label = 'Página'; break
      default: break
    }
    setSelectedBlockLabel(label)
    setShowSlashMenu(false)
    setSavedSelection(null)
  }

  const handleAction = (id: string, e?: React.MouseEvent) => {
    switch (id) {
      case 'explain':
        console.log('Explain action')
        break
      case 'ai':
        console.log('AI action')
        break
      case 'comment':
        console.log('Comment action')
        break
      case 'reaction':
        console.log('Reaction action')
        break
      case 'edit':
        console.log('Edit action')
        break
      case 'text':
        e?.preventDefault()
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          setSavedSelection(selection.getRangeAt(0))
        }
        setShowSlashMenu((prev) => !prev)
        break
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
      case 'sigma':
        console.log('Sigma action')
        break
      case 'link':
        e?.preventDefault()
        const sel = window.getSelection()
        if (sel && sel.rangeCount > 0) {
          setSavedSelection(sel.getRangeAt(0))
        }
        setShowLinkModal((prev) => !prev)
        break
      case 'palette':
        setShowColorModal((prev) => !prev)
        break
      case 'more':
        console.log('More action')
        break
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
      setShowLinkModal(false)
      setShowSlashMenu(false)
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

        if (item.id === 'link' && (item as any).hasChevron) {
          return (
            <div key={item.id} className="relative flex items-center">
              <ToolbarButton
                icon={item.icon}
                isSelected={isSelected}
                isActive={isActive || showLinkModal}
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleAction('link', e)
                }}
                onMouseEnter={() => {
                  const clickIndex = clickableItems.findIndex(ci => ci.id === item.id)
                  if (clickIndex !== -1) setSelectedIndex(clickIndex)
                }}
              />
              <ChevronDown size={12} className="-ml-1.5 text-gray-500" />
              {showLinkModal && (
                <LinkModal
                  onApplyLink={(url) => {
                    // Restore saved selection
                    if (savedSelection) {
                      const sel = window.getSelection()
                      sel?.removeAllRanges()
                      sel?.addRange(savedSelection)
                    }
                    document.execCommand('createLink', false, url)
                    // Style the created link
                    const sel = window.getSelection()
                    if (sel && sel.rangeCount > 0) {
                      const range = sel.getRangeAt(0)
                      const container = range.commonAncestorContainer
                      const parentEl = container instanceof HTMLElement ? container : container.parentElement
                      const link = parentEl?.closest('a') || parentEl?.querySelector('a')
                      if (link) {
                        link.style.color = '#2383e2'
                        link.style.textDecoration = 'underline'
                        link.style.cursor = 'pointer'
                        link.setAttribute('target', '_blank')
                        link.setAttribute('rel', 'noopener noreferrer')
                      }
                    }
                    setShowLinkModal(false)
                    setSavedSelection(null)

                    // Trigger input event so block content updates
                    const blockEl = savedSelection?.startContainer instanceof HTMLElement
                      ? savedSelection.startContainer.closest('[contenteditable]')
                      : savedSelection?.startContainer.parentElement?.closest('[contenteditable]')
                    if (blockEl) {
                      blockEl.dispatchEvent(new Event('input', { bubbles: true }))
                    }
                  }}
                  onClose={() => {
                    setShowLinkModal(false)
                    setSavedSelection(null)
                  }}
                />
              )}
            </div>
          )
        }

        return (
          <ToolbarButton
            key={item.id}
            icon={item.icon}
            label={item.id === 'text' ? selectedBlockLabel : item.label}
            isSelected={isSelected}
            isActive={isActive}
            iconPosition={item.id === 'text' ? 'right' : 'left'}
            onMouseDown={(e) => {
              e.preventDefault()
              if (item.id === 'text') {
                const btn = (e.currentTarget as HTMLElement)
                setSlashMenuLeft(btn.offsetLeft)
                handleAction('text', e)
              } else if (item.id) {
                handleAction(item.id, e)
              }
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
          onResetColor={(type) => {
            if (type === 'text') {
              // Save formatting states before removeFormat
              const wasBold = document.queryCommandState('bold')
              const wasItalic = document.queryCommandState('italic')
              const wasUnderline = document.queryCommandState('underline')
              const wasStrike = document.queryCommandState('strikeThrough')
              document.execCommand('removeFormat', false)
              // Re-apply saved formatting
              if (wasBold) document.execCommand('bold', false)
              if (wasItalic) document.execCommand('italic', false)
              if (wasUnderline) document.execCommand('underline', false)
              if (wasStrike) document.execCommand('strikeThrough', false)
            } else {
              document.execCommand('hiliteColor', false, 'transparent')
            }
            updateActiveStates()
          }}
        />
      )}

      {showSlashMenu && (
        <SlashMenu
          leftOffset={slashMenuLeft}
          onSelect={handleSlashMenuSelect}
          onClose={() => setShowSlashMenu(false)}
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
  onApplyColor,
  onResetColor
}: {
  onClose: () => void,
  onApplyColor: (type: 'text' | 'bg', color: string) => void,
  onResetColor: (type: 'text' | 'bg') => void
}) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [flipAbove, setFlipAbove] = useState(false)
  const [adjustedLeft, setAdjustedLeft] = useState<number | null>(null)

  useEffect(() => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect()
      const padding = 8

      // Vertical flip
      if (rect.bottom > window.innerHeight) {
        setFlipAbove(true)
      }

      // Horizontal clamp
      if (rect.right > window.innerWidth - padding) {
        const overflow = rect.right - window.innerWidth + padding
        setAdjustedLeft(-overflow)
      } else if (rect.left < padding) {
        const overflow = padding - rect.left
        setAdjustedLeft(overflow)
      }
    }

    // Close when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div
      ref={modalRef}
      style={adjustedLeft !== null ? { marginLeft: adjustedLeft } : undefined}
      className={`absolute left-[calc(50%+400px)] -translate-x-1/2 z-60 w-64 bg-[#1f1f1f] border border-[#2f2f2f] rounded-lg shadow-2xl p-3 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-100 ${flipAbove ? 'bottom-full mb-3' : 'top-full mt-3'
        }`}
      onMouseDown={(e) => e.preventDefault()}
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
          <button
            onClick={() => onResetColor('text')}
            className="flex items-center justify-center w-10 h-10 rounded hover:bg-[#2a2a2a] transition-colors border border-transparent hover:border-[#3f3f3f]"
            title="Padrão"
          >
            <span className="text-lg font-medium border px-1.5 rounded text-gray-300 border-gray-500">A</span>
          </button>
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
          <button
            onClick={() => onResetColor('bg')}
            className="flex items-center justify-center w-10 h-10 rounded hover:bg-[#2a2a2a] transition-colors border border-transparent hover:border-[#3f3f3f]"
            title="Padrão"
          >
            <div className="w-6 h-6 rounded border border-dashed border-gray-500 flex items-center justify-center">
              <span className="text-[10px] text-gray-500">⊘</span>
            </div>
          </button>
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
      className={`flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors whitespace-nowrap ${isActive ? 'text-[#2383e2] bg-[#2383e21a]' : isSelected ? 'bg-[#2a2a2a] text-white' : 'hover:bg-[#2a2a2a]'
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
