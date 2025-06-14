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
    allowedHosts: ["dee9-2803-9800-b842-811a-c531-d4bf-468c-87fc.ngrok-free.app"]
  }
})
