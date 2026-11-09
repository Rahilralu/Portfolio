<template>
  <div v-if="on" class="cur" :class="{ hide, link, down }" aria-hidden="true">
    <i ref="ring" class="cur__ring"></i>
    <i ref="dot" class="cur__dot"></i>
  </div>
</template>
<script setup lang="ts">
// dot + trailing ring for mouse users only; touch devices and reduced-motion keep the normal pointer
const on = ref(false), hide = ref(true), link = ref(false), down = ref(false)
const ring = ref<HTMLElement>(), dot = ref<HTMLElement>()
onMounted(() => {
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return
  on.value = true
  document.documentElement.classList.add('has-cursor')
  let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, raf = 0
  const slow = !matchMedia('(prefers-reduced-motion: reduce)').matches
  const frame = () => {
    rx += (x - rx) * (slow ? 0.18 : 1); ry += (y - ry) * (slow ? 0.18 : 1)
    if (ring.value) ring.value.style.transform = `translate(${rx.toFixed(1)}px,${ry.toFixed(1)}px)`
    raf = requestAnimationFrame(frame)
  }
  const move = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    x = e.clientX; y = e.clientY
    if (dot.value) dot.value.style.transform = `translate(${x}px,${y}px)`
    const t = e.target as HTMLElement | null
    hide.value = !!t?.closest?.('.doorway, input, textarea, select')
    link.value = !!t?.closest?.('a, button, [role="button"], .pc, .shot, label')
  }
  const out = () => { hide.value = true }
  const dn = () => { down.value = true }, up = () => { down.value = false }
  addEventListener('pointermove', move, { passive: true })
  addEventListener('pointerdown', dn); addEventListener('pointerup', up)
  document.documentElement.addEventListener('mouseleave', out)
  raf = requestAnimationFrame(frame)
  onBeforeUnmount(() => {
    cancelAnimationFrame(raf); document.documentElement.classList.remove('has-cursor')
    removeEventListener('pointermove', move); removeEventListener('pointerdown', dn); removeEventListener('pointerup', up)
    document.documentElement.removeEventListener('mouseleave', out)
  })
})
</script>
<style scoped>
.cur{position:fixed;inset:0;z-index:9999;pointer-events:none;mix-blend-mode:difference;transition:opacity .25s}
.cur.hide{opacity:0}
.cur i{position:absolute;left:0;top:0;display:block;border-radius:50%;will-change:transform}
.cur__dot{width:.5rem;height:.5rem;margin:-.25rem 0 0 -.25rem;background:#fff}
.cur__ring{width:2.25rem;height:2.25rem;margin:-1.125rem 0 0 -1.125rem;border:1.5px solid #fff;transition:width .3s var(--e-soft),height .3s var(--e-soft),margin .3s var(--e-soft),background .3s}
.cur.link .cur__ring{width:3.5rem;height:3.5rem;margin:-1.75rem 0 0 -1.75rem;background:rgba(255,255,255,.18)}
.cur.down .cur__ring{width:1.6rem;height:1.6rem;margin:-.8rem 0 0 -.8rem}
</style>
