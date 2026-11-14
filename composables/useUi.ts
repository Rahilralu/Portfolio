export const useContact = () => {
  const open = useState('contact-open', () => false)
  return { open, openContact: () => { open.value = true }, closeContact: () => { open.value = false } }
}
export const useNav = () => {
  const open = useState('nav-open', () => false)
  return { open, openNav: () => { open.value = true }, closeNav: () => { open.value = false } }
}
// which skill room is open. Doors.vue owns the walk-in/walk-out scene and answers `req`.
export const useDoor = () => {
  const active = useState<string | null>('door-active', () => null) // the room being shown
  const walking = useState('door-walking', () => false) // a zoom is running: header + cord step aside
  const req = useState<{ kind: 'open' | 'leave'; id?: string; n: number } | null>('door-req', () => null)
  return {
    active, walking, req,
    openDoor: (id: string) => { req.value = { kind: 'open', id, n: Date.now() } },
    closeDoor: () => { req.value = { kind: 'leave', n: Date.now() } },
  }
}
export const useTheme = () => {
  const mode = useState<'dark' | 'light'>('mode', () => 'dark')
  const sync = () => { mode.value = document.documentElement.dataset.mode === 'light' ? 'light' : 'dark' }
  // `to` forces a mode; `from` is where the colour wave starts (the bulb), in viewport px
  const toggle = (from?: { x: number; y: number }, to?: 'dark' | 'light') => {
    const next = to || (mode.value === 'dark' ? 'light' : 'dark')
    if (next === mode.value) return
    const apply = () => {
      mode.value = next
      document.documentElement.dataset.mode = next
      try { localStorage.setItem('mode', next) } catch {}
    }
    const d = document as any
    if (!d.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return apply()
    const x = from?.x ?? innerWidth - 80, y = from?.y ?? 120
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    const t = d.startViewTransition(apply)
    t.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 950, easing: 'cubic-bezier(.65,0,.25,1)', pseudoElement: '::view-transition-new(root)' },
      )
    }).catch(() => {})
  }
  return { mode, toggle, sync }
}
export const useScrollTo = () => {
  const nuxt = useNuxtApp() as any
  return (target: string | HTMLElement, offset = 0) => {
    const el = typeof target === 'string' ? (document.querySelector(target) as HTMLElement | null) : target
    if (!el) return
    nuxt.$lenis ? nuxt.$lenis.scrollTo(el, { offset, duration: 0.95, easing: (x: number) => 1 - Math.pow(1 - x, 3) }) : el.scrollIntoView({ behavior: 'smooth' })
  }
}
// lock page scroll while a layer is open
export const useScrollLock = (flag: Ref<boolean>) => {
  watch(flag, (v) => {
    const l = (useNuxtApp() as any).$lenis
    document.documentElement.style.overflow = v ? 'hidden' : ''
    v ? l?.stop() : l?.start()
  })
}

// where the visitor is: the open room, else the home section nearest the top of the screen. `track()` is called once (TopBar).
export const useSection = () => {
  const { active } = useDoor()
  const route = useRoute()
  const sec = useState('section', () => 'home')
  const current = computed(() => (route.name === 'legal' ? '' : active.value || sec.value))
  const track = () => {
    const ids = ['works', 'leetcode', 'story', 'contact']
    const f = () => {
      let hit = 'home'
      for (const id of ids) { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top <= innerHeight * 0.4) hit = id }
      sec.value = hit
    }
    addEventListener('scroll', f, { passive: true }); f()
    onBeforeUnmount(() => removeEventListener('scroll', f))
  }
  return { current, track }
}
// keeps Tab inside an open overlay and hands focus back to whatever opened it
export const useFocusTrap = (el: Ref<HTMLElement | undefined>, open: Ref<boolean>) => {
  let opener: HTMLElement | null = null
  const onKey = (e: KeyboardEvent) => {
    const box = el.value; if (e.key !== 'Tab' || !box) return
    const f = [...box.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,textarea,[tabindex]:not([tabindex="-1"])')].filter((n) => n.offsetParent !== null)
    if (!f.length) return
    const a = document.activeElement
    if (e.shiftKey && (a === f[0] || a === box)) { e.preventDefault(); f[f.length - 1].focus() }
    else if (!e.shiftKey && a === f[f.length - 1]) { e.preventDefault(); f[0].focus() }
  }
  watch(open, (v) => {
    if (v) { opener = document.activeElement as HTMLElement | null; addEventListener('keydown', onKey) }
    else { removeEventListener('keydown', onKey); opener?.focus?.(); opener = null }
  })
  onBeforeUnmount(() => removeEventListener('keydown', onKey))
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
// navigation that works from any page: leaves an open room (zooming back out), goes home if needed, then scrolls or walks in
export const useGo = () => {
  const route = useRoute()
  const scrollTo = useScrollTo()
  const { active, walking, closeDoor, openDoor } = useDoor()
  const leaveRoom = () => new Promise<void>((res) => {
    const done = () => !active.value && !walking.value
    if (done()) return res()
    if (active.value) closeDoor()
    const stop = watch([active, walking], () => { if (done()) { stop(); res() } })
  })
  const home = async () => {
    await leaveRoom()
    if (route.name === 'legal') { await navigateTo('/'); await sleep(550) }
  }
  return {
    go: async (sel: string, offset = 0) => { await home(); scrollTo(sel, offset) },
    toDoor: async (id: string) => {
      if (active.value === id) return
      if (!active.value) await home() // from the legal page etc.; from a room Doors.vue swaps rooms itself
      openDoor(id)
    },
    top: () => {
      const room = document.querySelector('.roomv') as HTMLElement | null
      room ? room.scrollTo({ top: 0, behavior: 'smooth' }) : scrollTo('#main')
    },
  }
}
