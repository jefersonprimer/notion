"use client";

import React, {
    useState,
    useEffect,
    useCallback,
    forwardRef,
    useImperativeHandle,
} from 'react';
import {
    Type,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    ListTodo,
    ListCollapse,
    FileText,
    Code,
} from 'lucide-react';
import { Extension } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import Suggestion from '@tiptap/suggestion';

// ─── Menu Items ─────────────────────────────────────────────────────────────────

export const SLASH_ITEMS = [
    { id: 'paragraph', label: 'Texto', icon: <Type size={18} /> },
    { id: 'heading1', label: 'Título 1', icon: <Heading1 size={18} /> },
    { id: 'heading2', label: 'Título 2', icon: <Heading2 size={18} /> },
    { id: 'heading3', label: 'Título 3', icon: <Heading3 size={18} /> },
    { id: 'bulletList', label: 'Lista com marcadores', icon: <List size={18} /> },
    { id: 'orderedList', label: 'Lista numerada', icon: <ListOrdered size={18} /> },
    { id: 'taskList', label: 'Lista de tarefas', icon: <ListTodo size={18} /> },
    { id: 'blockquote', label: 'Citação', icon: <ListCollapse size={18} /> },
    { id: 'codeBlock', label: 'Bloco de código', icon: <Code size={18} /> },
    { id: 'page', label: 'Página', icon: <FileText size={18} /> },
];

// ─── React Component for the popup ──────────────────────────────────────────

interface SlashMenuListProps {
    items: typeof SLASH_ITEMS;
    command: (item: { id: string }) => void;
}

export const SlashMenuList = forwardRef<
    { onKeyDown: (props: { event: KeyboardEvent }) => boolean },
    SlashMenuListProps
>(function SlashMenuList({ items, command }, ref) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = useCallback(
        (index: number) => {
            const item = items[index];
            if (item) {
                command(item);
            }
        },
        [items, command]
    );

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: { event: KeyboardEvent }) => {
            if (event.key === 'ArrowUp') {
                setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
                return true;
            }
            if (event.key === 'ArrowDown') {
                setSelectedIndex((prev) => (prev + 1) % items.length);
                return true;
            }
            if (event.key === 'Enter') {
                selectItem(selectedIndex);
                return true;
            }
            return false;
        },
    }));

    useEffect(() => {
        setSelectedIndex(0);
    }, [items]);

    if (!items.length) return null;

    return (
        <div className="z-[60] w-60 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#3f3f3f] rounded-lg shadow-xl overflow-y-auto py-2 animate-in fade-in zoom-in-95 duration-100 outline-none max-h-[320px]">
            <div className="px-3 py-1 text-xs font-medium text-[#ada9a3]">
                Blocos básicos
            </div>
            {items.map((item, index) => (
                <button
                    key={item.id}
                    onClick={() => selectItem(index)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors ${index === selectedIndex
                            ? 'bg-gray-100 dark:bg-[#3f3f3f]'
                            : 'hover:bg-gray-100 dark:hover:bg-[#3f3f3f]'
                        }`}
                >
                    <div className="w-6 h-6 border border-gray-200 dark:border-[#3f3f3f] rounded flex items-center justify-center bg-white dark:bg-[#2f2f2f] text-gray-600 dark:text-[#e6e5e3]">
                        {item.icon}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-700 dark:text-[#e6e5e3]">
                            {item.label}
                        </span>
                    </div>
                </button>
            ))}
        </div>
    );
});

// ─── Tiptap Extension ─────────────────────────────────────────────────────────

interface SlashCommandsOptions {
    onPageCreate?: () => void;
}

const SlashCommands = Extension.create<SlashCommandsOptions>({
    name: 'slashCommands',

    addOptions() {
        return {
            onPageCreate: undefined,
        };
    },

    addProseMirrorPlugins() {
        const extensionThis = this;
        return [
            Suggestion({
                editor: this.editor,
                char: '/',
                allowSpaces: false,
                startOfLine: false,
                items: ({ query }: { query: string }) => {
                    return SLASH_ITEMS.filter((item) =>
                        item.label.toLowerCase().includes(query.toLowerCase())
                    );
                },
                command: ({
                    editor,
                    range,
                    props,
                }: {
                    editor: any;
                    range: any;
                    props: { id: string };
                }) => {
                    editor.chain().focus().deleteRange(range).run();

                    const { id } = props;

                    switch (id) {
                        case 'paragraph':
                            editor.chain().focus().setParagraph().run();
                            break;
                        case 'heading1':
                            editor.chain().focus().toggleHeading({ level: 1 }).run();
                            break;
                        case 'heading2':
                            editor.chain().focus().toggleHeading({ level: 2 }).run();
                            break;
                        case 'heading3':
                            editor.chain().focus().toggleHeading({ level: 3 }).run();
                            break;
                        case 'bulletList':
                            editor.chain().focus().toggleBulletList().run();
                            break;
                        case 'orderedList':
                            editor.chain().focus().toggleOrderedList().run();
                            break;
                        case 'taskList':
                            editor.chain().focus().toggleTaskList().run();
                            break;
                        case 'blockquote':
                            editor.chain().focus().toggleBlockquote().run();
                            break;
                        case 'codeBlock':
                            editor.chain().focus().toggleCodeBlock().run();
                            break;
                        case 'page':
                            if (extensionThis.options.onPageCreate) {
                                extensionThis.options.onPageCreate();
                            }
                            break;
                    }
                },
                render: () => {
                    let component: ReactRenderer | null = null;
                    let popup: HTMLDivElement | null = null;

                    return {
                        onStart: (props: any) => {
                            component = new ReactRenderer(SlashMenuList, {
                                props,
                                editor: props.editor,
                            });

                            popup = document.createElement('div');
                            popup.style.position = 'absolute';
                            popup.style.zIndex = '9999';
                            popup.appendChild(component.element);
                            document.body.appendChild(popup);

                            const rect = props.clientRect?.();
                            if (rect && popup) {
                                popup.style.left = `${rect.left}px`;
                                popup.style.top = `${rect.bottom + 4}px`;
                            }
                        },
                        onUpdate: (props: any) => {
                            component?.updateProps(props);

                            const rect = props.clientRect?.();
                            if (rect && popup) {
                                popup.style.left = `${rect.left}px`;
                                popup.style.top = `${rect.bottom + 4}px`;
                            }
                        },
                        onKeyDown: (props: any) => {
                            if (props.event.key === 'Escape') {
                                popup?.remove();
                                component?.destroy();
                                popup = null;
                                component = null;
                                return true;
                            }
                            return (component?.ref as any)?.onKeyDown(props) ?? false;
                        },
                        onExit: () => {
                            popup?.remove();
                            component?.destroy();
                            popup = null;
                            component = null;
                        },
                    };
                },
            }),
        ];
    },
});

export default SlashCommands;
