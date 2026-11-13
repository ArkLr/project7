import { create } from 'zustand'

export type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
}

// The app is light-only: index.html pins data-theme="light" on <html>.
export const useThemeStore = create<ThemeState>()(() => ({ theme: 'light' }))
