<template>
  <section id="story" class="story" :data-ch="cur" :class="{ 'is-now': cur === 0 }" ref="root">
    <div class="story__amb" aria-hidden="true"><i v-for="n in story.length" :key="n"></i></div>
    <div class="shell story__pin">
      <div class="story__stage">
        <div class="story__clock" ref="clock">
          <canvas ref="cv" class="story__bg" aria-hidden="true"></canvas>
          <p class="eyebrow">My story</p>
          <h2 class="story__h">Let's go back in time.</h2>
          <div class="story__yr" aria-hidden="true">
            <span v-for="(d, i) in digits" :key="i" class="dg"><span class="dg__c" :style="{ '--d': d }"><i v-for="n in 10" :key="n">{{ n - 1 }}</i></span></span>
          </div>
          <span class="sr-only">{{ story[cur].year }}</span>
          <p class="story__when">{{ story[cur].when }}</p>
          <p class="story__meter tnum"><svg class="story__rw" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" :style="{ transform: `rotate(${-prog * 720}deg)` }" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l3 2" /></svg><b>{{ String(cur + 1).padStart(2, '0') }}</b><span class="story__of">/ {{ String(story.length).padStart(2, '0') }}</span><span class="story__bar"><b :style="{ transform: `scaleX(${prog})` }"></b></span></p>
        </div>
        <div class="story__line">
          <ol class="story__list" ref="list">
            <span class="story__rail"></span>
            <span class="story__dot" :style="{ top: dotTop + 'px' }"></span>
            <li v-for="(s, i) in story" :key="s.title" ref="items" class="ch" :class="{ on: i === cur }">
              <p class="ch__date">{{ s.when }}</p>
              <h3 class="ch__t">{{ s.title }}</h3>
              <p class="ch__org">{{ s.place }}</p>
              <ul class="ch__b"><li v-for="p in s.points" :key="p">{{ p }}</li></ul>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
const cur = ref(0), prog = ref(0), dotTop = ref(0)
const clock = ref<HTMLElement | null>(null)
const items = ref<HTMLElement[]>([]), list = ref<HTMLElement>(), root = ref<HTMLElement>(), cv = ref<HTMLCanvasElement>()
const { mode } = useTheme()
const digits = computed(() => story[cur.value].year.split('').map(Number))
// ---- the clock tunnel: dials of ticks receding into the distance ----
const RINGS = 16, GAP = 340, FOCAL = 520, RAD = 620
let dust: { a: number; r: number; z: number; s: number }[] = []
let W = 0, H = 0, dpr = 1, fg = '232,228,224'
function sizeCanvas() {
  const c = cv.value; if (!c) return
  dpr = Math.min(2, devicePixelRatio || 1); W = c.clientWidth; H = c.clientHeight
  c.width = Math.round(W * dpr); c.height = Math.round(H * dpr)
}
function drawTunnel(p: number) {
  const c = cv.value; if (!c || innerWidth < 768 || !W) return
  const ctx = c.getContext('2d')!
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H)
  const cx = W * 0.5, cy = H * 0.55, k = Math.min(W, H) / 900, len = RINGS * GAP
  const camZ = p * (story.length - 1) * GAP * 1.6 // scrolling carries you deeper into the past
  const spin = -p * Math.PI * 1.5 // the dials wind backwards
  ctx.lineCap = 'round'
  for (let i = 0; i < RINGS; i++) {
    const z = (((i * GAP - camZ) % len) + len) % len + 60
    const sc = (FOCAL / z) * k, fog = Math.min(1, Math.max(0, (z - 260) / 1100)) * Math.max(0, 1 - z / len)
    if (fog <= 0.01) continue
    const rr = RAD * sc, rot = spin + i * 0.21
    ctx.strokeStyle = `rgba(${fg},${(fog * 0.12).toFixed(3)})`; ctx.lineWidth = Math.max(0.5, 1.2 * sc)
    ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.stroke()
    const T = 60, every = T / 12
    for (const hour of [false, true]) {
      const l = (hour ? 46 : 18) * sc
      ctx.beginPath()
      for (let j = 0; j < T; j++) {
        if ((j % every === 0) !== hour) continue
        const a = rot + (j / T) * Math.PI * 2, co = Math.cos(a), si = Math.sin(a)
        ctx.moveTo(cx + co * (rr - l), cy + si * (rr - l)); ctx.lineTo(cx + co * rr, cy + si * rr)
      }
      ctx.strokeStyle = `rgba(${fg},${(fog * (hour ? 0.3 : 0.14)).toFixed(3)})`; ctx.lineWidth = Math.max(0.5, (hour ? 3 : 1.4) * sc); ctx.stroke()
    }
    if (rr < Math.min(W, H) * 0.45) { // a single hand on each dial
      const ha = rot * 3 + i
      ctx.strokeStyle = `rgba(${fg},${(fog * 0.16).toFixed(3)})`; ctx.lineWidth = Math.max(0.5, 2 * sc)
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(ha) * rr * 0.55, cy + Math.sin(ha) * rr * 0.55); ctx.stroke()
    }
  }
  for (const q of dust) { // dust drifting past
    const z = (((q.z - camZ * 1.1) % len) + len) % len + 40, sc = (FOCAL / z) * k
    const fog = Math.min(1, Math.max(0, (z - 300) / 900)) * Math.max(0, 1 - z / len), a = q.a + spin * 0.3
    ctx.fillStyle = `rgba(${fg},${(fog * 0.35).toFixed(3)})`
    ctx.beginPath(); ctx.arc(cx + Math.cos(a) * q.r * sc, cy + Math.sin(a) * q.r * sc, Math.max(0.4, q.s * sc * 2.2), 0, Math.PI * 2); ctx.fill()
  }
}
const readFg = () => { fg = (getComputedStyle(document.documentElement).getPropertyValue('--fg-rgb') || '232,228,224').trim() }
watch(mode, () => nextTick(() => { readFg(); drawTunnel(prog.value) }))

