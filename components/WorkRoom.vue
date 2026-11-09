<template>
  <Teleport to="body">
    <div v-if="mounted && door" ref="el" class="roomv" data-lenis-prevent :class="{ on: vis }" role="dialog" aria-modal="true" :aria-label="door.title" tabindex="-1" @keydown.esc="closeDoor()">
      <div class="shell roomv__in">
        <div class="roomv__top">
          <button class="pill pill--outline" @click="closeDoor()"><span class="pill__in">← Back to the doors</span></button>
          <span class="roomv__door mono">Door {{ String(index + 1).padStart(2, '0') }} / {{ String(doors.length).padStart(2, '0') }}</span>
        </div>
        <div class="roomv__head">
          <p class="eyebrow">{{ door.plate.replace('\n', ' ') }}</p>
          <h2 class="roomv__title">{{ door.title }}</h2>
          <p class="roomv__desc">{{ door.blurb }}</p>
          <ul class="skills"><li v-for="s in door.skills" :key="s" class="chip">{{ s }}</li></ul>
        </div>
        <div class="roomv__grid">
          <article v-for="(p, pi) in door.projects" :key="p.title" class="pc" :style="{ '--i': pi }">
            <a v-if="p.image && p.link" class="shot" :href="p.link" target="_blank" rel="noreferrer" :aria-label="`Open ${p.title}`"><img :src="p.image" :alt="`${p.title} screenshot`" loading="lazy" /><span class="shot__go">Open site ↗</span></a>
            <img v-else-if="p.image" :src="p.image" :alt="p.title" loading="lazy" />
            <b class="mono">{{ p.sub }}</b>
            <h3>{{ p.title }}</h3>
            <ul class="pts"><li v-for="pt in p.points" :key="pt">{{ pt }}</li></ul>
            <p v-if="p.stack" class="stack mono">{{ p.stack }}</p>
            <span v-if="p.link" class="links"><a :href="p.link" target="_blank" rel="noreferrer" class="pill pill--outline"><span class="pill__in">{{ p.linkLabel }} ↗</span></a><a v-if="p.repo" :href="p.repo" target="_blank" rel="noreferrer" class="pill pill--outline"><span class="pill__in">GitHub ↗</span></a></span>
          </article>
        </div>
        <div class="roomv__next">
          <button class="pill pill--arrow pill--dark" @click="openContact(); closeDoor()"><span class="pill__in">Work with me <span class="pill__badge">→</span></span></button>
          <button class="pill pill--outline" @click="nextDoor"><span class="pill__in">Next door: {{ doors[(index + 1) % doors.length].nav }} →</span></button>
        </div>
      </div>
      <Footer class="roomv__foot" />
    </div>
  </Teleport>
</template>
<script setup lang="ts">
const { active, closeDoor, openDoor } = useDoor()
const { openContact } = useContact()
// keep the last room around while it fades out
const shownId = ref<string | null>(null)
const door = computed(() => doors.find((d) => d.id === shownId.value) || null)
const index = computed(() => doors.findIndex((d) => d.id === shownId.value))
const mounted = ref(false), vis = ref(false), el = ref<HTMLElement>()
watch(active, async (v) => {
  if (v) {
    shownId.value = v; mounted.value = true; vis.value = false
    await nextTick(); el.value?.focus(); el.value?.scrollTo(0, 0)
    requestAnimationFrame(() => requestAnimationFrame(() => { vis.value = true }))
  } else if (mounted.value) {
    vis.value = false
    setTimeout(() => { if (!active.value) mounted.value = false }, 650)
  }
})
const nextDoor = () => openDoor(doors[(index.value + 1) % doors.length].id)
</script>

