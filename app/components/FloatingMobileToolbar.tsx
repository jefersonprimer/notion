"use client";

import {
  Plus,
  ChevronDown,
  AtSign,
  MessageSquareText,
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

  const style: React.CSSProperties = position 
    ? { top: position.top } 
    : {};

  return (
    <div 
      className={`fixed ${position ? '' : 'bottom-20'} inset-x-0 mx-auto z-50 w-[95vw] max-w-180 transition-all duration-200 floating-mobile-toolbar`}
      style={style}
    >
      <div className="bg-[#2f2f2f] border border-[#444] rounded-xl shadow-xl flex overflow-hidden">

        {/* Scroll container */}
        <div className="flex overflow-x-auto overflow-y-hidden mobile-toolbar-scrollbar">

          {/* + button */}
          <ToolbarButton>
            <Plus size={20} />
            <ChevronDown size={16}/>
          </ToolbarButton>

          {/* Transformar em */}
          <ToolbarButton text>
            Transformar em
            <ChevronDown size={16}/>
          </ToolbarButton>

          {/* @ */}
          <ToolbarButton>
            <AtSign size={20} />
          </ToolbarButton>

          {/* Comment */}
          <ToolbarButton>
            <MessageSquareText size={20} />
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
            <ChevronDown size={16}/>
          </ToolbarButton>

          {/* Mais */}
          <ToolbarButton text>
            Mais
            <ChevronDown size={16}/>
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
      h-10.5
      min-w-11
      px-3
      border-r border-[#444]
      text-[#f0efed]
      whitespace-nowrap
      shrink-0
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
      w-8.5 h-10.5
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
    <div className="flex border-r border-[#444] px-1 shrink-0">
      {children}
    </div>
  );
}
