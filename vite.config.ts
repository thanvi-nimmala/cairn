import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // served from https://<user>.github.io/truepay-shell/
  base: '/truepay-shell/',
  plugins: [react()],
  server: { port: 5183 },
})