<style scoped>
.roomv{position:fixed;inset:0;z-index:105;overflow:auto;overscroll-behavior:contain;background:var(--room);color:var(--foreground);outline:none;opacity:0;transition:opacity .5s ease}
.roomv.on{opacity:1}
.roomv__in{position:relative;z-index:1;padding-block:6.5rem 5rem}
.roomv__top,.roomv__head,.roomv__grid,.roomv__next{opacity:0;transform:translateY(1.4rem);transition:opacity .7s var(--e-soft),transform .9s var(--e-soft)}
.roomv.on .roomv__top{opacity:1;transform:none;transition-delay:.25s}
.roomv.on .roomv__head{opacity:1;transform:none;transition-delay:.38s}
.roomv.on .roomv__grid{opacity:1;transform:none;transition-delay:.5s}
.roomv.on .roomv__next{opacity:1;transform:none;transition-delay:.7s}
.roomv__top{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding-block:.5rem 3rem}
.roomv__door{font-size:.75rem;font-weight:500;letter-spacing:.05em;text-transform:uppercase;color:rgba(var(--fg-rgb),.5)}
.roomv__head{display:flex;flex-direction:column;gap:1.25rem;max-width:44rem;padding-bottom:3.5rem}
.roomv__title{font-size:2.75rem;font-weight:600;line-height:.98;letter-spacing:-.02em}
@media(min-width:640px){.roomv__title{font-size:4rem}}@media(min-width:1024px){.roomv__title{font-size:4.75rem}}
.roomv__desc{font-size:1.0625rem;line-height:1.55;color:rgba(var(--fg-rgb),.65);max-width:52ch}
.skills{display:flex;flex-wrap:wrap;gap:.4rem}.skills .chip{padding:.4rem .9rem;font-size:.8125rem}
.roomv__grid{display:grid;grid-template-columns:1fr;gap:1rem}
@media(min-width:640px){.roomv__grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(min-width:1024px){.roomv__grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:1.5rem}}
.pc{display:flex;flex-direction:column;gap:.5rem;padding:1.5rem;border-radius:var(--radius-card-sm);border:1px solid var(--line);background:rgba(var(--fg-rgb),.03);transition:transform .5s var(--e-soft),border-color .3s,background .3s}
.pc:hover{transform:translateY(-4px);border-color:rgba(var(--fg-rgb),.22);background:rgba(var(--fg-rgb),.05)}
.pc img{border-radius:.9rem;border:1px solid var(--line);margin-bottom:.6rem;aspect-ratio:16/10;object-fit:cover;width:100%}
.shot{position:relative;display:block;margin-bottom:.6rem;border-radius:.9rem;overflow:hidden;border:1px solid var(--line)}
.shot img{margin:0;border:0;border-radius:0;transition:transform .6s var(--e-soft)}
.shot:hover img{transform:scale(1.04)}
.shot__go{position:absolute;right:.6rem;bottom:.6rem;padding:.4rem .8rem;border-radius:99px;background:var(--btn-bg);color:var(--btn-fg);font-size:.75rem;font-weight:600;opacity:0;transform:translateY(6px);transition:opacity .3s,transform .4s var(--e-soft)}
.shot:hover .shot__go,.shot:focus-visible .shot__go{opacity:1;transform:none}
.pc b{font-size:.75rem;font-weight:500;letter-spacing:.05em;text-transform:uppercase;color:rgba(var(--fg-rgb),.45)}
.pc h3{font-size:1.6rem;font-weight:600;letter-spacing:-.02em;line-height:1.1}
.pts{display:grid;gap:.4rem;font-size:.95rem;color:rgba(var(--fg-rgb),.72)}.pts li::before{content:'– '}
.stack{font-size:.75rem;color:rgba(var(--fg-rgb),.5);margin-top:.3rem}
.pc .links{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.7rem}.pc .pill{align-self:flex-start}
.roomv__next{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:4rem}
@media(prefers-reduced-motion:reduce){.roomv,.roomv__top,.roomv__head,.roomv__grid,.roomv__next{transition:none;opacity:1;transform:none}}
</style>
