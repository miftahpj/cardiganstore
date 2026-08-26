// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss'],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'WOOMAN by Khania | Toko Cardigan & Outfit Wanita Tasikmalaya',
      htmlAttrs: {
        lang: 'id'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'WOOMAN by Khania - Toko cardigan Tasikmalaya. Outfit manis untuk perempuan yang suka tampil elegan, feminin, dan effortless. Born to Stand, Styled to Shine.'
        },
        {
          name: 'keywords',
          content: 'whooman, toko cardigan, cardigan Tasikmalaya, toko cardigan Tasikmalaya, wooman, wooman khania, outfit wanita, cardigan wanita'
        },
        { name: 'author', content: 'WOOMAN by Khania' },
        { property: 'og:title', content: 'WOOMAN by Khania | Born to Stand, Styled to Shine' },
        {
          property: 'og:description',
          content: 'Toko cardigan Tasikmalaya. Outfit manis buat perempuan yang suka tampil elegan, feminin, dan effortless.'
        },
        { property: 'og:type', content: 'website' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    adminUsername: process.env.ADMIN_USERNAME || 'Wooman.id',
    adminPassword: process.env.ADMIN_PASSWORD || 'Wooman2025',
    adminSessionSecret: process.env.ADMIN_SESSION_SECRET || 'wooman-khania-ganti-secret-ini-di-env',
    public: {}
  }
})
