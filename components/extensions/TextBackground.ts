import { Mark, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    textBackground: {
      setTextBackground: (color: string) => ReturnType;
      unsetTextBackground: () => ReturnType;
    };
  }
}

const TextBackground = Mark.create({
  name: 'textBackground',

  addAttributes() {
    return {
      backgroundColor: {
        default: null,
        parseHTML: (element) => (element as HTMLElement).style.backgroundColor || null,
        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) return {};
          return { style: `background-color: ${attributes.backgroundColor}` };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[style*=background-color]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setTextBackground:
        (color) =>
        ({ commands }) =>
          commands.setMark(this.name, { backgroundColor: color }),
      unsetTextBackground:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});

export default TextBackground;
