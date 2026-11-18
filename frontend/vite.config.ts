
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173, // Changed from 3000 to Vite's default 5173
    allowedHosts: true,
  },
})