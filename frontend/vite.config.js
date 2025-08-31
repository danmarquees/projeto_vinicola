import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // URL do seu backend Django
        changeOrigin: true,
        secure: false,
      }
    }
  }
  server: {
    proxy: {
      "/api": {
        // Redireciona qualquer chamada que comece com /api
        target: "[http://127.0.0.1:8000](http://127.0.0.1:8000)", // Para o seu backend Django
        changeOrigin: true,
      },
    },
  },
});
