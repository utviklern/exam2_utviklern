import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      // Eksplisitt tillat JSX i .js filer
      include: '**/*.{jsx,js}'
    })
  ],
}) 