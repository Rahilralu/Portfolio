<template>
  <section id="works" ref="root" class="doors" :class="{ pre: !seen, in: seen, focus: hover !== null, compact }">
    <div class="doors__tex"></div>
    <div class="doors__pin">
      <div class="shell doors__wall" ref="wall">
        <h2 class="paint">Magic happens <br class="mbr" />behind the doors</h2>
        <p class="doors__sub">My work, one door per skill.<span class="swipe"> Swipe along the wall →</span></p>
        <ul class="doors__row" ref="row" @scroll.passive="onRowScroll">
          <li v-for="(d, i) in doors" :key="d.id" :ref="(el) => (units[i] = el as HTMLElement)" class="unit" :class="{ on: hover === i || (mobile && cur === i), press: pressed === i }"
              :style="{ '--i': i, '--door': light[d.id], '--door-dk': info[d.id].dk, '--glow': info[d.id].glow }">
            <button class="doorway" :class="{ ajar: opening === d.id }" :disabled="busyUi" :aria-disabled="busyUi" :aria-label="`Open ${d.title}`"
              @pointerenter="enter(i, $event)" @pointermove="move" @pointerleave="leaveHover"
              @pointerdown="pressed = i" @pointerup="pressed = -1" @click="openDoor(d.id)" @focus="hover = i" @blur="hover = null">
              <span class="casing"></span>
              <span class="opening"><span class="room"></span>
                <span class="door"><span class="door__flute"></span><span class="door__shade"></span>
                  <span class="plate">{{ d.plate.replace('\n', ' ') }}</span>
                  <span class="handle"><span class="handle__lever"></span><span class="handle__lock"></span></span>
                </span>
              </span>
              <span class="sill"></span>
            </button>
          </li>
          <template v-if="!mobile">
            <li v-for="(d, i) in doors" :key="d.id + 'i'" class="dinfo" :class="{ on: hover === i }" :style="infoStyle(i)">
              <h3 class="dinfo__h">{{ info[d.id].heading }}</h3>
              <p class="dinfo__t">{{ info[d.id].tag }}</p>
              <ul class="dinfo__p"><li v-for="b in info[d.id].bullets" :key="b">{{ b }}</li></ul>
            </li>
          </template>
        </ul>
        <div v-if="mobile" ref="dm" class="dinfo dinfo--m on">
          <h3 class="dinfo__h">{{ info[doors[cur].id].heading }}</h3>
          <p class="dinfo__t">{{ info[doors[cur].id].tag }}</p>
          <ul class="dinfo__p"><li v-for="b in info[doors[cur].id].bullets" :key="b">{{ b }}</li></ul>
        </div>
        <div class="doors__dots" aria-hidden="true"><i v-for="(d, i) in doors" :key="d.id" :class="{ on: cur === i }"></i></div>
      </div>
    </div>
    <div class="door-cursor" ref="dc" :class="{ on: hover !== null && !mobile }">Click to enter</div>
  </section>
</template>
<script setup lang="ts">
const info = doorInfo
const light: Record<string, string> = { frontend: '#3a5a92', backend: '#6e4c5f', ai: '#8c9c7e', uiux: '#c5683b' }
const { openDoor, closeDoor, active, walking, req } = useDoor()
const nuxt = useNuxtApp() as any
const root = ref<HTMLElement>(), wall = ref<HTMLElement>(), row = ref<HTMLElement>(), dc = ref<HTMLElement>()
const units = ref<HTMLElement[]>([])
const compact = ref(false), dm = ref<HTMLElement>()
const seen = ref(false), hover = ref<number | null>(null), pressed = ref(-1), opening = ref<string | null>(null), cur = ref(0), mobile = ref(false), busyUi = ref(false)
const pos = reactive<Record<number, { left?: string; right?: string; top: string }>>({})
function infoStyle(i: number) {
  const p = pos[i]; if (!p) return {}
  return mobile.value ? {} : { left: p.left, right: p.right, top: p.top }
}
function layout() {
  mobile.value = innerWidth < 640
  const rr = row.value?.getBoundingClientRect(); if (!rr) return
  units.value.forEach((u, i) => {
    const r = u.getBoundingClientRect(); const gap = parseFloat(getComputedStyle(document.documentElement).fontSize) * 2
    const top = `${r.top - rr.top + r.height * 0.28}px`
    pos[i] = i < 2 ? { left: `${r.right - rr.left + gap}px`, top } : { right: `${rr.right - r.left + gap}px`, top }
  })
}
function enter(i: number, e: PointerEvent) { if (e.pointerType === 'mouse' && !busy) hover.value = i; move(e) }
function leaveHover() { hover.value = null; pressed.value = -1 }
function move(e: PointerEvent) { if (dc.value) dc.value.style.transform = `translate(${e.clientX + 16}px,${e.clientY + 16}px)` }
function onRowScroll() {
  const el = row.value; if (!el || !mobile.value) return
  const mid = el.scrollLeft + el.clientWidth / 2; let best = 0, d = 1e9
  units.value.forEach((u, i) => { const c = u.offsetLeft + u.offsetWidth / 2; if (Math.abs(c - mid) < d) { d = Math.abs(c - mid); best = i } })
  cur.value = best
}

