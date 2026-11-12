// Per-page SEO: title, description, canonical and social tags. Site-wide tags (robots, JSON-LD, twitter card) live in nuxt.config.ts.
export const SITE_NAME = 'Muhammed Rahil Nazar'
export const SITE_DESC = 'Portfolio of Muhammed Rahil Nazar, a full stack developer in Kochi, India building web apps with Vue, Nuxt, React and Node.js, plus AI and RAG systems.'

export function useSeo(opts: () => { path: string; title: string; description?: string }) {
  const base = String(useRuntimeConfig().public.siteUrl).replace(/\/$/, '')
  useHead(() => {
    const { path, title, description = SITE_DESC } = opts()
    const url = base + (path === '/' ? '/' : path)
    return {
      title,
      meta: [
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: url },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
      ],
      link: [{ rel: 'canonical', href: url }],
    }
  })
}
