/**
 * Converts between the prefix-based storage format and Tiptap HTML.
 *
 * Storage format (one block per line):
 *   # Title 1
 *   ## Title 2
 *   ### Title 3
 *   - bullet item
 *   1. numbered item
 *   [] todo item
 *   [x] todo checked item
 *   > toggle/quote item
 *   p: pageId|Page Title
 *   img: url|width|height
 *   vid: url|width|height
 *   ``` code content (newlines escaped as \\n)
 *   plain text
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Convert the prefix-based description string to Tiptap-compatible HTML.
 */
export function prefixToHtml(description: string): string {
  if (!description || description.trim() === '') {
    return '<p></p>';
  }

  const lines = description.split('\n');
  const htmlParts: string[] = [];

  for (const line of lines) {
    // Heading 3 (must check before h2 and h1 since ### starts with # too)
    if (line.startsWith('### ')) {
      const content = line.slice(4);
      htmlParts.push(`<h3>${content}</h3>`);
    }
    // Heading 2
    else if (line.startsWith('## ')) {
      const content = line.slice(3);
      htmlParts.push(`<h2>${content}</h2>`);
    }
    // Heading 1
    else if (line.startsWith('# ')) {
      const content = line.slice(2);
      htmlParts.push(`<h1>${content}</h1>`);
    }
    // Todo checked
    else if (line.startsWith('[x] ')) {
      const content = line.slice(4);
      htmlParts.push(`<ul data-type="taskList"><li data-type="taskItem" data-checked="true"><label><input type="checkbox" checked="checked"><span></span></label><div><p>${content}</p></div></li></ul>`);
    }
    // Todo unchecked
    else if (line.startsWith('[] ')) {
      const content = line.slice(3);
      htmlParts.push(`<ul data-type="taskList"><li data-type="taskItem" data-checked="false"><label><input type="checkbox"><span></span></label><div><p>${content}</p></div></li></ul>`);
    }
    // Bullet list
    else if (line.startsWith('- ')) {
      const content = line.slice(2);
      htmlParts.push(`<ul><li><p>${content}</p></li></ul>`);
    }
    // Numbered list
    else if (line.startsWith('1. ')) {
      const content = line.slice(3);
      htmlParts.push(`<ol><li><p>${content}</p></li></ol>`);
    }
    // Toggle/blockquote
    else if (line.startsWith('> ')) {
      const content = line.slice(2);
      htmlParts.push(`<blockquote><p>${content}</p></blockquote>`);
    }
    // Page link
    else if (line.startsWith('p: ')) {
      const content = line.slice(3);
      const [pageId, ...titleParts] = content.split('|');
      const title = titleParts.join('|') || 'Nova página';
      htmlParts.push(`<div data-type="pageLink" data-page-id="${escapeHtml(pageId)}" data-title="${escapeHtml(title)}"></div>`);
    }
    // Image
    else if (line.startsWith('img: ')) {
      const content = line.slice(5);
      const [url, width = '100%', height = 'auto'] = content.split('|');
      htmlParts.push(`<img src="${escapeHtml(url)}" data-width="${escapeHtml(width)}" data-height="${escapeHtml(height)}" />`);
    }
    // Video
    else if (line.startsWith('vid: ')) {
      const content = line.slice(5);
      const [url, width = '100%', height = '450px'] = content.split('|');
      htmlParts.push(`<div data-type="videoEmbed" data-src="${escapeHtml(url)}" data-width="${escapeHtml(width)}" data-height="${escapeHtml(height)}"></div>`);
    }
    // Code block
    else if (line.startsWith('``` ')) {
      const content = line.slice(4).replace(/\\n/g, '\n');
      htmlParts.push(`<pre><code>${escapeHtml(content)}</code></pre>`);
    }
    // Plain text
    else {
      htmlParts.push(`<p>${line}</p>`);
    }
  }

  // Merge consecutive bullet list items into a single <ul>
  return mergeConsecutiveLists(htmlParts.join(''));
}

/**
 * Merge consecutive <ul> or <ol> tags of the same type into one list.
 * Also merge consecutive taskList items.
 */