// ---------------------------------------------------------------------------------------------
// Walking through a door. One engine drives clicks, the nav, the footer and "next door":
//   scroll to the wall -> press the lever -> the door swings inward -> the whole wall scales up around
//   the gap beside the open door until the room behind fills the screen -> the room page takes over in
//   the same colour. Leaving plays it backwards. Nothing is allowed to start while it is running.
// ---------------------------------------------------------------------------------------------
let busy = false, inRoom = false, walkRaf = 0
let pending: { kind: 'open' | 'leave'; id?: string } | null = null
let afterLeave: string | null = null
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3)
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

// freeze the page without touching layout; the room itself may still scroll
const swallow = (e: Event) => { if (!(e.target as HTMLElement)?.closest?.('.roomv')) e.preventDefault() }
const keysStop = (e: KeyboardEvent) => { if (!inRoom && ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(e.key)) e.preventDefault() }
function holdScroll(on: boolean) {
  const l = nuxt.$lenis
  if (on) { l?.stop(); addEventListener('wheel', swallow, { passive: false }); addEventListener('touchmove', swallow, { passive: false }); addEventListener('keydown', keysStop) }
  else { l?.start(); removeEventListener('wheel', swallow); removeEventListener('touchmove', swallow); removeEventListener('keydown', keysStop) }
}

async function settle(top: number) {
  const t0 = performance.now()
  await new Promise<void>((res) => { const f = () => (Math.abs(scrollY - top) > 24 && performance.now() - t0 < 1600 ? requestAnimationFrame(f) : res()); requestAnimationFrame(f) })
}

async function enterDoor(id: string) {
  const i = doors.findIndex((d) => d.id === id)
  if (i < 0 || busy) return
  busy = true; busyUi.value = true; hover.value = null
  const sec = root.value!
  // 1. face the wall (on phones: the scroll position where this door is centred in the pinned wall)
  if (mobile.value) { mForce = i; mApply() }
  const top = mobile.value ? mobY(i) : sec.getBoundingClientRect().top + scrollY
  if (Math.abs(scrollY - top) > 4) {
    if (nuxt.$lenis) nuxt.$lenis.scrollTo(top, { duration: 0.9, easing: easeOut }); else scrollTo({ top, behavior: reduced() ? 'auto' : 'smooth' })
    await settle(top)
  }
  if (mobile.value) await sleep(reduced() ? 0 : 300)
  layout()
  // 2. lever down, then the door swings inward
  pressed.value = i; setTimeout(() => { if (pressed.value === i) pressed.value = -1 }, 380)
  await sleep(reduced() ? 0 : 170)
  opening.value = id
  await sleep(reduced() ? 0 : 590)
  through(i, id)
}

function through(i: number, id: string) {
  const sec = root.value!, u = units.value[i]
  const r = (u.querySelector('.opening') as HTMLElement).getBoundingClientRect()
  const dr = (u.querySelector('.door') as HTMLElement).getBoundingClientRect()
  // the gap: from the open leaf's far edge to the right side of the opening
  const gapL = Math.min(Math.max(dr.right, r.left), r.right - 6)
  const gw = Math.max(r.right - gapL, 10), gh = r.height
  const cx = (gapL + r.right) / 2, cy = r.top + gh * 0.5
  const sr = sec.getBoundingClientRect()
  holdScroll(true); walking.value = true
  sec.style.transformOrigin = `${cx - sr.left}px ${cy - sr.top}px`
  sec.classList.add('through')
  const tx = innerWidth / 2 - cx, ty = innerHeight / 2 - cy
  const sEnd = Math.max(innerWidth / gw, innerHeight / gh) * 1.15
  const t0 = performance.now(), D = reduced() ? 1 : 1500
  let handed = false
  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / D), e = easeInOut(p), sc = Math.exp(Math.log(sEnd) * e)
    const f = Math.min(1, e * 1.6) // drift the doorway to the centre early on
    sec.style.transform = `translate(${(tx * f).toFixed(2)}px, ${(ty * f).toFixed(2)}px) scale(${sc.toFixed(4)})`
    if (!handed && (sc >= sEnd / 1.15 || p >= 1)) {
      handed = true
      // the dark/white room now fills the screen: the room page takes over in the same colour
      inRoom = true; active.value = id; walking.value = false
    }
    if (p < 1) walkRaf = requestAnimationFrame(step)
    else { busy = false; busyUi.value = false; runPending() } // settled inside the room; the scene stays zoomed behind it
  }
  walkRaf = requestAnimationFrame(step)
}

async function leaveRoom() {
  if (!inRoom || busy) return
  busy = true; busyUi.value = true; inRoom = false; walking.value = true; holdScroll(true)
  const sec = root.value!
  if (instant) { instant = false; const y = mobile.value ? mobY(cur.value) : sec.getBoundingClientRect().top + scrollY; nuxt.$lenis ? nuxt.$lenis.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y) }
  active.value = null // the room fades away over the dark
  await sleep(reduced() ? 0 : 880)
  cancelAnimationFrame(walkRaf)
  const m = /translate\(([-\d.]+)px, ([-\d.]+)px\) scale\(([\d.]+)\)/.exec(sec.style.transform) || [0, 0, 0, 1]
  const X = +m[1], Y = +m[2], S = Math.max(1, +m[3]), t0 = performance.now(), D = reduced() ? 1 : 1300
  await new Promise<void>((res) => {
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / D), e = easeOut(p), sc = Math.exp(Math.log(S) * (1 - e))
      sec.style.transform = `translate(${(X * (1 - e)).toFixed(2)}px, ${(Y * (1 - e)).toFixed(2)}px) scale(${sc.toFixed(4)})`
      p < 1 ? requestAnimationFrame(step) : res()
    }
    requestAnimationFrame(step)
  })
  sec.style.transform = ''; sec.style.transformOrigin = ''; sec.classList.remove('through')
  opening.value = null // the door swings shut
  mForce = -1; mApply()
  walking.value = false; holdScroll(false); busy = false; busyUi.value = false
  runPending()
}

