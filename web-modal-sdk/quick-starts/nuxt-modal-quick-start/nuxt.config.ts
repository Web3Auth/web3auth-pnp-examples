// https://nuxt.com/docs/api/configuration/nuxt-config
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  vite: {
    plugins: [
      nodePolyfills({
        globals: {
          Buffer: true,
          global: true,
        },
      }),
    ],
  },
});
