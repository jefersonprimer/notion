"use client";

import {
  Plus,
  ChevronDown,
  AtSign,
  MessageSquare,
  ImageIcon,
  Trash,
  ArrowLeftToLine,
  ArrowRightToLine,
  ArrowUpFromLine,
  ArrowDownFromLine,
  Undo2,
  Redo2,
} from "lucide-react";

export default function FloatingMobileToolbar({ 
  isVisible, 
  position 
}: { 
  isVisible: boolean; 
  position?: { top: number; left: number };
}) {
  if (!isVisible) return null;

  const style = position 
    ? { top: position.top, left: '50%', transform: 'translateX(-50%)' } 
    : {};

  return (
    <div 
      className={`fixed ${position ? '' : 'bottom-20'} left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-[720px] transition-all duration-200 floating-mobile-toolbar`}
      style={style}
    >
      <div className="bg-[#2f2f2f] border border-[#444] rounded-xl shadow-xl flex overflow-hidden">

        {/* Scroll container */}
        <div className="flex overflow-x-auto overflow-y-hidden scrollbar-none">

          {/* + button */}
          <ToolbarButton>
            <Plus size={20} />
            <ChevronDown size={16} className="text-neutral-400" />
          </ToolbarButton>

          {/* Transformar em */}
          <ToolbarButton text>
            Transformar em
            <ChevronDown size={16} className="text-neutral-400" />
          </ToolbarButton>

          {/* @ */}
          <ToolbarButton>
            <AtSign size={20} />
          </ToolbarButton>

          {/* Comment */}
          <ToolbarButton>
            <MessageSquare size={20} />
          </ToolbarButton>

          {/* Image */}
          <ToolbarButton>
            <ImageIcon size={20} />
          </ToolbarButton>

          {/* Trash */}
          <ToolbarButton>
            <Trash size={20} />
          </ToolbarButton>

          {/* Divider group */}
          <ToolbarGroup>
            <IconButton disabled>
              <ArrowLeftToLine size={20} />
            </IconButton>

            <IconButton>
              <ArrowRightToLine size={20} />
            </IconButton>

            <IconButton>
              <ArrowUpFromLine size={20} />
            </IconButton>

            <IconButton>
              <ArrowDownFromLine size={20} />
            </IconButton>
          </ToolbarGroup>

          {/* Undo / Redo */}
          <ToolbarGroup>
            <IconButton disabled>
              <Undo2 size={20} />
            </IconButton>

            <IconButton disabled>
              <Redo2 size={20} />
            </IconButton>
          </ToolbarGroup>

          {/* Cor */}
          <ToolbarButton text>
            Cor
            <ChevronDown size={16} className="text-neutral-400" />
          </ToolbarButton>

          {/* Mais */}
          <ToolbarButton text>
            Mais
            <ChevronDown size={16} className="text-neutral-400" />
          </ToolbarButton>

        </div>
      </div>
    </div>
  );
}

/* Button base */

function ToolbarButton({
  children,
  text = false,
}: {
  children: React.ReactNode;
  text?: boolean;
}) {
  return (
    <button
      className={`
      flex items-center justify-center
      gap-1
      h-[42px]
      min-w-[44px]
      px-3
      border-r border-[#444]
      text-neutral-200
      whitespace-nowrap
      flex-shrink-0
      transition-colors
      hover:bg-[#3a3a3a]
      active:bg-[#444]
      ${text ? "font-medium text-sm px-3" : ""}
      `}
    >
      {children}
    </button>
  );
}

/* Icon only button */

function IconButton({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      className={`
      w-[34px] h-[42px]
      flex items-center justify-center
      transition-colors
      ${disabled ? "opacity-40 cursor-default" : "hover:bg-[#3a3a3a] active:bg-[#444]"}
      `}
    >
      {children}
    </button>
  );
}

/* Group with divider */

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex border-r border-[#444] px-1 flex-shrink-0">
      {children}
    </div>
  );
}