function runPending() {
  const r = pending; pending = null
  if (r) dispatch(r)
}
function dispatch(r: { kind: 'open' | 'leave'; id?: string }) {
  if (busy) { pending = r; return }
  if (r.kind === 'leave') return void leaveRoom()
  if (inRoom) { pending = r; return void leaveRoom() } // open another door from inside a room: back out first
  if (r.id) enterDoor(r.id)
}

// ---------------------------------------------------------------------------------------------
// Phones: the wall stays pinned while you scroll. Each stretch of scrolling (or a sideways swipe) slides
// one door into the middle and swaps the notes above it. `.doors` is 100svh + 3 x 70svh tall, `.doors__pin` sticks.
// ---------------------------------------------------------------------------------------------
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const STEPS = doors.length - 1
let mForce = -1, mCur = 0, mV = 0, mStep = 0, mRaf = 0, mLast = 0, mSettle = 0, swipeLock = 0, touching = false
let lastSY = 0, lastST = 0, gestF = 0 // scroll gesture bookkeeping for the snap
const hasScrollEnd = typeof window !== 'undefined' && 'onscrollend' in window
const mSpan = () => Math.max(1, root.value!.offsetHeight - innerHeight)
const mProg = () => clamp(-root.value!.getBoundingClientRect().top / mSpan(), 0, 1)
const mobY = (i: number) => root.value!.getBoundingClientRect().top + scrollY + (clamp(i, 0, STEPS) / STEPS) * mSpan()
// rest on each door, glide between them
const mDwell = (f: number) => { const i = Math.floor(f), t = f - i, u = clamp((t - 0.1) / 0.8, 0, 1); return i + u * u * (3 - 2 * u) }
const mTarget = () => (mForce >= 0 ? mForce : mDwell(mProg() * STEPS))
function mFrame(now: number) {
  mRaf = 0
  const r = row.value
  if (!r) return
  if (!mobile.value || units.value.length < 2) { r.style.transform = ''; return }
  const dt = Math.min(64, now - (mLast || now)); mLast = now
  const t = mTarget()
  if (reduced()) { mCur = t; mV = 0 } else {
    // critically damped spring with a speed limit: fast scrolling glides, never lurches
    const k = 120, c = 2 * Math.sqrt(k)
    for (let left = dt / 1000; left > 0; left -= 1 / 120) {
      const h = Math.min(left, 1 / 120)
      mV += ((t - mCur) * k - mV * c) * h
      mV = clamp(mV, -4.5, 4.5)
      mCur += mV * h
    }
    if (Math.abs(t - mCur) < 0.0015 && Math.abs(mV) < 0.01) { mCur = t; mV = 0 }
  }
  if (!mStep) mStep = units.value[1].offsetLeft - units.value[0].offsetLeft
  r.style.transform = `translate3d(${(-mCur * mStep).toFixed(2)}px,0,0)`
  cur.value = clamp(Math.round(t), 0, STEPS)
  if (mCur !== t || mV !== 0) mRaf = requestAnimationFrame(mFrame)
}
function mApply() { if (!mRaf) mRaf = requestAnimationFrame(mFrame) }
// the door takes the height left under the text; on short screens the checklist steps aside for it
async function mSize() {
  const pin = root.value?.querySelector('.doors__pin') as HTMLElement | null, r = row.value
  if (!pin || !r) return
  if (!mobile.value) { pin.style.removeProperty('--uw'); compact.value = false; mStep = 0; mApply(); return }
  const fit = () => {
    const pr = pin.getBoundingClientRect(), rr = r.getBoundingClientRect()
    const avail = pr.bottom - parseFloat(getComputedStyle(pin).paddingBottom) - rr.top - parseFloat(getComputedStyle(r).paddingTop) - 2
    return Math.min(innerWidth * 0.6, avail / 2.25)
  }
  compact.value = false; await nextTick()
  let w = fit()
  if (w < 140) { compact.value = true; await nextTick(); w = fit() }
  pin.style.setProperty('--uw', Math.max(110, w).toFixed(1) + 'px')
  mStep = units.value.length > 1 ? units.value[1].offsetLeft - units.value[0].offsetLeft : 0
  mApply()
}
const snapTo = (top: number) => (nuxt.$lenis ? nuxt.$lenis.scrollTo(top, { duration: clamp(0.35 + (Math.abs(top - scrollY) / innerHeight) * 0.5, 0.35, 0.8), easing: easeOut }) : scrollTo({ top, behavior: reduced() ? 'auto' : 'smooth' }))
// when scrolling stops part-way between two doors, ease the page onto the nearest one
function mSnapSettle() {
  if (!mobile.value || busy || inRoom || mForce >= 0 || performance.now() < swipeLock) return
  if (touching) { if (!hasScrollEnd) mSettle = window.setTimeout(mSnapSettle, 120); return }
  const r = root.value!.getBoundingClientRect(); if (r.top > 0 || r.bottom < innerHeight) return // only while the wall is pinned
  // a flick carries on to the next door in its direction; a small nudge falls back
  const f = mProg() * STEPS, d = f - gestF, fl = Math.floor(f), fr = f - fl
  const to = d > 0.04 ? (fr > 0.25 ? fl + 1 : fl) : d < -0.04 ? (fr < 0.75 ? fl : fl + 1) : Math.round(f)
  const want = mobY(to)
  if (Math.abs(scrollY - want) > 2) snapTo(want)
}
// scrollend can fire between bursts of scrolling; give a new scroll event 140ms to cancel the snap
const onScrollEnd = () => { clearTimeout(mSettle); mSettle = window.setTimeout(mSnapSettle, 140) }
// when scrolling stops part-way between two doors, ease the page onto the nearest one
function mFromScroll() {
  if (!mobile.value || busy) return
  mApply()
  const now = performance.now()
  if (now - lastST > 250 && !touching) gestF = mProg() * STEPS // a new gesture starts here
  lastSY = scrollY; lastST = now
  clearTimeout(mSettle)
  // never fight momentum: wait for the browser's scrollend where it exists, otherwise for a quiet gap
  if (!hasScrollEnd) mSettle = window.setTimeout(mSnapSettle, 180)
}
let tx0 = 0, ty0 = 0
const onTouchStart = (e: TouchEvent) => { touching = true; tx0 = e.touches[0].clientX; ty0 = e.touches[0].clientY; gestF = mProg() * STEPS }
const onTouchEnd = (e: TouchEvent) => {
  touching = false
  if (!mobile.value || busy || inRoom || mForce >= 0) return
  if (!hasScrollEnd) { clearTimeout(mSettle); mSettle = window.setTimeout(mSnapSettle, 180) }
  const dx = e.changedTouches[0].clientX - tx0, dy = e.changedTouches[0].clientY - ty0
  if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.2) return
  swipeLock = performance.now() + 700 // a sideways swipe steps exactly one door
  clearTimeout(mSettle)
  snapTo(mobY(Math.round(mProg() * STEPS) + (dx < 0 ? 1 : -1)))
}
// the notes cross-fade when the door changes
watch(cur, () => { if (mobile.value && !reduced()) dm.value?.animate([{ opacity: 0, transform: 'translateY(.4rem)' }, { opacity: 1, transform: 'none' }], { duration: 360, easing: 'cubic-bezier(.16,1,.3,1)' }) })

