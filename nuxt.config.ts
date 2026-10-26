// https://nuxt.com/docs/api/configuration/nuxt-config
const isDev = process.env.NODE_ENV !== 'production'

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxt/fonts', '@pinia/nuxt', '@vueuse/nuxt/module', 'nuxt-security'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      titleTemplate: '%s — ZAREY',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0d0d0d' },
        { name: 'description', content: 'ZAREY — streetwear indépendant. Oval Tee, longsleeves et drops en quantité limitée.' },
        { property: 'og:site_name', content: 'ZAREY' },
        { property: 'og:image', content: '/media/og.jpg' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
    },
  },

  tailwindcss: { cssPath: '~/assets/css/main.css' },

  fonts: {
    families: [
      { name: 'Anton', provider: 'google', weights: [400] },
      { name: 'Archivo', provider: 'google', weights: [400, 500, 700, 900] },
      { name: 'Bagel Fat One', provider: 'google', weights: [400] },
    ],
  },

  runtimeConfig: {
    // Secrets serveur uniquement : NUXT_STRIPE_SECRET_KEY / NUXT_STRIPE_WEBHOOK_SECRET
    stripeSecretKey: '',
    stripeWebhookSecret: '',
    public: {
      // URL canonique du site (NUXT_PUBLIC_SITE_URL). Sert aux redirections Stripe :
      // jamais dérivée de l'en-tête Host, pour éviter l'injection d'hôte.
      siteUrl: 'http://localhost:3000',
      tiktokUrl: 'https://www.tiktok.com/@zareypi',
      instagramUrl: 'https://www.instagram.com/zarey.pi/',
    },
  },

  security: {
    nonce: true,
    headers: {
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'strict-dynamic'", "'nonce-{{nonce}}'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'blob:'],
        'media-src': ["'self'"],
        'font-src': ["'self'", 'data:'],
        'connect-src': isDev ? ["'self'", 'ws:', 'wss:'] : ["'self'"],
        'form-action': ["'self'"],
        'frame-src': ["'none'"],
        'frame-ancestors': ["'none'"],
        'object-src': ["'none'"],
        'base-uri': ["'none'"],
        'upgrade-insecure-requests': false,
      },
      referrerPolicy: 'strict-origin-when-cross-origin',
      xFrameOptions: 'DENY',
      permissionsPolicy: {
        camera: [],
        microphone: [],
        geolocation: [],
        payment: [],
      },
    },
    rateLimiter: { tokensPerInterval: 150, interval: 300000 },
    requestSizeLimiter: { maxRequestSizeInBytes: 64 * 1024, maxUploadFileRequestInBytes: 64 * 1024 },
  },

  routeRules: {
    '/api/checkout': {
      security: { rateLimiter: { tokensPerInterval: 10, interval: 60000 } },
    },
    // Le corps Stripe est vérifié par signature : pas de filtre XSS qui pourrait le réécrire
    '/api/webhooks/stripe': {
      security: { xssValidator: false },
    },
    '/media/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
  },

  vite: {
    optimizeDeps: { include: ['gsap', 'gsap/ScrollTrigger', 'lenis'] },
  },
})
