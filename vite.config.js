import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

import { resolve } from 'path'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        reader: resolve(__dirname, 'reader.html'),
        characters: resolve(__dirname, 'characters.html'),
        chapters: resolve(__dirname, 'chapters.html'),
        settings: resolve(__dirname, 'settings.html'),
      }
    }
  }
})