watch(req, (r) => { if (r) dispatch({ kind: r.kind, id: r.id }) })

// URL <-> room. The page is the same for `/` and `/<room>`; the URL follows the open room, and back/forward drives it.
const route = useRoute(), router = useRouter()
const roomOfRoute = () => doors.find((d) => d.path === route.params.room)?.id ?? null
watch(active, (id) => {
  if (route.name !== 'room') return
  if (!id && pending?.kind === 'open') return // switching doors: the next room pushes the URL
  const want = id ? doors.find((d) => d.id === id)!.path : '', have = (route.params.room as string) || ''
  if (want !== have) router.push(want ? `/${want}` : '/')
})
watch(() => route.params.room, () => {
  if (route.name !== 'room') return
  const id = roomOfRoute()
  if (id === active.value) return
  if (id) openDoor(id); else if (active.value) closeDoor()
})
// opened straight from a link: put the room up at once (under the loader), the doors scene waits behind it
let instant = false
function openAtOnce(id: string) {
  const i = doors.findIndex((d) => d.id === id); if (i < 0) return
  instant = true; inRoom = true; opening.value = id; cur.value = i
  if (mobile.value) { mForce = i; mApply() }
  holdScroll(true); active.value = id
}

onMounted(() => {
  layout(); addEventListener('resize', layout)
  const onResize = () => { mSize(); mFromScroll() }
  mSize(); document.fonts?.ready.then(mSize); mCur = mTarget(); mApply()
  addEventListener('resize', onResize); addEventListener('scroll', mFromScroll, { passive: true }); if (hasScrollEnd) addEventListener('scrollend', onScrollEnd)
  root.value?.addEventListener('touchstart', onTouchStart, { passive: true }); addEventListener('touchend', onTouchEnd, { passive: true })
  onBeforeUnmount(() => { removeEventListener('resize', onResize); removeEventListener('scroll', mFromScroll); removeEventListener('scrollend', onScrollEnd); removeEventListener('touchend', onTouchEnd); cancelAnimationFrame(mRaf); clearTimeout(mSettle) })
  const first = roomOfRoute(); if (first && route.name === 'room') openAtOnce(first)
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { seen.value = true; io.disconnect(); setTimeout(layout, 1400) } }, { threshold: innerWidth < 640 ? 0.04 : 0.18 })
  root.value && io.observe(root.value)
  onBeforeUnmount(() => { io.disconnect(); removeEventListener('resize', layout); cancelAnimationFrame(walkRaf); if (busy || inRoom) holdScroll(false) })
})
</script>
<style scoped>
.doors{position:relative;z-index:1;margin-top:-2rem;padding-top:calc(2rem + 5.25rem);overflow:hidden;
  background:linear-gradient(180deg,rgba(0,0,0,.05) 0%,transparent 22%,transparent 78%,rgba(0,0,0,.07) 100%),linear-gradient(180deg,var(--wall-hi) 0%,var(--wall) 55%)}
