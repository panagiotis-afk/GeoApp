import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For GitHub Pages: base must be /repo-name/ (set in deploy workflow). Local dev: base is /
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  server: {
    host: true,        // listen on 0.0.0.0 so localhost and 127.0.0.1 both work
    port: 5173,
    open: true,        // open browser automatically when you run npm run dev
    proxy: {
      "/api": { target: "http://localhost:3001", changeOrigin: true },
    },
  },
})
