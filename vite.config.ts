import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GSAP + Motion in one bundle is fine for a locally served deck.
  build: { chunkSizeWarningLimit: 800 },
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
})