.doors.through{z-index:60;overflow:hidden;will-change:transform;pointer-events:none;box-shadow:0 0 0 100vmax var(--wall)}
.doors.through .door-cursor{display:none}
.doors__tex{position:absolute;inset:0;pointer-events:none;opacity:.55;background:
  radial-gradient(rgba(var(--fg-rgb),.05) 1px,transparent 1.4px) 0 0/9px 9px,
  radial-gradient(60% 40% at 50% 0%,rgba(255,255,255,.18),transparent 70%)}
html[data-mode="dark"] .doors__tex{opacity:.7;background:radial-gradient(rgba(255,255,255,.035) 1px,transparent 1.4px) 0 0/9px 9px,radial-gradient(50% 35% at 50% 0%,rgba(255,236,214,.05),transparent 70%)}
.doors__wall{position:relative;display:flex;flex-direction:column;align-items:center;gap:1.4rem}
.paint{position:relative;z-index:3;pointer-events:none;text-align:center;font-weight:700;letter-spacing:-.03em;line-height:.95;color:var(--paint);font-size:2.6rem;max-width:14ch;text-wrap:balance;padding:.08em 0 .14em;clip-path:inset(-20% -6% -30% -6%)}
@media(min-width:640px){.paint{font-size:4rem;max-width:none}}@media(min-width:1024px){.paint{font-size:4.75rem}}
.doors.pre .paint{clip-path:inset(-20% 100% -30% -6%)}
.doors.in .paint{transition:clip-path 1.5s cubic-bezier(.65,0,.25,1) .1s}
.mbr{display:none}@media(max-width:639.98px){.mbr{display:inline}}
.doors__sub{font-size:1.0625rem;color:rgba(var(--fg-rgb),.62);margin-bottom:2.2rem;text-align:center}
.swipe{display:none;color:var(--foreground)}
.doors__row{--gap:1.5rem;position:relative;z-index:2;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--gap);align-items:end;width:100%}
@media(min-width:1024px){.doors__row{--gap:3rem}}
.doors__row::after{content:"";position:absolute;left:-50vw;right:-50vw;bottom:0;height:1.5rem;z-index:-1;
  background:linear-gradient(180deg,rgba(255,255,255,.55) 0,rgba(255,255,255,.55) 1px,rgba(0,0,0,.06) 2px,transparent 4px,transparent 7px,rgba(0,0,0,.05) 8px,rgba(255,255,255,.25) 9px,transparent 11px,rgba(0,0,0,.08) 100%),var(--base);
  box-shadow:0 -1px 0 rgba(0,0,0,.07),0 -.5rem .9rem -.45rem rgba(0,0,0,.16)}
html[data-mode="dark"] .doors__row::after{background:linear-gradient(180deg,rgba(255,255,255,.06) 0,rgba(255,255,255,.06) 1px,rgba(0,0,0,.3) 2px,transparent 4px,transparent 7px,rgba(0,0,0,.25) 8px,transparent 11px,rgba(0,0,0,.3) 100%),var(--base);box-shadow:0 -1px 0 rgba(0,0,0,.4),0 -.5rem .9rem -.45rem rgba(0,0,0,.5)}
.doors__dots{display:none}

.unit{position:relative;container-type:inline-size;width:100%;max-width:min(17.5rem,calc((100svh - 19.5rem)/2.25));justify-self:center;transition:opacity .9s var(--e-soft),transform 1.1s var(--e-soft);transition-delay:calc(var(--i)*110ms + .35s)}
.doors.pre .unit{opacity:0;transform:translateY(1.5rem)}
.unit::before{content:"";position:absolute;left:-35%;right:-35%;top:-18%;height:62%;pointer-events:none;z-index:-1;background:radial-gradient(50% 50% at 50% 30%,var(--lamp),transparent 100%);transition:opacity .5s ease}
.doorway{position:relative;display:block;width:100%;aspect-ratio:1/2.25;cursor:pointer;border-radius:50cqi 50cqi 0 0;-webkit-tap-highlight-color:transparent;transition:opacity .5s var(--e-soft),filter .5s var(--e-soft)}
@media(hover:hover) and (pointer:fine){.doorway{cursor:none}}
.doorway:focus-visible{outline:2px solid var(--accent);outline-offset:6px}
.doors.focus .unit:not(.on) .doorway{opacity:.03;filter:saturate(.2)}
.doors.focus .unit:not(.on)::before{opacity:0}
.casing{position:absolute;inset:0;border-radius:50cqi 50cqi 0 0;transition:box-shadow .5s var(--e-soft);
  background:linear-gradient(90deg,rgba(0,0,0,.07),rgba(255,255,255,.18) 3cqi,transparent 6cqi,transparent calc(100% - 6cqi),rgba(0,0,0,.05) calc(100% - 3cqi),rgba(0,0,0,.12)),linear-gradient(180deg,rgba(255,255,255,.35),transparent 30%),var(--casing);
  box-shadow:inset 0 0 0 1.1cqi rgba(255,255,255,.28),inset 0 0 0 1.5cqi rgba(0,0,0,.07),inset 0 0 0 3.6cqi rgba(255,255,255,.12),inset 0 0 0 4.1cqi rgba(0,0,0,.08),0 0 0 1px rgba(0,0,0,.06),1.5cqi 2.5cqi 4.5cqi rgba(26,24,24,.2),-.5cqi 1cqi 3cqi rgba(26,24,24,.08)}
