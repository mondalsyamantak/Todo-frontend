import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/   http://localhost:5173
export default defineConfig({
  server: {
    // proxy: {
    //   '/api': {
    //     target: 'https://todo-backend-4hmo.onrender.com',
    //     changeOrigin: true,
    //     secure: true, // set to false if backend has self-signed HTTPS
    //   },
    // },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: true, // set to false if backend has self-signed HTTPS
      },
    },
  },

  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
})