import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // listen on 0.0.0.0 so localhost and 127.0.0.1 both work
    port: 5173,
    open: true,        // open browser automatically when you run npm run dev
  },
})
