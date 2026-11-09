export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: true,
  nitro: {
    preset: 'static',
    prerender: { routes: ['/frontend-developer', '/backend-engineer', '/ai-builder', '/ui-ux-designer'] },
  },
  routeRules: { '/home': { redirect: '/' } },
  css: ['~/assets/css/main.css'],
  runtimeConfig: { public: { clarityId: '' } }, // NUXT_PUBLIC_CLARITY_ID
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Muhammed Rahil Nazar — Full Stack Developer',
      meta: [
        { name: 'description', content: 'Muhammed Rahil Nazar, full stack developer in Kochi, India. Vue, Nuxt, React, Node.js and AI-integrated systems.' },
        { name: 'theme-color', content: '#1A1818' },
        { property: 'og:title', content: 'Muhammed Rahil Nazar — Full Stack Developer' },
        { property: 'og:type', content: 'profile' },
      ],
      link: [
        { rel: 'icon', href: '/profile.png' },
        { rel: 'apple-touch-icon', href: '/profile.png' },
        { rel: 'preload', href: '/fonts/onest-latin.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
      ],
      script: [{
        tagPosition: 'head',
        innerHTML: "try{var m=localStorage.getItem('mode')||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.dataset.mode=m}catch(e){document.documentElement.dataset.mode='dark'}",
      }],
      noscript: [{ innerHTML: '<style>.rv,.line>span,.io{opacity:1!important;transform:none!important}.loader{display:none!important}</style>' }],
    },
  },
})
