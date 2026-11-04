/** Reads `#3` → 2 (zero-based). Returns null when the hash is not a slide number. */
export function parseHash(hash = window.location.hash): number | null {
  const match = /^#(\d+)/.exec(hash)
  if (!match) return null
  return Math.max(0, Number(match[1]) - 1)
}
