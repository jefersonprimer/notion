import { useState, useEffect, useRef } from "react"
import { formatRelativeDate } from '@/lib/utils'
import {
  ChevronRight,
  Repeat2,
  Palette,
  Link,
  Copy,
  CornerUpRight,
  Trash2,
  MessageSquareText,
  Pencil,
  Sparkles,
} from "lucide-react"

import CommentPencilIcon from "./ui/CommentPencilIcon"
import { MENU_ITEMS } from "./SlashMenu"
import { TEXT_COLORS, BACK_COLORS } from "./ColorModal"

type ActionItemProps = {
  icon: React.ReactNode
  label: string
  shortcut?: string
  hasArrow?: boolean
  danger?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

function ActionItem({
  icon,
  label,
  shortcut,
  hasArrow,
  danger,
  onMouseEnter,
  onMouseLeave,
}: ActionItemProps) {
  return (
    <button
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`
        group flex w-full items-center justify-between
        px-2 py-1 rounded-md text-base
        transition-colors
        text-[#f0efed]
        hover:bg-[#ffffff0e]
      `}
    >
      <div className="flex items-center gap-2">
        <span className="opacity-80 group-hover:opacity-100">
          {icon}
        </span>
        <span>{label}</span>
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-400">
        {shortcut && <span>{shortcut}</span>}
        {hasArrow && <ChevronRight size={18} />}
      </div>
    </button>
  )
}

type ActionModalProps = {
  onClose: () => void
  userName?: string
  updatedAt?: string
  onTransformSelect?: (type: string) => void
  onApplyColor?: (type: 'text' | 'bg', color: string) => void
}

export default function ActionModal({ onClose, userName, updatedAt, onTransformSelect, onApplyColor }: ActionModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [showColorMenu, setShowColorMenu] = useState(false)

  const formattedDate = updatedAt
    ? formatRelativeDate(new Date(updatedAt))
    : ''

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div ref={modalRef} className="relative w-68 rounded-lg border border-zinc-700 bg-[#252525] backdrop-blur-md shadow-2xl p-2">
      {/* SlashMenu submenu – positioned to the left */}
      {showSlashMenu && (
        <div
          style={{ position: 'absolute', right: 'calc(100% + 8px)', top: 0 }}
          onMouseEnter={() => setShowSlashMenu(true)}
          onMouseLeave={() => setShowSlashMenu(false)}
        >
          <div className="w-60 bg-[#252525] border border-[#3f3f3f] rounded-lg shadow-xl overflow-y-auto py-2 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-1 text-xs font-medium text-[#ada9a3]">Blocos básicos</div>
            {MENU_ITEMS.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  onTransformSelect?.(item.id)
                  setShowSlashMenu(false)
                  onClose()
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors hover:bg-[#3f3f3f]"
              >
                <div className="w-6 h-6 border border-[#3f3f3f] rounded flex items-center justify-center bg-[#2f2f2f] text-[#e6e5e3]">
                  {item.icon}
                </div>
                <span className="text-sm text-[#e6e5e3]">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ColorModal submenu – positioned to the left */}
      {showColorMenu && (
        <div
          style={{ position: 'absolute', right: 'calc(100% + 8px)', top: 0 }}
          onMouseEnter={() => setShowColorMenu(true)}
          onMouseLeave={() => setShowColorMenu(false)}
        >
          <div className="w-64 bg-[#252525] border border-[#3f3f3f] rounded-lg shadow-xl p-3 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-100">
            <div>
              <div className="text-[10px] text-gray-500 font-semibold uppercase mb-2 px-1">Cor do texto</div>
              <div className="grid grid-cols-5 gap-1">
                <button
                  onClick={() => { onApplyColor?.('text', 'inherit'); setShowColorMenu(false) }}
                  className="flex items-center justify-center w-10 h-10 rounded hover:bg-[#2a2a2a] transition-colors border border-transparent hover:border-[#3f3f3f]"
                  title="Padrão"
                >
                  <span className="text-lg font-medium border px-1.5 rounded text-gray-300 border-gray-500">A</span>
                </button>
                {TEXT_COLORS.map((color, i) => (
                  <button
                    key={`text-${i}`}
                    onClick={() => { onApplyColor?.('text', color); setShowColorMenu(false) }}
                    className="flex items-center justify-center w-10 h-10 rounded hover:bg-[#2a2a2a] transition-colors border border-transparent hover:border-[#3f3f3f]"
                  >
                    <span className="text-lg font-medium border px-1.5 rounded" style={{ color, borderColor: color }}>A</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-gray-500 font-semibold uppercase mb-2 px-1">Cor de fundo</div>
              <div className="grid grid-cols-5 gap-1">
                <button
                  onClick={() => { onApplyColor?.('bg', 'transparent'); setShowColorMenu(false) }}
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
                    onClick={() => { onApplyColor?.('bg', color); setShowColorMenu(false) }}
                    className="flex items-center justify-center w-10 h-10 rounded hover:bg-[#2a2a2a] transition-colors border border-transparent hover:border-[#3f3f3f]"
                  >
                    <div className="w-6 h-6 rounded border border-[#333]" style={{ backgroundColor: color }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <input
        placeholder="Pesquisar ações..."
        className="
          w-full mb-2
          rounded-md bg-[#ffffff0e]
          px-2 py-1 text-base
        text-[#f0efed]
        placeholder:text-[#7d7a75]
          outline-none
          focus:ring-1 focus:ring-zinc-600
        "
      />

      {/* Title */}
      <div className="px-2 py-1 text-sm text-[#ada9a3] font-medium">
        Título 2
      </div>

      <div className="space-y-1">
        <ActionItem
          icon={<Repeat2 size={20} />}
          label="Transformar em"
          hasArrow
          onMouseEnter={() => { setShowSlashMenu(true); setShowColorMenu(false) }}
          onMouseLeave={() => setShowSlashMenu(false)}
        />

        <ActionItem
          icon={<Palette size={18} />}
          label="Cor"
          hasArrow
          onMouseEnter={() => { setShowColorMenu(true); setShowSlashMenu(false) }}
          onMouseLeave={() => setShowColorMenu(false)}
        />

        <ActionItem
          icon={<Link size={18} />}
          label="Link para o bloco"
          shortcut="Alt + ⇧ + L"
        />

        <ActionItem
          icon={<Copy size={18} />}
          label="Duplicar"
          shortcut="Ctrl + D"
        />

        <ActionItem
          icon={<CornerUpRight size={18} />}
          label="Mover para"
          shortcut="Ctrl + ⇧ + P"
        />

        <ActionItem
          icon={<Trash2 size={18} />}
          label="Excluir"
          shortcut="Del"
          danger
        />

        <div className="my-1 border-t border-zinc-700" />

        <ActionItem
          icon={<MessageSquareText size={18} />}
          label="Comentário"
          shortcut="Ctrl + ⇧ + M"
        />

        <ActionItem
          icon={<CommentPencilIcon size={22} />}
          label="Sugerir edições"
          shortcut="Ctrl + ⇧ + Alt + X"
        />

        <div className="my-1 border-t border-zinc-700" />
        <ActionItem
          icon={<Sparkles size={18} />}
          label="Peça à IA"
          shortcut="Ctrl + J"
        />
      </div>

      <div className="my-1 border-t border-zinc-700" />
      {/* Footer */}
      <div className="py-1 text-xs text-[#7d7a75]">
        Última edição por <span className="text-zinc-300">{userName || 'Usuário'}</span>
        <br />
        {formattedDate}
      </div>
    </div>
  )
}
