import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    target: 'es2020',
    sourcemap: false,
    // Aucun fichier (police, image) n'est intégré en « data: » : compatible avec la règle de sécurité.
    assetsInlineLimit: 0,
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.js'],
  },
})
