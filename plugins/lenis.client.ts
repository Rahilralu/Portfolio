import Lenis from 'lenis'

export default defineNuxtPlugin(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, touchMultiplier: 1.4 })
  const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf) }
  requestAnimationFrame(raf)
  return { provide: { lenis } }
})
