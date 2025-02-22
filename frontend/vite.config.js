import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['fabric'],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),  // This maps "@" to "src"
    },
  },
  server: {
    port: 5173,
    host: true
  }
})
