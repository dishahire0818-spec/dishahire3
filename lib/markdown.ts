/**
 * Tiny, safe formatter for post content. Everything is HTML-escaped first, then only these are recognised:
 *   ## Heading / ### Subheading, "- " bullet lists, "1. " numbered lists, "> " quotes,
 *   **bold**, *italic*, [link text](https://…). A blank line starts a new paragraph.
 */
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function inline(text: string) {
  return esc(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*(?!\s)(.+?)\*(?!\*)/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\(((?:https?:\/\/|mailto:|\/(?!\/))[^\s)]+)\)/g, (_m, label: string, href: string) => {
      const external = /^https?:/.test(href);
      return `<a href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${label}</a>`;
    });
}

export function renderContent(src: string) {
  const blocks = src.replace(/\r\n/g, "\n").trim().split(/\n{2,}/);
  return blocks
    .map((block) => {
      const lines = block.split("\n");
      if (/^###\s+/.test(block)) return `<h3>${inline(block.replace(/^###\s+/, ""))}</h3>`;
      if (/^##\s+/.test(block)) return `<h2>${inline(block.replace(/^##\s+/, ""))}</h2>`;
      if (lines.every((l) => /^[-*]\s+/.test(l))) return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>`;
      if (lines.every((l) => /^\d+[.)]\s+/.test(l))) return `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\d+[.)]\s+/, ""))}</li>`).join("")}</ol>`;
      if (lines.every((l) => /^>\s?/.test(l))) return `<blockquote><p>${lines.map((l) => inline(l.replace(/^>\s?/, ""))).join("<br>")}</p></blockquote>`;
      return `<p>${lines.map(inline).join("<br>")}</p>`;
    })
    .join("\n");
}

/** Approximate reading time in minutes. */
export const readingTime = (s: string) => Math.max(1, Math.round(s.trim().split(/\s+/).length / 200));
