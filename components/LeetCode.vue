<template>
  <section id="leetcode" ref="root" class="lc" :class="{ in: seen }">
    <div class="shell">
      <header class="lc__head">
        <div>
          <p class="eyebrow">Problem solving</p>
          <h2 class="lc__h">{{ solved }} problems, one at a time.</h2>
        </div>
        <a class="pill pill--outline" :href="leetcode.url" target="_blank" rel="noreferrer"><span class="pill__in">@{{ leetcode.user }} on LeetCode ↗</span></a>
      </header>

      <div class="lc__grid">
        <article class="box ring">
          <svg viewBox="0 0 120 120" class="ring__svg" role="img" :aria-label="`${leetcode.solved} problems solved`">
            <circle cx="60" cy="60" r="52" class="trk" />
            <circle v-for="(l, i) in arcs" :key="l.k" cx="60" cy="60" r="52" class="arc" :stroke="l.c" :stroke-dasharray="`${seen ? l.len : 0} 999`" :stroke-dashoffset="-l.off" :style="{ transitionDelay: i * 150 + 'ms' }" />
          </svg>
          <div class="ring__c"><b class="tnum">{{ solved }}</b></div>
        </article>

        <article class="box levels">
          <h3>By difficulty</h3>
          <div v-for="l in leetcode.levels" :key="l.k" class="lv">
            <span class="lv__k" :style="{ color: l.c }">{{ l.k }}</span>
            <span class="lv__n tnum"><b>{{ l.n }}</b> / {{ l.of }} · {{ ((l.n / l.of) * 100).toFixed(1) }}%</span>
            <i class="lv__bar"><u :style="{ width: seen ? Math.max((l.n / l.of) * 100, 1.5) + '%' : '0%', background: l.c }"></u></i>
          </div>
        </article>



      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
const root = ref<HTMLElement>(), seen = ref(false), solved = ref(0)
const C = 2 * Math.PI * 52
const arcs = computed(() => {
  let off = 0
  return leetcode.levels.map((l) => { const len = (l.n / leetcode.total) * C * 6; const o = { k: l.k, c: l.c, len: Math.min(len, C - 4), off }; off += Math.min(len, C - 4) + 6; return o })
})
function count() {
  const to = leetcode.solved, t0 = performance.now(), dur = 1400
  const f = (t: number) => { const k = Math.min((t - t0) / dur, 1); solved.value = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f) }
  requestAnimationFrame(f)
}
onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') { seen.value = true; solved.value = leetcode.solved; return }
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { seen.value = true; count(); io.disconnect() } }, { threshold: 0.25 })
  root.value && io.observe(root.value); onBeforeUnmount(() => io.disconnect())
})
</script>
<style scoped>
.lc{position:relative;z-index:1;padding:7rem 0;background:radial-gradient(50% 50% at 85% 0%,rgba(229,176,74,.1),transparent 70%),radial-gradient(40% 50% at 0% 100%,rgba(79,185,159,.08),transparent 70%),var(--background);border-top:1px solid var(--line)}
.lc__head{display:flex;flex-wrap:wrap;gap:1.5rem;justify-content:space-between;align-items:flex-end;margin-bottom:3rem}
.lc__h{font-size:3.4rem;font-weight:700;line-height:.98;letter-spacing:-.035em;margin-top:.6rem;max-width:16ch}
@media(max-width:899px){.lc__h{font-size:2.4rem}}
.lc__grid{display:grid;gap:1rem;grid-template-columns:1fr}
@media(min-width:900px){.lc__grid{grid-template-columns:repeat(12,1fr)}.ring{grid-column:span 4}.levels{grid-column:span 8}}
.box{position:relative;border-radius:var(--radius-card-sm);border:1px solid var(--line);background:rgba(var(--fg-rgb),.03);padding:1.6rem;opacity:0;transform:translateY(24px);transition:opacity .8s var(--e-soft),transform .8s var(--e-soft)}
.in .box{opacity:1;transform:none}.in .box:nth-child(2){transition-delay:.08s}.in .box:nth-child(3){transition-delay:.16s}.in .box:nth-child(4){transition-delay:.24s}.in .box:nth-child(5){transition-delay:.32s}
h3{font-size:.8rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(var(--fg-rgb),.55);margin-bottom:1.2rem}
.ring{display:grid;place-items:center;min-height:17rem}
.ring__svg{position:absolute;inset:0;margin:auto;width:min(14rem,70%);height:auto;aspect-ratio:1;transform:rotate(-90deg)}
.trk{fill:none;stroke:rgba(var(--fg-rgb),.08);stroke-width:7}
.arc{fill:none;stroke-width:7;stroke-linecap:round;transition:stroke-dasharray 1.4s var(--e-soft)}
.ring__c{position:relative;display:flex;flex-direction:column;align-items:center;line-height:1}
.ring__c b{font-size:3.4rem;font-weight:700;letter-spacing:-.04em}.ring__c span{font-size:.9rem;color:rgba(var(--fg-rgb),.55);margin-top:.35rem}
.ring__c small{font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:rgba(var(--fg-rgb),.5);margin-top:.5rem}
.levels{display:flex;flex-direction:column;justify-content:center}.levels h3{margin-bottom:1.4rem}
.lv{display:grid;grid-template-columns:5.5rem 1fr;gap:.35rem 1rem;align-items:center;margin-bottom:1.1rem}
.lv__k{font-weight:600;font-size:1.05rem}.lv__n{text-align:right;color:rgba(var(--fg-rgb),.6);font-size:.9rem}.lv__n b{color:var(--foreground);font-size:1.05rem}
.lv__bar{grid-column:1/-1;height:6px;border-radius:6px;background:rgba(var(--fg-rgb),.08);overflow:hidden;display:block}
.lv__bar u{display:block;height:100%;border-radius:inherit;transition:width 1.4s var(--e-soft) .3s}
@media(prefers-reduced-motion:reduce){.box,.arc,.lv__bar u{transition:none}.box{opacity:1;transform:none}}
</style>
