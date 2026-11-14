<template>
  <header class="hdr rv" :class="{ stuck: stuck || !!active, inroom: !!active, away: hidden }" style="--from:translateY(-14px);--d:150ms;--ease:var(--e-spring)">
    <div class="shell hdr__in">
      <nav aria-label="Primary">
        <div class="nav">
          <a href="/" :aria-current="cur === 'home' ? 'location' : undefined" @click.exact.prevent="go('#main')">Home</a>
          <a v-for="d in doors" :key="d.id" :href="`/${d.path}`" :aria-current="cur === d.id ? 'location' : undefined" @click.exact.prevent="toDoor(d.id)">{{ d.nav }}</a>
          <a href="/#leetcode" :aria-current="cur === 'leetcode' ? 'location' : undefined" @click.exact.prevent="go('#leetcode')">LeetCode</a>
          <a href="/#story" :aria-current="cur === 'story' ? 'location' : undefined" @click.exact.prevent="go('#story')">My story</a>
          <a href="/#contact" :aria-current="cur === 'contact' ? 'location' : undefined" @click.exact.prevent="go('#contact')">Contact</a>
        </div>
      </nav>
      <div class="hdr__right">
        <button class="chip menu-btn" aria-label="Open menu" @click="openNav()">
          <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 8h16M4 16h16" /></svg><i class="word">Menu</i></span>
        </button>
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
const stuck = ref(false), hidden = ref(false)
const { openNav } = useNav()
const { active, walking } = useDoor()
const nav = useGo()
const { current: cur, track } = useSection()
watch(walking, (w) => { hidden.value = !!w })
function go(h: string) { nav.go(h, h === '#main' ? 0 : -30) }
function toDoor(id: string) { nav.toDoor(id) }
onMounted(() => {
  track()
  const onScroll = () => { stuck.value = scrollY > 40 }
  addEventListener('scroll', onScroll, { passive: true }); onScroll()
  onBeforeUnmount(() => removeEventListener('scroll', onScroll))
})
</script>
<style scoped>
.hdr{position:fixed;inset-inline:0;top:0;z-index:106;transition:background .35s ease,box-shadow .35s ease,opacity .35s ease,translate .45s var(--e-soft)}
.hdr.stuck{background:var(--background);box-shadow:0 1px 0 rgba(var(--fg-rgb),.08)}
.hdr.inroom{background:var(--room);box-shadow:0 1px 0 rgba(var(--fg-rgb),.08)}
.hdr.away{opacity:0;translate:0 -100%;pointer-events:none}
.hdr__in{display:flex;align-items:center;justify-content:space-between;gap:1.5rem;padding-block:1.25rem;transition:padding .35s ease}
.stuck .hdr__in{padding-block:.85rem}
@media(min-width:640px){.hdr__in{padding-block:1.5rem}}
nav{flex:1;min-width:0}
.nav{display:none}
@media(min-width:1200px){.nav{display:flex;gap:1.4rem;font-size:1rem;white-space:nowrap}.nav a{opacity:.8;padding-block:.6rem;margin-block:-.6rem;transition:opacity .25s}.nav a:hover,.nav a[aria-current]{opacity:1}.nav a[aria-current]{text-decoration:underline;text-underline-offset:.35em;text-decoration-thickness:1.5px}.menu-btn{display:none}}
@media(max-width:1199.98px){nav{display:none}.hdr__right{flex:1}.menu-btn{order:-1}}
.hdr__right{display:flex;align-items:center;gap:.75rem}
.menu-btn{transition:background .25s}.menu-btn:hover{background:var(--chip-bg-h)}
.menu-btn>span{display:flex;align-items:center;gap:.5rem;padding:.6rem 1.1rem;font-size:.875rem;font-weight:500;text-transform:uppercase;letter-spacing:.05em}
.menu-btn svg{font-size:1rem}.menu-btn .word{display:none;font-style:normal}
@media(min-width:640px){.menu-btn .word{display:inline}}
</style>
