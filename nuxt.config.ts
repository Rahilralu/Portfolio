const SITE = (process.env.NUXT_PUBLIC_SITE_URL || 'https://rahilralu.dev').replace(/\/$/, '')

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: true,
  nitro: {
    preset: 'static',
    prerender: { routes: ['/frontend-developer', '/backend-engineer', '/ai-builder', '/ui-ux-designer', '/legal'] },
  },
  routeRules: { '/home': { redirect: '/' } },
  css: ['~/assets/css/main.css'],
  runtimeConfig: { public: { clarityId: '', siteUrl: SITE } }, // NUXT_PUBLIC_CLARITY_ID, NUXT_PUBLIC_SITE_URL
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Muhammed Rahil Nazar | Full Stack Developer, Kochi',
      meta: [
        { name: 'description', content: 'Portfolio of Muhammed Rahil Nazar, a full stack developer in Kochi, India building web apps with Vue, Nuxt, React and Node.js, plus AI and RAG systems.' },
        { name: 'author', content: 'Muhammed Rahil Nazar' },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1' },
        { name: 'theme-color', content: '#1A1818' },
        { property: 'og:site_name', content: 'Muhammed Rahil Nazar' },
        { property: 'og:locale', content: 'en_IN' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: `${SITE}/profile.png` },
        { property: 'og:image:width', content: '1024' },
        { property: 'og:image:height', content: '855' },
        { property: 'og:image:alt', content: 'Portrait of Muhammed Rahil Nazar' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:creator', content: '@ralu_rahil' },
        { name: 'twitter:image', content: `${SITE}/profile.png` },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preload', href: '/fonts/onest-latin.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
      ],
      script: [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: 'Muhammed Rahil Nazar', inLanguage: 'en', publisher: { '@id': `${SITE}/#person` } },
            { '@type': 'Person', '@id': `${SITE}/#person`, name: 'Muhammed Rahil Nazar', url: `${SITE}/`, image: `${SITE}/profile.png`, jobTitle: 'Full Stack Developer',
              description: 'Full stack developer in Kochi, India working with Vue, Nuxt, React, Node.js and AI-integrated systems.',
              address: { '@type': 'PostalAddress', addressLocality: 'Kochi', addressRegion: 'Kerala', addressCountry: 'IN' },
              alumniOf: { '@type': 'CollegeOrUniversity', name: 'Cochin University of Science and Technology' },
              knowsAbout: ['Vue.js', 'Nuxt', 'React', 'Node.js', 'TypeScript', 'ERPNext', 'Frappe', 'RAG', 'LLM applications'],
              sameAs: ['https://github.com/Rahilralu', 'https://www.linkedin.com/in/muhammed-rahil-nazar-ab9393316/', 'https://x.com/ralu_rahil', 'https://leetcode.com/u/Rahil_ralu/'] },
          ],
        }),
      }, {
        tagPosition: 'head',
        innerHTML: "try{var m=localStorage.getItem('mode')||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.dataset.mode=m}catch(e){document.documentElement.dataset.mode='dark'}",
      }],
      noscript: [{ innerHTML: '<style>.rv,.line>span,.io{opacity:1!important;transform:none!important}.loader{display:none!important}</style>' }],
    },
  },
})
