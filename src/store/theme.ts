import { create } from 'zustand'

export type Theme = 'light' | 'dark'
export const THEME_STORAGE_KEY = 'deck-theme'

interface ThemeState {
  theme: Theme
}

// index.html sets data-theme before React loads, so we start in sync with the page.
const initial: Theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'

export const useThemeStore = create<ThemeState>()(() => ({ theme: initial }))

export function readStoredTheme(): Theme | null {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}

/** Applies a theme to <html> and the store; `persist` saves it as an explicit user choice. */
export function applyTheme(theme: Theme, persist: boolean) {
  const root = document.documentElement
  root.dataset.theme = theme
  root.style.colorScheme = theme
  useThemeStore.setState({ theme })
  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      /* storage unavailable: theme still applies for this session */
    }
  }
}
