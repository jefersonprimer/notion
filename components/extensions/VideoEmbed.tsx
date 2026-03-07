"use client";

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import React, { useRef, useState } from 'react';

// ─── React Component for the Node View ────────────────────────────────────────

function VideoEmbedView({ node, selected, updateAttributes, editor, getPos }: NodeViewProps) {
    const { src, width, height } = node.attrs;
    const [interactive, setInteractive] = useState(false);
    const startXRef = useRef(0);
    const startYRef = useRef(0);
    const startWidthRef = useRef(0);
    const startHeightRef = useRef(0);

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

        const container = event.currentTarget.parentElement as HTMLElement | null;
        if (!container) return;

        startXRef.current = event.clientX;
        startYRef.current = event.clientY;
        startWidthRef.current = container.getBoundingClientRect().width;
        startHeightRef.current = container.getBoundingClientRect().height;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startXRef.current;
            const deltaY = moveEvent.clientY - startYRef.current;
            const nextWidth = Math.max(280, Math.min(1200, Math.round(startWidthRef.current + deltaX)));
            const nextHeight = Math.max(180, Math.min(900, Math.round(startHeightRef.current + deltaY)));
            updateAttributes({
                width: `${nextWidth}px`,
                height: `${nextHeight}px`,
            });
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
            data-type="videoEmbed"
            className={`relative my-2 mx-auto ${selected ? 'ring-2 ring-[#2383e2] rounded-md' : ''}`}
            style={{ width: width || '100%' }}
            onMouseDown={(event: React.MouseEvent<HTMLDivElement>) => {
                if (interactive) return;
                event.preventDefault();
                selectNode();
            }}
        >
            <div
                className="relative flex justify-center"
            >
                <iframe
                    src={src}
                    className="w-full rounded-sm"
                    style={{ height: height || '450px' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                />
                {!interactive && (
                    <div
                        className="absolute inset-0 cursor-pointer"
                        onMouseDown={(event: React.MouseEvent<HTMLDivElement>) => {
                            event.preventDefault();
                            selectNode();
                        }}
                    />
                )}
            </div>
            {selected && (
                <button
                    type="button"
                    className="absolute left-2 top-2 rounded bg-[#1f1f1f] border border-[#3f3f3f] px-2 py-0.5 text-xs text-[#f0efed]"
                    onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault()}
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setInteractive((prev) => !prev);
                    }}
                >
                    {interactive ? 'Editar' : 'Interagir'}
                </button>
            )}
            {selected && (
                <button
                    type="button"
                    aria-label="Resize video"
                    className="absolute -right-2 -bottom-2 w-4 h-4 rounded-full bg-[#2383e2] border border-white cursor-nwse-resize"
                    onMouseDown={handleResizeStart}
                />
            )}
        </NodeViewWrapper>
    );
}

// ─── Tiptap Node Extension ────────────────────────────────────────────────────

const VideoEmbed = Node.create({
    name: 'videoEmbed',
    group: 'block',
    atom: true,
    selectable: true,

    addAttributes() {
        return {
            src: {
                default: '',
                parseHTML: (element: HTMLElement) => element.getAttribute('data-src'),
                renderHTML: (attributes: Record<string, string>) => ({
                    'data-src': attributes.src,
                }),
            },
            width: {
                default: '100%',
                parseHTML: (element: HTMLElement) => element.getAttribute('data-width'),
                renderHTML: (attributes: Record<string, string>) => ({
                    'data-width': attributes.width,
                }),
            },
            height: {
                default: '450px',
                parseHTML: (element: HTMLElement) => element.getAttribute('data-height'),
                renderHTML: (attributes: Record<string, string>) => ({
                    'data-height': attributes.height,
                }),
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="videoEmbed"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
        return ['div', mergeAttributes({ 'data-type': 'videoEmbed' }, HTMLAttributes)];
    },

    addNodeView() {
        return ReactNodeViewRenderer(VideoEmbedView);
    },
});

export default VideoEmbed;