function mergeConsecutiveLists(html: string): string {
  // Merge consecutive <ul> (non-taskList)
  html = html.replace(/<\/ul>\s*<ul>/g, '');
  // Merge consecutive <ol>
  html = html.replace(/<\/ol>\s*<ol>/g, '');
  // Merge consecutive taskList
  html = html.replace(/<\/ul>\s*<ul data-type="taskList">/g, '');

  return html;
}

/**
 * Convert Tiptap HTML back to the prefix-based storage format.
 */
export function htmlToPrefix(html: string): string {
  if (!html || html.trim() === '') return '';

  // Use DOMParser to parse the HTML
  if (typeof DOMParser === 'undefined') return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const body = doc.body;

  const lines: string[] = [];
  processNode(body, lines);

  return lines.join('\n');
}

function getInnerHtml(node: Node): string {
  // For a simple text node, return the text content
  // For elements, return innerHTML to preserve inline formatting (bold, italic, etc.)
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || '';
  }

  const el = node as Element;

  // If node is a <p> with no meaningful children, use innerHTML
  if (el.tagName === 'P' || el.tagName === 'DIV') {
    return el.innerHTML;
  }

  return el.innerHTML;
}

function processNode(node: Node, lines: string[]) {
  const children = Array.from(node.childNodes);

  for (const child of children) {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent?.trim();
      if (text) {
        lines.push(text);
      }
      continue;
    }

    if (child.nodeType !== Node.ELEMENT_NODE) continue;

    const el = child as Element;
    const tagName = el.tagName.toUpperCase();

    switch (tagName) {
      case 'H1':
        lines.push(`# ${el.innerHTML}`);
        break;
      case 'H2':
        lines.push(`## ${el.innerHTML}`);
        break;
      case 'H3':
        lines.push(`### ${el.innerHTML}`);
        break;
      case 'P':
        lines.push(el.innerHTML === '<br>' ? '' : el.innerHTML);
        break;
      case 'BLOCKQUOTE':
        // Get inner text from the <p> inside blockquote
        {
          const p = el.querySelector('p');
          lines.push(`> ${p ? p.innerHTML : el.innerHTML}`);
        }
        break;
      case 'PRE':
        // Code block
        {
          const code = el.querySelector('code');
          const codeText = code ? code.textContent || '' : el.textContent || '';
          // Escape newlines for storage
          lines.push(`\`\`\` ${codeText.replace(/\n/g, '\\n')}`);
        }
        break;
      case 'UL':
        // Check if it's a task list
        if (el.getAttribute('data-type') === 'taskList') {
          const items = el.querySelectorAll('li[data-type="taskItem"]');
          items.forEach((item) => {
            const checked = item.getAttribute('data-checked') === 'true';
            const p = item.querySelector('p');
            const content = p ? p.innerHTML : item.textContent || '';
            lines.push(checked ? `[x] ${content}` : `[] ${content}`);
          });
        } else {
          // Regular bullet list
          const items = el.querySelectorAll(':scope > li');
          items.forEach((item) => {
            const p = item.querySelector('p');
            const content = p ? p.innerHTML : item.innerHTML;
            lines.push(`- ${content}`);
          });
        }
        break;
      case 'OL':
        {
          const items = el.querySelectorAll(':scope > li');
          items.forEach((item) => {
            const p = item.querySelector('p');
            const content = p ? p.innerHTML : item.innerHTML;
            lines.push(`1. ${content}`);
          });
        }
        break;
      case 'IMG':
        {
          const src = el.getAttribute('src') || '';
          const width = el.getAttribute('data-width') || '100%';
          const height = el.getAttribute('data-height') || 'auto';
          lines.push(`img: ${src}|${width}|${height}`);
        }
        break;
      case 'DIV':
        {
          const type = el.getAttribute('data-type');
          if (type === 'pageLink') {
            const pageId = el.getAttribute('data-page-id') || '';
            const title = el.getAttribute('data-title') || 'Nova página';
            lines.push(`p: ${pageId}|${title}`);
          } else if (type === 'videoEmbed') {
            const src = el.getAttribute('data-src') || '';
            const width = el.getAttribute('data-width') || '100%';
            const height = el.getAttribute('data-height') || '450px';
            lines.push(`vid: ${src}|${width}|${height}`);
          } else {
            // Generic div, recurse
            processNode(el, lines);
          }
        }
        break;
      default:
        // Recurse into unknown elements
        processNode(el, lines);
        break;
    }
  }
}