onMounted(() => {
  dust = Array.from({ length: 70 }, () => ({ a: Math.random() * Math.PI * 2, r: 120 + Math.random() * 760, z: Math.random() * RINGS * GAP, s: 0.6 + Math.random() * 1.4 }))
  readFg(); sizeCanvas()
  const resize = () => { sizeCanvas(); drawTunnel(prog.value) }
  addEventListener('resize', resize)
  onBeforeUnmount(() => removeEventListener('resize', resize))
  const update = () => {
    // on phones the year bar covers the top of the screen: the reading line is the middle of what is left below it
    const bar = innerWidth < 640 ? clock.value?.getBoundingClientRect().bottom ?? 0 : 0
    const mid = bar + (innerHeight - bar) * 0.5
    let best = 0, dist = Infinity
    items.value.forEach((el, i) => { const r = el.getBoundingClientRect(); const d = Math.abs(r.top + Math.min(r.height, 260) / 2 - mid); if (d < dist) { dist = d; best = i } })
    cur.value = best
    const lr = list.value?.getBoundingClientRect()
    if (lr) { const t = Math.max(0, Math.min(lr.height, mid - lr.top)); dotTop.value = t; prog.value = lr.height ? t / lr.height : 0 }
    drawTunnel(prog.value)
  }
  addEventListener('scroll', update, { passive: true }); addEventListener('resize', update); update()
  onBeforeUnmount(() => { removeEventListener('scroll', update); removeEventListener('resize', update) })
})
</script>
<style scoped>
.story{position:relative;z-index:1;border-top:1px solid rgba(26,24,24,.1);box-shadow:inset 0 1.75rem 2.25rem -1.75rem rgba(26,24,24,.14);
  background-image:repeating-linear-gradient(42deg,rgba(26,24,24,.022) 0 1px,transparent 1px 12px),linear-gradient(176deg,#FBF9F7 0%,#F7F4F1 54%,#F3EFEB 100%)}
html[data-mode="dark"] .story{background:#171515;background-image:radial-gradient(rgba(232,228,224,.055) 1px,transparent 1.4px);background-size:1.6rem 1.6rem;border-top-color:rgba(232,228,224,.08);box-shadow:inset 0 1.75rem 2.25rem -1.75rem rgba(0,0,0,.6)}
.story__amb{position:sticky;top:0;z-index:0;display:block;height:100svh;margin-bottom:-100svh;pointer-events:none;overflow:hidden;--aa:2.3;--p1:0% 14%;--p2:100% 86%}
html[data-mode="dark"] .story__amb{--aa:1.1;--p1:24% 44%;--p2:80% 74%}
.story__amb::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(54% 66% at 50% 50%,rgba(252,250,248,.9) 0%,rgba(252,250,248,.66) 46%,transparent 80%)}
html[data-mode="dark"] .story__amb::after{display:none}
.story__amb i{position:absolute;inset:-8%;opacity:0;transition:opacity 1.2s ease;background:radial-gradient(46% 54% at var(--p1),rgba(var(--c1),calc(.34*var(--aa))),transparent 74%),radial-gradient(42% 48% at var(--p2),rgba(var(--c2),calc(.26*var(--aa))),transparent 74%);animation:ambDrift 24s ease-in-out infinite alternate}
.story__amb i:nth-child(1){--c1:226,122,58;--c2:92,132,202}.story__amb i:nth-child(2){--c1:132,174,104;--c2:92,132,202}.story__amb i:nth-child(3){--c1:226,122,58;--c2:206,138,150}.story__amb i:nth-child(4){--c1:178,106,148;--c2:226,122,58}.story__amb i:nth-child(5){--c1:226,178,70;--c2:178,142,132}.story__amb i:nth-child(6){--c1:226,178,70;--c2:92,132,202}
html[data-mode="dark"] .story__amb i:nth-child(1){--c1:164,85,44;--c2:60,82,120}html[data-mode="dark"] .story__amb i:nth-child(2){--c1:122,134,112;--c2:60,82,120}html[data-mode="dark"] .story__amb i:nth-child(3){--c1:164,85,44;--c2:196,176,176}html[data-mode="dark"] .story__amb i:nth-child(4){--c1:74,53,64;--c2:164,85,44}html[data-mode="dark"] .story__amb i:nth-child(5){--c1:214,178,110;--c2:107,92,92}html[data-mode="dark"] .story__amb i:nth-child(6){--c1:214,178,110;--c2:60,82,120}
.story[data-ch="0"] .story__amb i:nth-child(1),.story[data-ch="1"] .story__amb i:nth-child(2),.story[data-ch="2"] .story__amb i:nth-child(3),.story[data-ch="3"] .story__amb i:nth-child(4),.story[data-ch="4"] .story__amb i:nth-child(5),.story[data-ch="5"] .story__amb i:nth-child(6){opacity:1}
@keyframes ambDrift{from{transform:translate3d(-2%,-1.5%,0) scale(1)}to{transform:translate3d(2.5%,2%,0) scale(1.06)}}
.story__pin{position:relative;z-index:1;padding-top:7rem;padding-bottom:2.5rem}
.story__stage{position:relative;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:3.5rem;align-items:start;width:100%}
.story__bg{position:absolute;left:-40%;right:-40%;top:0;height:100%;width:180%;z-index:-1;pointer-events:none;-webkit-mask:radial-gradient(closest-side,#000 55%,transparent);mask:radial-gradient(closest-side,#000 55%,transparent)}
.story__rw{width:1.25rem;height:1.25rem;color:rgba(var(--fg-rgb),.6)}
.story__clock{position:sticky;top:0;height:100svh;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;margin-top:-7rem;padding-top:3rem}
.story__h{margin-top:.6rem;font-size:2.4rem;font-weight:700;line-height:.98;letter-spacing:-.035em}
@media(min-width:1024px){.story__h{font-size:3.4rem}}
.story__yr{display:flex;margin:1.5rem 0 0 -.04em;font-size:clamp(5.5rem,11.5vw,11.5rem);font-weight:700;line-height:1;letter-spacing:-.06em;font-variant-numeric:tabular-nums}
.dg{display:block;height:1em;overflow:hidden;padding-right:.02em}
.dg__c{display:flex;flex-direction:column;transform:translateY(calc(var(--d,0)*-1em));transition:transform .9s cubic-bezier(.65,0,.2,1)}
.dg:nth-child(2) .dg__c{transition-delay:.04s}.dg:nth-child(3) .dg__c{transition-delay:.08s}.dg:nth-child(4) .dg__c{transition-delay:.12s}
.dg__c i{display:block;height:1em;font-style:normal;text-align:center}
.story__when{margin-top:.9rem;font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:.8125rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#5C4242}
html[data-mode="dark"] .story__when{color:#D9C6C6}
.story__meter{display:flex;align-items:center;gap:.6rem;margin-top:1.5rem;font-size:.875rem;font-weight:600;width:100%}
.story__of{color:rgba(var(--fg-rgb),.55)}
.story__bar{position:relative;flex:0 1 11rem;height:2px;margin-left:.6rem;border-radius:2px;background:rgba(var(--fg-rgb),.12);overflow:hidden}
.story__bar b{position:absolute;inset:0;background:var(--foreground);transform-origin:0 50%}
.story__line{position:relative;padding-top:24vh;padding-bottom:4vh}
.story__list{position:relative;padding:0 0 0 2.75rem}
.story__rail{position:absolute;left:.45rem;top:0;bottom:0;width:2px;border-radius:2px;background:rgba(var(--fg-rgb),.14)}
.story__dot{position:absolute;left:calc(.45rem + 1px);width:1.1rem;height:1.1rem;margin:-.55rem 0 0 -.55rem;border-radius:50%;z-index:2;background:var(--foreground);box-shadow:0 0 0 .4rem rgba(var(--fg-rgb),.08);transition:background .4s,box-shadow .4s}
.is-now .story__dot{background:#7FB069;box-shadow:0 0 0 .45rem rgba(127,176,105,.18)}
.ch{position:relative;padding:3rem 0;opacity:.52;transition:opacity .45s ease}.ch.on{opacity:1}
.ch__date{font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:.75rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(var(--fg-rgb),.66);margin-bottom:.7rem}
.ch__t{font-size:1.9rem;font-weight:600;line-height:1.08;letter-spacing:-.02em;margin-bottom:.35rem}
.ch__org{font-size:1.0625rem;font-weight:500;color:rgba(var(--fg-rgb),.7);margin-bottom:1rem}
.ch__b{display:flex;flex-direction:column;gap:.55rem;max-width:46ch}
.ch__b li{position:relative;padding-left:1.1rem;font-size:1rem;line-height:1.55;color:rgba(var(--fg-rgb),.78)}
.ch__b li::before{content:"";position:absolute;left:0;top:.72em;width:.45rem;height:1.5px;background:rgba(var(--fg-rgb),.45)}
@media(min-width:1280px){.ch__t{font-size:2.15rem}}
@media(max-width:639.98px){
  .story__pin{padding:0 1.25rem 1.25rem}.story__stage{grid-template-columns:minmax(0,1fr);gap:0}
  .story__clock{top:0;height:auto;margin:0 -1.25rem;padding-block:4.8rem .7rem;padding-inline:1.25rem;z-index:3;justify-content:flex-start;background:#F4F1EE;border-bottom:1px solid rgba(var(--fg-rgb),.1);box-shadow:0 10px 16px -12px rgba(var(--fg-rgb),.25)}
  html[data-mode="dark"] .story__clock{background:#171515}
  .story__bg{display:none}
  .story__clock .eyebrow{display:none}.story__h{margin-top:0;font-size:1.45rem}.story__yr{margin-top:.2rem;font-size:clamp(3rem,15vw,4rem)}
  .story__when{margin-top:.2rem;font-size:.6875rem}.story__meter{margin-top:.4rem;font-size:.8125rem}
  .story__line{padding-top:.75rem;padding-bottom:2rem}.story__list{padding-left:2rem}.ch{padding:1.5rem 0}.ch__t{font-size:1.4rem}.ch__date{margin-bottom:.5rem}.ch__org{margin-bottom:.7rem}
}
@media(prefers-reduced-motion:reduce){.story__bg{display:none}.ch{opacity:1}.dg__c{transition:none}.story__amb i{animation:none}}
</style>
