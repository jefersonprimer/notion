"use client";

import Image from '@tiptap/extension-image';
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import React, { useRef } from 'react';

function ResizableImageView({ node, selected, updateAttributes, editor, getPos }: NodeViewProps) {
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const widthAttr = node.attrs.width as string | undefined;
  const width = widthAttr && widthAttr !== '100%' ? widthAttr : undefined;

  const selectNode = () => {
    const pos = typeof getPos === 'function' ? getPos() : getPos;
    if (typeof pos === 'number') {
      editor.chain().focus().setNodeSelection(pos).run();
    }
  };

  const handleResizeStart = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    selectNode();

    startXRef.current = event.clientX;
    startWidthRef.current = (event.currentTarget.parentElement as HTMLElement)?.getBoundingClientRect().width ?? 0;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startXRef.current;
      const nextWidth = Math.max(120, Math.min(1200, Math.round(startWidthRef.current + delta)));
      updateAttributes({ width: `${nextWidth}px`, height: 'auto' });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <NodeViewWrapper
      contentEditable={false}
      className={`relative my-2 mx-auto max-w-full ${selected ? 'ring-2 ring-[#2383e2] rounded-md' : ''}`}
      style={{ width }}
      onMouseDown={(event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        selectNode();
      }}
      data-type="image"
    >
      <img
        src={node.attrs.src as string}
        alt={(node.attrs.alt as string) || ''}
        title={(node.attrs.title as string) || ''}
        className="block w-full h-auto rounded-md select-none"
        draggable={false}
      />

      {selected && (
        <button
          type="button"
          aria-label="Resize image"
          className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#2383e2] border border-white cursor-ew-resize"
          onMouseDown={handleResizeStart}
        />
      )}
    </NodeViewWrapper>
  );
}

const ResizableImage = Image.extend({
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        parseHTML: (element: HTMLElement) => element.getAttribute('data-width') || element.style.width || '100%',
        renderHTML: (attributes: Record<string, string>) => ({
          'data-width': attributes.width,
          style: `width:${attributes.width || '100%'};`,
        }),
      },
      height: {
        default: 'auto',
        parseHTML: (element: HTMLElement) => element.getAttribute('data-height') || element.style.height || 'auto',
        renderHTML: (attributes: Record<string, string>) => ({
          'data-height': attributes.height,
        }),
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView);
  },
});

export default ResizableImage;