html[data-mode="dark"] .casing{background:linear-gradient(90deg,rgba(0,0,0,.25),rgba(255,255,255,.04) 3cqi,transparent 6cqi,transparent calc(100% - 6cqi),rgba(0,0,0,.3)),linear-gradient(180deg,rgba(255,255,255,.05),transparent 30%),var(--casing);box-shadow:inset 0 0 0 1.1cqi rgba(255,255,255,.05),inset 0 0 0 1.5cqi rgba(0,0,0,.25),inset 0 0 0 3.6cqi rgba(255,255,255,.03),inset 0 0 0 4.1cqi rgba(0,0,0,.22),0 0 0 1px rgba(0,0,0,.4),1.5cqi 2.5cqi 5cqi rgba(0,0,0,.6)}
.casing::before{content:"";position:absolute;left:-1cqi;right:-1cqi;bottom:0;height:11cqi;z-index:1;background:var(--casing);-webkit-mask:linear-gradient(90deg,#000 0 8.5cqi,transparent 8.5cqi calc(100% - 8.5cqi),#000 calc(100% - 8.5cqi));mask:linear-gradient(90deg,#000 0 8.5cqi,transparent 8.5cqi calc(100% - 8.5cqi),#000 calc(100% - 8.5cqi));box-shadow:inset 0 .5cqi 0 rgba(255,255,255,.4),inset 0 1cqi 0 rgba(0,0,0,.08),inset 0 -.6cqi 1cqi rgba(0,0,0,.1)}
.casing::after{content:"";position:absolute;left:4.6cqi;right:4.6cqi;top:4.6cqi;bottom:0;border-radius:45.4cqi 45.4cqi 0 0;border:.45cqi solid rgba(0,0,0,.07);border-bottom:0}
html[data-mode="dark"] .casing::after{border-color:rgba(255,255,255,.05)}
.opening{position:absolute;left:7.5cqi;right:7.5cqi;top:7.5cqi;bottom:0;perspective:160cqi;perspective-origin:50% 42%;display:block}
.room{position:absolute;inset:0;overflow:hidden;border-radius:42.5cqi 42.5cqi 0 0;background:var(--room);box-shadow:inset 2cqi 0 4cqi var(--room-sh),inset 0 2cqi 4cqi var(--room-sh);display:block}
.room::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .5s var(--e-soft);box-shadow:inset 0 0 5cqi var(--rim),inset 0 0 1.2cqi var(--rim)}
.door{position:absolute;inset:0;display:block;transform-origin:0 50%;backface-visibility:visible;transform-style:preserve-3d;border-radius:42.5cqi 42.5cqi 0 0;--dc:var(--door);transition:transform .6s var(--e-spring),box-shadow .5s var(--e-soft);
  background:linear-gradient(100deg,rgba(255,255,255,.1) 0%,rgba(255,255,255,0) 30%,rgba(0,0,0,.18) 100%),var(--dc);box-shadow:inset 0 0 0 .3cqi rgba(0,0,0,.28),inset .6cqi 0 0 rgba(255,255,255,.05)}
html[data-mode="dark"] .door{--dc:var(--door-dk)}
.door__flute{position:absolute;left:8cqi;right:8cqi;top:8cqi;bottom:9cqi;border-radius:34.5cqi 34.5cqi 1.2cqi 1.2cqi;display:block;
  background:repeating-linear-gradient(90deg,rgba(255,255,255,.075) 0,rgba(255,255,255,.02) 1cqi,rgba(0,0,0,.13) 2.1cqi,rgba(255,255,255,.075) 2.8cqi);
  box-shadow:inset 0 0 0 .3cqi rgba(0,0,0,.16),inset 1cqi 1.2cqi 2cqi rgba(0,0,0,.28),inset -.6cqi -.6cqi 1cqi rgba(255,255,255,.07)}
.door__shade{position:absolute;inset:0;border-radius:inherit;background:#000;opacity:0;pointer-events:none;display:block}
.unit.on .casing{box-shadow:0 0 0 1px rgba(0,0,0,.06),2cqi 5cqi 9cqi var(--lift),-1cqi 2cqi 5cqi rgba(0,0,0,.08),inset 0 1px 0 rgba(255,255,255,.55)}
.unit.on .door{transform:rotateY(22deg);box-shadow:inset 0 0 0 .35cqi rgba(0,0,0,.2),inset -2.5cqi 0 3cqi rgba(0,0,0,.18),4cqi 0 7cqi rgba(0,0,0,.45)}
.unit.on .door__shade{opacity:.2}
.unit.on .room::after{opacity:1}
/* inward: positive rotation swings the free edge away from the viewer, into the room */
.ajar .door{transform:rotateY(86deg)!important;transition:transform .75s cubic-bezier(.3,.7,.25,1),box-shadow .5s;filter:brightness(.78)}
.plate{position:absolute;left:50%;top:31%;translate:-50% -50%;width:58cqi;padding:2.6cqi 4cqi;border-radius:.9cqi;z-index:1;display:block;text-align:center;font-size:5.4cqi;font-weight:600;line-height:1.15;letter-spacing:.09em;text-transform:uppercase;text-wrap:balance;color:#2b2112;text-shadow:0 .28cqi 0 rgba(255,238,196,.55),0 -.15cqi 0 rgba(0,0,0,.25);
  background:linear-gradient(160deg,#efdfb2 0%,#c9a866 28%,#e3cc92 48%,#a98747 72%,#d2b67a 100%);box-shadow:0 .5cqi 1cqi rgba(0,0,0,.4),inset 0 .3cqi 0 rgba(255,250,228,.7),inset 0 -.3cqi 0 rgba(88,62,22,.45)}
.plate::before,.plate::after{content:"";position:absolute;top:50%;width:1.6cqi;height:1.6cqi;margin-top:-.8cqi;border-radius:50%;background:radial-gradient(circle at 35% 35%,#fff3cf,#8f6f33 70%);box-shadow:0 .15cqi .2cqi rgba(0,0,0,.4)}
.plate::before{left:1.8cqi}.plate::after{right:1.8cqi}
.handle{position:absolute;right:7cqi;top:59%;width:9.4cqi;height:9.4cqi;border-radius:50%;z-index:1;display:block;
  background:radial-gradient(circle at 36% 30%,#fff6dc 0,#e6cb8a 14%,#b8934c 40%,#80602a 70%,#4d3816 100%);box-shadow:0 0 0 .35cqi rgba(0,0,0,.22),.9cqi 1.5cqi 2cqi rgba(0,0,0,.45),inset -.7cqi -.9cqi 1.1cqi rgba(40,26,6,.55),inset .5cqi .6cqi .8cqi rgba(255,248,222,.5)}
.handle::before{content:"";position:absolute;inset:2.3cqi;border-radius:50%;background:radial-gradient(circle at 38% 32%,#fff3d0,#c9a45c 45%,#6f5122 100%);box-shadow:.4cqi .7cqi .9cqi rgba(0,0,0,.45),inset 0 0 0 .2cqi rgba(255,240,200,.35)}
.handle__lever{position:absolute;right:3.6cqi;top:2.75cqi;width:23cqi;height:3.9cqi;border-radius:2.4cqi 1.6cqi 1.6cqi 2.4cqi;transform-origin:calc(100% - 1.9cqi) 50%;display:block;
  background:linear-gradient(180deg,#fff5d6 0%,#ecd395 16%,#c39d55 42%,#8e6a2d 72%,#5c4119 100%);box-shadow:.3cqi 2.4cqi 2.2cqi rgba(0,0,0,.38),0 .4cqi .4cqi rgba(0,0,0,.25),inset 0 -.3cqi .4cqi rgba(50,32,8,.45);transition:transform .18s cubic-bezier(.3,.7,.4,1)}
.handle__lever::before{content:"";position:absolute;left:-.4cqi;top:-.45cqi;width:7cqi;height:4.8cqi;border-radius:2.4cqi;background:linear-gradient(180deg,#fff5d6 0%,#e8cd8c 18%,#bf9850 45%,#86632a 75%,#5c4119 100%);box-shadow:0 .5cqi .6cqi rgba(0,0,0,.3)}
.unit.press .handle__lever{transform:rotate(-32deg)}
.handle__lock{position:absolute;left:50%;top:calc(100% + 6.5cqi);width:5.4cqi;height:10.5cqi;margin-left:-2.7cqi;border-radius:2.7cqi;display:block;background:radial-gradient(ellipse at 38% 28%,#fff3d0 0,#d9b86f 22%,#a07b37 55%,#5e4419 100%);box-shadow:0 0 0 .3cqi rgba(0,0,0,.2),.6cqi 1cqi 1.4cqi rgba(0,0,0,.42),inset -.4cqi -.6cqi .8cqi rgba(40,26,6,.5),inset .3cqi .4cqi .5cqi rgba(255,248,222,.45)}
.handle__lock::before{content:"";position:absolute;left:50%;top:30%;width:2cqi;height:2cqi;margin-left:-1cqi;border-radius:50%;background:#140d04}
.handle__lock::after{content:"";position:absolute;left:50%;top:calc(30% + 1.3cqi);width:1cqi;height:3cqi;margin-left:-.5cqi;border-radius:0 0 .3cqi .3cqi;background:#140d04}
.sill{position:absolute;left:3cqi;right:3cqi;bottom:0;height:1cqi;z-index:2;pointer-events:none;border-radius:1cqi;background:rgba(var(--glow),.95);filter:blur(.7cqi);opacity:.4;transition:opacity .6s var(--e-soft);display:block}
html[data-mode="dark"] .sill{opacity:.75}.unit.on .sill{opacity:1}

.dinfo{position:absolute;z-index:3;pointer-events:none;opacity:0;transform:translateY(.6rem);transition:opacity .35s ease,transform .5s var(--e-soft);max-width:22rem;--dinfo-accent:#6B4F4F}
html[data-mode="dark"] .dinfo{--dinfo-accent:#D9C6C6}
.dinfo.on{opacity:1;transform:none;transition:opacity .45s ease .08s,transform .6s var(--e-soft) .08s}
.dinfo__h{font-size:2rem;font-weight:600;line-height:1.05;letter-spacing:-.02em;color:var(--foreground);margin:0 0 .45rem}
.dinfo__t{font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:.8125rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--dinfo-accent);margin-bottom:1.15rem}
.dinfo__p{display:flex;flex-direction:column;gap:.5rem;font-size:1rem;font-weight:450;line-height:1.35;color:var(--foreground)}
.dinfo__p li{display:flex;align-items:center;gap:.7rem}
.dinfo__p li::before{content:"✓";flex:none;display:grid;place-items:center;width:1.05rem;height:1.05rem;border-radius:50%;background:var(--dinfo-accent);color:var(--background);font-size:.62rem;font-weight:700}
.dinfo.on li{animation:liIn .5s var(--e-soft) backwards}
.dinfo.on li:nth-child(2){animation-delay:.05s}.dinfo.on li:nth-child(3){animation-delay:.1s}.dinfo.on li:nth-child(4){animation-delay:.15s}
@keyframes liIn{from{opacity:0;transform:translateX(-.5rem)}}
@media(min-width:1280px){.dinfo__h{font-size:2.25rem}.dinfo__p{font-size:1.0625rem}}

.door-cursor{position:fixed;left:0;top:0;z-index:90;pointer-events:none;padding:.6rem 1rem;border-radius:9999px;background:var(--btn-bg);color:var(--btn-fg);font-size:.8125rem;font-weight:500;white-space:nowrap;box-shadow:0 .5rem 1.5rem -.5rem rgba(0,0,0,.45);opacity:0;transition:opacity .18s ease}
.door-cursor.on{opacity:1}

@media(max-width:639.98px){
  /* phone layout: the wall pins while you scroll through it; the row is moved by Doors.vue (translate3d) */
  .doors{padding-top:0;overflow:clip;height:calc(100svh + 3 * 70svh)}
  .doors.through{overflow:clip}
  .doors__pin{--uw:min(56vw,calc((100svh - 31rem) / 2.25));--ug:calc(50vw - var(--uw) / 2 + .75rem);position:sticky;top:0;height:100svh;touch-action:pan-y;padding-top:4.75rem;padding-bottom:3.25rem;display:flex;flex-direction:column;justify-content:flex-start;overflow:clip}
  .doors__pin::after{content:"";position:absolute;left:0;right:0;bottom:0;height:3.25rem;z-index:1;pointer-events:none;
    background:linear-gradient(180deg,rgba(255,255,255,.55) 0,rgba(255,255,255,.55) 1px,rgba(0,0,0,.06) 2px,transparent 4px,transparent 7px,rgba(0,0,0,.05) 8px,rgba(255,255,255,.25) 9px,transparent 11px,rgba(0,0,0,.08) 100%),var(--base);
    box-shadow:0 -1px 0 rgba(0,0,0,.07),0 -.5rem .9rem -.45rem rgba(0,0,0,.16)}
  .doors__sub{display:none}
  .doors__wall{gap:1rem;align-items:stretch}
  .paint{font-size:2.15rem;text-align:left;align-self:flex-start;max-width:none;margin:.25rem 0 .5rem}
  .dinfo--m{order:1;position:relative;width:100%;max-width:100%;margin:.9rem 0 0;padding-top:1rem;border-top:1px solid rgba(var(--fg-rgb),.1);text-align:left;opacity:1;transform:none;min-height:10.5rem}
  .dinfo--m .dinfo__h{font-size:1.5rem;line-height:1.1;margin-bottom:.35rem}
  .dinfo--m .dinfo__t{margin-bottom:.85rem;font-size:.625rem;letter-spacing:.08em;line-height:1.4}
  .dinfo--m .dinfo__p{font-size:.875rem;line-height:1.35;gap:.45rem}
  .dinfo--m .dinfo__p li{gap:.6rem}
  .doors.compact .dinfo__p{display:none}
  .doors.compact .dinfo--m{min-height:0}
  .doors__dots{order:2;display:flex;gap:.4rem;margin:.25rem 0 0}
  .doors__dots i{width:.4rem;height:.4rem;border-radius:999px;background:rgba(var(--fg-rgb),.2);transition:width .35s var(--e-soft),background .35s}
  .doors__dots i.on{width:1.3rem;background:var(--foreground)}
  .doors__row{order:3;display:flex;gap:var(--ug);overflow:visible;padding-inline:calc(50% - var(--uw) / 2);margin-inline:-1.25rem;width:calc(100% + 2.5rem);padding-top:2rem;margin-top:-1rem;will-change:transform;align-items:flex-end}
  .doors__row::after{display:none}
  .unit{flex:0 0 var(--uw);max-width:none}
  .unit::before{display:none}
  .unit.on .door{transform:none;box-shadow:inset 0 0 0 .3cqi rgba(0,0,0,.28),inset .6cqi 0 0 rgba(255,255,255,.05)}
  .unit.on .door__shade{opacity:0}
  .door-cursor{display:none}
}
@media(prefers-reduced-motion:reduce){.door,.casing,.room::after{transition:none}}
</style>
