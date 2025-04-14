import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      crypto: "crypto-browserify",
      assert: "assert",
      http: "empty-module",
      https: "empty-module",
      os: "empty-module",
      url: "empty-module",
      zlib: "empty-module",
      stream: "stream-browserify",
    },
  },
  define: {
    global: "globalThis",
  },
});
