<template>
  <div class="cord" :class="{ dragging, away }">
    <svg ref="svgEl" class="cv" width="96" height="520" viewBox="0 0 96 520" aria-hidden="true">
      <defs>
        <pattern id="rp" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="#cdbfa6" /><rect width="3" height="6" fill="#9c8d72" /></pattern>
        <radialGradient id="bb" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#e3a86f" /><stop offset=".6" stop-color="#8a4a24" /><stop offset="1" stop-color="#5a2e14" /></radialGradient>
        <radialGradient id="gl" cx=".5" cy=".5" r=".5"><stop offset="0" :stop-color="mode === 'dark' ? 'rgba(255,214,150,.55)' : 'rgba(255,214,150,.0)'" /><stop offset="1" stop-color="rgba(255,214,150,0)" /></radialGradient>
      </defs>
      <g :transform="`rotate(${angle} 48 0)`">
        <line x1="48" y1="0" x2="48" :y2="y - 18" stroke="url(#rp)" stroke-width="3.2" stroke-linecap="round" />
        <g :transform="`translate(48 ${y})`">
          <circle r="34" fill="url(#gl)" />
          <ellipse cx="0" cy="4" rx="9" ry="3" fill="rgba(0,0,0,.25)" />
          <path d="M-4 -20 L4 -20 L10 -4 Q11 14 0 20 Q-11 14 -10 -4 Z" fill="url(#bb)" />
          <path d="M-5 -10 Q-2 -14 1 -9" stroke="rgba(255,255,255,.4)" stroke-width="1.4" fill="none" stroke-linecap="round" />
        </g>
      </g>
    </svg>
    <button ref="hitEl" class="hit" :style="hitStyle" :aria-label="`Pull to switch to ${mode === 'dark' ? 'light' : 'dark'} mode`" :aria-pressed="mode === 'light'"
      @pointerdown="down" @keydown.enter.prevent="pullToggle()" @keydown.space.prevent="pullToggle()"></button>
  </div>
</template>
<script setup lang="ts">
const { mode, toggle } = useTheme()
const { active, walking } = useDoor()
const away = computed(() => walking.value)
const hitEl = ref<HTMLElement>()
let rest = 150
const y = ref(rest), angle = ref(0), dragging = ref(false)
let vy = 0, va = 0, raf = 0, startY = 0, moved = 0, last = 0
const hitStyle = computed(() => {
  const r = (angle.value * Math.PI) / 180
  return { left: `${48 + Math.sin(r) * y.value}px`, top: `${Math.cos(r) * y.value}px` }
})
function loop(t: number) {
  const dt = Math.min(0.032, (t - last) / 1000 || 0.016); last = t
  if (!dragging.value) {
    // cord length spring + pendulum swing, both damped
    vy += (rest - y.value) * 90 * dt; vy *= Math.pow(0.002, dt); y.value += vy * dt
    va += (-angle.value * 38) * dt; va *= Math.pow(0.12, dt); angle.value += va * dt
  }
  if (dragging.value || Math.abs(rest - y.value) > 0.05 || Math.abs(vy) > 0.05 || Math.abs(angle.value) > 0.02 || Math.abs(va) > 0.05) raf = requestAnimationFrame(loop)
  else { y.value = rest; angle.value = 0; raf = 0 }
}
const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop) } }
const bulb = () => { const r = hitEl.value?.getBoundingClientRect(); return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : undefined }
function fire(to?: 'dark' | 'light') { toggle(bulb(), to) }
function pullToggle() { vy = 480; va = 36 * (Math.random() > 0.5 ? 1 : -1); kick(); fire() }
function down(e: PointerEvent) {
  dragging.value = true; startY = e.clientY; moved = 0
  let fired = false
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId); kick()
  const mv = (ev: PointerEvent) => {
    moved = ev.clientY - startY
    y.value = rest + Math.max(-8, Math.min(80, moved)); angle.value = Math.max(-8, Math.min(8, (ev.clientX - e.clientX) / 6))
    // flick it down past the threshold and the light switches right away
    if (!fired && moved > 28) { fired = true; vy = 0; va = 30 * (Math.random() > 0.5 ? 1 : -1); fire() }
  }
  const up = () => {
    removeEventListener('pointermove', mv); removeEventListener('pointerup', up); removeEventListener('pointercancel', up)
    dragging.value = false
    const tap = Math.abs(moved) < 4
    vy = 0; va = angle.value * -2 + (fired || tap ? 28 * (Math.random() > 0.5 ? 1 : -1) : 0); kick()
    if (tap && !fired) fire()
  }
  addEventListener('pointermove', mv); addEventListener('pointerup', up); addEventListener('pointercancel', up)
}
// a shorter cord below 1200px keeps the bulb clear of headings and the room's door counter
const fitRest = () => { const r = innerWidth < 1200 ? 96 : 150; if (r === rest) return; rest = r; if (!dragging.value) kick() }
onMounted(() => {
  fitRest(); y.value = rest; addEventListener('resize', fitRest)
  onBeforeUnmount(() => removeEventListener('resize', fitRest))
  // gentle idle sway so it reads as hanging
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) { va = 5; kick() }
})
onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>
<style scoped>
.cord{position:fixed;top:0;right:max(16px,calc((100vw - 88rem)/2 + 16px));width:96px;height:520px;z-index:107;pointer-events:none;transition:opacity .4s ease}
.cord.away{opacity:0}
.cv{position:absolute;left:0;top:0;width:96px;height:520px;overflow:visible}
.hit{position:absolute;width:72px;height:72px;margin:-36px 0 0 -36px;border-radius:50%;pointer-events:auto;touch-action:none;cursor:grab}
.dragging .hit{cursor:grabbing}
.hit:focus-visible{outline:2px solid var(--accent);outline-offset:-10px}
@media(max-width:1199.98px){.cord{right:6px}}
</style>
