<template>
  <Teleport to="body">
    <div v-if="mounted" class="navm" data-lenis-prevent :class="{ open: shown }" role="dialog" aria-modal="true" aria-label="Menu" @keydown.esc="closeNav()" ref="root" tabindex="-1">
      <div class="shell navm__top">
        <span class="brand">RN.</span>
        <button class="close-btn" @click="closeNav()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>Close</button>
      </div>
      <nav class="shell navm__nav" aria-label="Menu">
        <ul>
          <li v-for="(it, i) in items" :key="it.label">
            <a class="navm__item" :href="it.href" :aria-current="cur === it.key ? 'location' : undefined" :style="{ '--d': 120 + i * 60 + 'ms' }" @click.exact.prevent="pick(it)"><small class="mono">{{ String(i + 1).padStart(2, '0') }}</small><span>{{ it.label }}</span></a>
          </li>
        </ul>
      </nav>
      <div class="shell navm__bot"><span>Available for work · Remote-first</span><button @click="mail">{{ profile.email }}</button></div>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
const { open, closeNav } = useNav()
const nav = useGo()
const { openContact } = useContact()
const mounted = ref(false), shown = ref(false), root = ref<HTMLElement>()
const { current: cur } = useSection()
const items = [
  { label: 'Home', t: '#main', href: '/', key: 'home' },
  ...doors.map((d) => ({ label: d.nav, door: d.id, href: `/${d.path}`, key: d.id })),
  { label: 'LeetCode', t: '#leetcode', href: '/#leetcode', key: 'leetcode' },
  { label: 'My story', t: '#story', href: '/#story', key: 'story' },
  { label: 'Contact', contact: true, href: '/#contact', key: 'contact' },
] as { label: string; t?: string; door?: string; contact?: boolean; href: string; key: string }[]
useScrollLock(open)
useFocusTrap(root, open)
watch(open, async (v) => {
  if (v) { mounted.value = true; await nextTick(); requestAnimationFrame(() => { shown.value = true; root.value?.focus() }) }
  else { shown.value = false; setTimeout(() => (mounted.value = false), 450) }
})
function pick(it: any) {
  closeNav()
  setTimeout(() => {
    if (it.contact) return openContact()
    if (it.door) return nav.toDoor(it.door)
    nav.go(it.t, it.t === '#main' ? 0 : -30)
  }, 460)
}
const mail = () => { location.href = `mailto:${profile.email}` }
</script>
<style scoped>
.navm{position:fixed;inset:0;z-index:115;display:flex;flex-direction:column;background:var(--ink,#1A1818);color:#fff;opacity:0;transition:opacity .45s var(--e-spring);outline:none}
.navm.open{opacity:1}
.navm__top{display:flex;align-items:center;justify-content:space-between;padding-block:1.25rem}
@media(min-width:640px){.navm__top{padding-block:1.5rem}}
.brand{font-size:1.375rem;font-weight:600;letter-spacing:-.01em}
.close-btn{display:inline-flex;align-items:center;gap:.5rem;border:1px solid rgba(255,255,255,.15);border-radius:var(--radius-control);padding:.5rem 1rem;font-size:.75rem;font-weight:500;text-transform:uppercase;letter-spacing:.05em;color:rgba(255,255,255,.7);transition:border-color .25s,color .25s}
.close-btn:hover{border-color:rgba(255,255,255,.4);color:#fff}.close-btn svg{font-size:.875rem}
.navm__nav{flex:1;display:flex;flex-direction:column;justify-content:center}
.navm__nav ul{display:flex;flex-direction:column;gap:.25rem}
.navm__item{display:flex;align-items:baseline;gap:1rem;width:100%;padding-block:.5rem;text-align:left;font-size:2.25rem;font-weight:600;letter-spacing:-.02em;transform:translateY(1rem);opacity:0;transition:all .5s ease-out;transition-delay:var(--d,0ms)}
.navm.open .navm__item{transform:none;opacity:1}
.navm__item small{font-size:1rem;font-weight:400;color:rgba(255,255,255,.3);transition:color .3s}
.navm__item span{color:rgba(255,255,255,.7);transition:color .3s}
.navm__item[aria-current] span{color:#fff;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:.2em}
.navm__item:hover small{color:var(--accent-from)}.navm__item:hover span{color:#fff}
@media(min-width:640px){.navm__item{font-size:3.75rem}}
.navm__bot{display:flex;flex-direction:column;gap:.75rem;border-top:1px solid rgba(255,255,255,.1);padding-block:1.5rem;font-size:.75rem;text-transform:uppercase;letter-spacing:.025em;color:rgba(255,255,255,.45)}
@media(min-width:640px){.navm__bot{flex-direction:row;justify-content:space-between;align-items:center}}
.navm__bot button{text-align:left;text-transform:uppercase;letter-spacing:.025em;color:rgba(255,255,255,.7)}.navm__bot button:hover{color:#fff;text-decoration:underline}
</style>
