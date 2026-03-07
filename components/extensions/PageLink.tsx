"use client";

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import React from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';

// ─── React Component for the Node View ────────────────────────────────────────

function PageLinkView({ node }: NodeViewProps) {
    const pageId = String(node.attrs.pageId || '');
    const title = String(node.attrs.title || 'Nova página');
    return (
        <NodeViewWrapper contentEditable={false} data-type="pageLink">
            <Link
                href={`/${pageId}`}
                className="flex items-center gap-2 w-full p-1.5 my-1 hover:bg-[#2f2f2f] rounded transition-colors group/link"
            >
                <FileText size={20} className="text-[#9b9b9b] group-hover/link:text-white shrink-0" />
                <span className="text-base text-white font-medium truncate underline-offset-4 group-hover/link:underline">
                    {title || 'Nova página'}
                </span>
            </Link>
        </NodeViewWrapper>
    );
}

// ─── Tiptap Node Extension ────────────────────────────────────────────────────

const PageLink = Node.create({
    name: 'pageLink',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            pageId: {
                default: '',
                parseHTML: (element: HTMLElement) => element.getAttribute('data-page-id'),
                renderHTML: (attributes: Record<string, string>) => ({
                    'data-page-id': attributes.pageId,
                }),
            },
            title: {
                default: 'Nova página',
                parseHTML: (element: HTMLElement) => element.getAttribute('data-title'),
                renderHTML: (attributes: Record<string, string>) => ({
                    'data-title': attributes.title,
                }),
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="pageLink"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
        return ['div', mergeAttributes({ 'data-type': 'pageLink' }, HTMLAttributes)];
    },

    addNodeView() {
        return ReactNodeViewRenderer(PageLinkView);
    },
});

export default PageLink;
