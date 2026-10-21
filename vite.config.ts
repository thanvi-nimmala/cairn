import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // served from https://thanvinimmala.com/cairn/
  base: '/cairn/',
  plugins: [react()],
  server: { port: 5183 },
})
