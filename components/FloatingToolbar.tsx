'use client'

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Code, Link2, MessageSquareText, MoreHorizontal, SmilePlus, Underline } from 'lucide-react'

import { SlashMenu } from './SlashMenu'
import SquareRootSmallIcon from './ui/SquareRootSmallIcon'
import CommentPencilIcon from './ui/CommentPencilIcon'
import LinkModal from './LinkModal'
import ColorModal from './ColorModal'
import ActionModal from './ActionModal'

type Position = {
  top: number
  left: number
}

type FloatingToolbarProps = {
  userName?: string
  updatedAt?: string
}

export default function FloatingToolbar({ userName, updatedAt }: FloatingToolbarProps) {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 })
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>({})
  const [showColorModal, setShowColorModal] = useState(false)
  const [showSlashMenu, setShowSlashMenu] = useState(false)
	const [showLinkModal, setShowLinkModal] = useState(false)
	const [showActionModal, setShowActionModal] = useState(false)
	const [slashMenuPosition, setSlashMenuPosition] = useState<Position | null>(null)
	const [colorModalPosition, setColorModalPosition] = useState<Position | null>(null)
	const [actionModalPosition, setActionModalPosition] = useState<Position | null>(null)
	const [savedSelection, setSavedSelection] = useState<Range | null>(null)
	const toolbarRef = useRef<HTMLDivElement>(null)
  const lastSelectionRectRef = useRef<DOMRect | null>(null)

  const calculateToolbarPosition = ({
    selectionRect,
    toolbarWidth,
    toolbarHeight,
  }: {
    selectionRect: DOMRect
    toolbarWidth: number
    toolbarHeight: number
  }): Position => {
    const toolbarGap = 16
    const toolbarNudgeX = 120
    const padding = 8

    const viewportWidth = window.innerWidth
    const viewportTop = 0
    const viewportBottom = window.innerHeight

    const halfWidth = toolbarWidth / 2

    let calculatedLeft = selectionRect.left + selectionRect.width / 2 + toolbarNudgeX
    let calculatedTop = selectionRect.bottom + toolbarGap

    // Clamp horizontally (left is the anchor point because we translateX(-50%))
    if (calculatedLeft + halfWidth > viewportWidth - padding) {
      calculatedLeft = viewportWidth - halfWidth - padding
    }
    if (calculatedLeft - halfWidth < padding) {
      calculatedLeft = halfWidth + padding
    }

    // Flip vertically when there's no room below
    if (calculatedTop + toolbarHeight > viewportBottom - padding) {
      calculatedTop = selectionRect.top - toolbarHeight - toolbarGap
    }
    if (calculatedTop < viewportTop + padding) {
      calculatedTop = viewportTop + padding
    }

    return { top: calculatedTop, left: calculatedLeft }
  }

  const saveCurrentSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      setSavedSelection(selection.getRangeAt(0).cloneRange())
    }
  }

  const restoreSavedSelection = () => {
    if (!savedSelection) return
    const selection = window.getSelection()
    if (!selection) return
    selection.removeAllRanges()
    selection.addRange(savedSelection)
  }

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
        if (!showColorModal && !showSlashMenu && !showLinkModal && !showActionModal) setVisible(false)
        return
      }

      const text = selection.toString().trim()
      if (text.length === 0) {
        if (!showColorModal && !showSlashMenu && !showLinkModal && !showActionModal) setVisible(false)
        return
      }

      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      lastSelectionRectRef.current = rect

      const anchorElement = selection.anchorNode instanceof Element ? selection.anchorNode : selection.anchorNode?.parentElement
      const focusElement = selection.focusNode instanceof Element ? selection.focusNode : selection.focusNode?.parentElement
      const isInsideEditor = !!anchorElement?.closest('.note-editor-content') && !!focusElement?.closest('.note-editor-content')

      if (!isInsideEditor) {
        if (!showColorModal && !showSlashMenu && !showLinkModal && !showActionModal) setVisible(false)
        return
      }

      // On first render `toolbarRef` might be null, so use a safe estimate
      // and then refine after mount via `useLayoutEffect`.
      const estimatedWidth = 200
      const estimatedHeight = 240
      const toolbarWidth = toolbarRef.current?.offsetWidth ?? estimatedWidth
      const toolbarHeight = toolbarRef.current?.offsetHeight ?? estimatedHeight

      setPosition(
        calculateToolbarPosition({
          selectionRect: rect,
          toolbarWidth,
          toolbarHeight,
        })
      )

      updateActiveStates()
      setVisible(true)
    }

    document.addEventListener('mouseup', handleSelection)
    document.addEventListener('keyup', handleSelection)

    return () => {
      document.removeEventListener('mouseup', handleSelection)
      document.removeEventListener('keyup', handleSelection)
    }
  }, [showColorModal, showSlashMenu, showLinkModal, showActionModal])

  useLayoutEffect(() => {
    if (!visible) return
    const selectionRect = lastSelectionRectRef.current
    const el = toolbarRef.current
    if (!selectionRect || !el) return

    // Recalculate with real rendered size to ensure "flip" works near viewport edges.
    const next = calculateToolbarPosition({
      selectionRect,
      toolbarWidth: el.offsetWidth || 200,
      toolbarHeight: el.offsetHeight || 240,
    })

    setPosition((prev) => (prev.top === next.top && prev.left === next.left ? prev : next))
  }, [visible, showColorModal, showSlashMenu, showLinkModal, showActionModal])

  const execInline = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    updateActiveStates()
  }

  const handleSlashMenuSelect = (type: string) => {
    let blockEl: HTMLElement | null = null
    if (savedSelection) {
      const node = savedSelection.startContainer
      blockEl = node instanceof HTMLElement ? node.closest('[contenteditable]') : node.parentElement?.closest('[contenteditable]') || null
    }

    if (blockEl && blockEl.id) {
      const event = new CustomEvent('changeBlockType', {
        bubbles: true,
        detail: { blockId: blockEl.id, newType: type },
      })
      blockEl.dispatchEvent(event)
    }

    setShowSlashMenu(false)
    setSavedSelection(null)
  }

  if (!visible) return null

	if (showActionModal) {
	    return (
	      <div
	        ref={toolbarRef}
	        style={{
	          top: actionModalPosition?.top ?? 20,
	          left: actionModalPosition?.left ?? 20,
	        }}
	        className="fixed z-50 floating-toolbar-root"
	      >
	        <ActionModal
	          onClose={() => {
	            setShowActionModal(false)
	            setActionModalPosition(null)
	            setVisible(false)
	          }}
	          userName={userName}
	          updatedAt={updatedAt}
	        />
	      </div>
	    )
	  }

  return (
    <>
      <div
        ref={toolbarRef}
        style={{
          top: position.top,
          left: position.left,
          transform: 'translateX(-50%)',
        }}
        className="fixed z-50 floating-toolbar-root w-[200px] max-h-[70vh] overflow-y-auto rounded-xl border border-[#2f2f2f] bg-[#1f1f1f] p-2 shadow-2xl text-sm text-[#d4d4d4]"
      >
      <div className="flex items-center gap-1 pb-2 border-b border-[#2a2a2a]">
        <button
          onMouseDown={(e) => {
            e.preventDefault()
            saveCurrentSelection()
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
            setSlashMenuPosition({ top: rect.bottom + 8, left: rect.left })
            setShowSlashMenu((prev) => !prev)
          }}
          className={`px-2 py-1 rounded-md text-sm transition-colors ${showSlashMenu ? 'bg-[#2a2a2a] text-white' : 'hover:bg-[#2a2a2a]'}`}
        >
          T
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault()
            saveCurrentSelection()
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
            setColorModalPosition({ top: rect.bottom + 8, left: rect.left + rect.width / 2 })
            setShowColorModal((prev) => !prev)
          }}
          className={`px-2 py-1 rounded-md text-sm font-medium border border-[#3a3a3a] transition-colors ${showColorModal ? 'bg-[#2383e21a] text-[#2383e2]' : 'bg-[#2a2a2a] hover:bg-[#333]'}`}
        >
          A
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault()
            execInline('bold')
          }}
          className={`px-2 py-1 rounded-md font-bold transition-colors ${activeStates.bold ? 'bg-[#2383e21a] text-[#2383e2]' : 'hover:bg-[#2a2a2a]'}`}
        >
          B
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault()
            execInline('italic')
          }}
          className={`px-2 py-1 rounded-md italic transition-colors ${activeStates.italic ? 'bg-[#2383e21a] text-[#2383e2]' : 'hover:bg-[#2a2a2a]'}`}
        >
          I
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault()
            execInline('underline')
          }}
          className={`px-2 py-1 rounded-md transition-colors ${activeStates.underline ? 'bg-[#2383e21a] text-[#2383e2]' : 'hover:bg-[#2a2a2a]'}`}
        >
          <Underline size={14} />
        </button>
      </div>

      <div className="flex items-center gap-1 py-2 border-b border-[#2a2a2a]">
        <button
          onMouseDown={(e) => {
            e.preventDefault()
            saveCurrentSelection()
            setShowLinkModal((prev) => !prev)
          }}
          className={`p-1.5 rounded-md transition-colors ${showLinkModal ? 'bg-[#2383e21a] text-[#2383e2]' : 'hover:bg-[#2a2a2a]'}`}
          aria-label="Link"
        >
          <Link2 size={15} />
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault()
            execInline('strikeThrough')
          }}
          className={`px-2 py-1 rounded-md text-sm transition-colors ${activeStates.strikethrough ? 'bg-[#2383e21a] text-[#2383e2]' : 'hover:bg-[#2a2a2a]'}`}
        >
          <span className="line-through">S</span>
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault()
            execInline('formatBlock', 'pre')
          }}
          className={`p-1.5 rounded-md transition-colors ${activeStates.code ? 'bg-[#2383e21a] text-[#2383e2]' : 'hover:bg-[#2a2a2a]'}`}
          aria-label="Código"
        >
          <Code size={15} />
        </button>
        <button className="px-2 py-1 rounded-md hover:bg-[#2a2a2a] transition-colors flex items-center gap-1">
          <SquareRootSmallIcon size={14} />
        </button>
	        <button
	          onMouseDown={(e) => {
	            e.preventDefault()
	            setShowColorModal(false)
	            setShowLinkModal(false)
	            setShowSlashMenu(false)
	            const rect = toolbarRef.current?.getBoundingClientRect()
	            if (rect) {
	              const padding = 8
	              const modalWidth = 280
	              const desiredLeft = rect.right + 8
	              const hasRoomOnRight = desiredLeft + modalWidth <= window.innerWidth - padding

	              setActionModalPosition({
	                top: rect.top,
	                left: hasRoomOnRight ? desiredLeft : Math.max(padding, rect.left - modalWidth - 8),
	              })
	            }
	            setShowActionModal((prev) => !prev)
	          }}
	          className={`ml-auto p-1.5 rounded-md transition-colors ${showActionModal ? 'bg-[#2a2a2a] text-white' : 'hover:bg-[#2a2a2a]'}`}
	          aria-label="Mais"
	        >
          <MoreHorizontal size={15} />
        </button>
      </div>

      <div className="flex items-center gap-2 py-2 border-b border-[#2a2a2a]">
        <button className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-[#2a2a2a] transition-colors">
          <MessageSquareText size={15} />
          <span>Comentario</span>
        </button>
        <button className="ml-auto p-1.5 rounded-md hover:bg-[#2a2a2a] transition-colors" aria-label="Reacao">
          <SmilePlus size={15} />
        </button>
        <button className="p-1.5 rounded-md hover:bg-[#2a2a2a] transition-colors" aria-label="Criacao">
          <CommentPencilIcon size={16} />
        </button>
      </div>

      <div className="pt-2">
        <AiOption label="Melhoria escrita" />
        <AiOption label="Revisao" />
        <AiOption label="Explicar" />
        <AiOption label="Reformatar" />
        <AiOption label="Gerenciar habilidades" />
      </div>

      {showLinkModal && (
        <LinkModal
          onApplyLink={(url) => {
            restoreSavedSelection()
            document.execCommand('createLink', false, url)
            setShowLinkModal(false)
            setSavedSelection(null)
            updateActiveStates()
          }}
          onClose={() => {
            setShowLinkModal(false)
            setSavedSelection(null)
          }}
        />
      )}

      </div>

      {showColorModal && colorModalPosition && (
        <ColorModal
          position={colorModalPosition}
          onClose={() => setShowColorModal(false)}
          onApplyColor={(type, color) => {
            restoreSavedSelection()
            document.dispatchEvent(new CustomEvent('floatingToolbarColor', {
              detail: { action: 'apply', type, color },
            }))
            updateActiveStates()
            setShowColorModal(false)
          }}
          onResetColor={(type) => {
            restoreSavedSelection()
            document.dispatchEvent(new CustomEvent('floatingToolbarColor', {
              detail: { action: 'reset', type },
            }))
            updateActiveStates()
            setShowColorModal(false)
          }}
        />
      )}

      {showSlashMenu && slashMenuPosition && (
        <div className="fixed inset-0 z-[60] pointer-events-none">
          <div className="absolute pointer-events-auto" style={{ top: slashMenuPosition.top, left: slashMenuPosition.left }}>
            <SlashMenu
              position={{ top: 0, left: 0 }}
              onSelect={handleSlashMenuSelect}
              onClose={() => setShowSlashMenu(false)}
            />
          </div>
        </div>
      )}
    </>
  )
}

function AiOption({ label }: { label: string }) {
  return (
    <button className="w-full text-left px-2 py-1.5 rounded-md hover:bg-[#2a2a2a] transition-colors">
      {label}
    </button>
  )
}
