/**
 * Tiny, dependency-free markdown-ish -> HTML renderer shared by the chat
 * window and the report tabs.
 *
 * Why this exists: the LLM (and our own templated assistant messages) write
 * lightweight markdown — **bold**, `code`, "- " bullets, "## " headings —
 * but if that text is dropped into the DOM as plain text, the user sees the
 * raw punctuation characters (**, `, -, ##) cluttering the response instead
 * of actual formatting. This renders those tokens into real HTML so the
 * user only ever sees clean, formatted prose.
 *
 * Safe against injection: all `&`, `<`, `>` are escaped BEFORE any of the
 * markdown patterns are turned into tags, so arbitrary user-typed text
 * (e.g. echoed chat input) can never introduce real HTML/script tags.
 */
export function markdownish(text: string): string {
  if (!text) return ''

  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Headings: "## Heading"
  html = html.replace(/^## (.*)$/gm, '<h4 style="margin: 10px 0 6px; color: var(--text-primary);">$1</h4>')

  // Bold: **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // Inline code: `text`
  html = html.replace(
    /`([^`]+)`/g,
    '<code style="background: var(--bg-tertiary); padding: 1px 6px; border-radius: 4px; font-size: 0.85em;">$1</code>'
  )

  // Italics: *text* (single asterisk, not already consumed by the bold rule above)
  html = html.replace(/\*([^*\n]+)\*/g, '<em>$1</em>')

  // Bullet lists: "- item"
  html = html.replace(/^- (.*)$/gm, '<div style="padding-left: 14px;">&bull; $1</div>')

  // Line breaks
  html = html.replace(/\n/g, '<br/>')

  return html
}

/**
 * Truncate text to a natural word boundary and append a single ellipsis
 * character — but ONLY when the text was actually cut short. Plain
 * `str.substring(0, n) + '...'` (used in a few places previously) appended
 * three literal dots even when the text was already shorter than the
 * limit, and could double up on top of a sentence that already ended in
 * punctuation (e.g. "...done.." or "...done...").
 */
export function truncateSmart(text: string, maxLen: number): string {
  if (!text) return ''
  if (text.length <= maxLen) return text

  const cut = text.slice(0, maxLen)
  const lastSpace = cut.lastIndexOf(' ')
  const clean = lastSpace > maxLen * 0.6 ? cut.slice(0, lastSpace) : cut

  return clean.replace(/[\s.,;:!?]+$/, '') + '\u2026'
}
