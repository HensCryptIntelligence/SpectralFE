
// File: frontend/nuxt.config.ts

export default defineNuxtConfig({
  compatibilityDate: '2025-11-27',
  srcDir: 'src/',  
  plugins: [
    '~/plugins/api.js'  
  ]
});

