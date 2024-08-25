// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  vite: {
    define: {
      global: 'globalThis',
    },
  },

  compatibilityDate: "2024-08-08"
});