import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
      tailwindcss(),
  ],
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: ["f25d-2803-9800-b842-811a-f48b-42c8-1e23-266e.ngrok-free.app"]
  }
})
