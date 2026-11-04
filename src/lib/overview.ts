/** Columns used by the overview grid; shared with keyboard navigation (↑/↓ move by a row). */
export function overviewColumns(width = window.innerWidth): number {
  if (width >= 1280) return 4
  if (width >= 768) return 3
  return 2
}
