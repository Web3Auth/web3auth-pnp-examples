import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      crypto: "empty-module",
      buffer: "buffer/",
    },
  },
  define: {
    global: "globalThis",
  },
  build: {
    target: 'esnext',
  },
  server: {
    proxy: {
      "/auth": {
        target: process.env.SERVER_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
