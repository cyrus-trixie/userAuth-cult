import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 5173,
    host: true  // This binds to 0.0.0.0 so Render can detect it
  }
})
