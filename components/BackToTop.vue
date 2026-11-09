<template>
  <Transition name="pop">
    <button v-if="show" class="top" aria-label="Back to top" @click="scrollTo('#main')">
      <svg class="ring" viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" pathLength="100" :stroke-dasharray="`${pct} 100`" transform="rotate(-90 18 18)" /></svg>
      <span>↑</span>
    </button>
  </Transition>
</template>
<script setup lang="ts">
const show = ref(false), pct = ref(0), scrollTo = useScrollTo()
onMounted(() => {
  const f = () => {
    const max = document.documentElement.scrollHeight - innerHeight
    pct.value = max > 0 ? Math.round((scrollY / max) * 100) : 0
    show.value = scrollY > innerHeight * 0.6
  }
  addEventListener('scroll', f, { passive: true }); f()
  onBeforeUnmount(() => removeEventListener('scroll', f))
})
</script>
<style scoped>
.top{position:fixed;right:1.6rem;bottom:1.6rem;z-index:55;width:3.4rem;height:3.4rem;border-radius:50%;display:grid;place-items:center;background:var(--btn-bg);color:var(--btn-fg);font-size:1.2rem;box-shadow:0 .6rem 1.6rem rgba(0,0,0,.35)}
.ring{position:absolute;inset:-.25rem;width:calc(100% + .5rem);height:calc(100% + .5rem);color:var(--accent-from)}
.pop-enter-active,.pop-leave-active{transition:opacity .3s,transform .3s var(--e-spring)}
.pop-enter-from,.pop-leave-to{opacity:0;transform:scale(.8)}
</style>
