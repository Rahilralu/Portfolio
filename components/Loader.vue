<template>
  <div class="loader" :class="{ out }" aria-hidden="true" :style="{ '--p': p }">
    <div class="bg"></div>
    <div class="stack">
      <div v-for="(c, i) in colours" :key="c.hex" class="pill" :class="{ on: shown > i }" :style="{ '--k': i, '--c': c.hex, '--dir': i % 2 ? 1 : -1 }"><span>{{ c.label }}</span></div>
    </div>
    <div class="hud">
      <div class="top"><b>Rahil Nazar</b><span>Opening up the work</span></div>
      <div class="bot">
        <div class="num tnum"><small class="mono">Loading</small>{{ String(n).padStart(3, '0') }}</div>
        <div class="bar"><i></i></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const emit = defineEmits<{ done: [] }>()
const colours = doors.map((d) => ({ hex: d.hex, label: d.nav })).concat([{ hex: '#2F2A2A', label: 'Rahil Nazar' }])
const n = ref(0), p = ref(0), out = ref(false), shown = ref(0)
onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return emit('done')
  const t0 = performance.now(), dur = 1700
  const tick = (t: number) => {
    const k = Math.min((t - t0) / dur, 1)
    p.value = k; n.value = Math.round(k * 100); shown.value = Math.ceil(k * colours.length)
    if (k < 1) requestAnimationFrame(tick)
    else { out.value = true; setTimeout(() => emit('done'), 900) }
  }
  requestAnimationFrame(tick)
})
</script>
<style scoped>
.loader{position:fixed;inset:0;z-index:120;overflow:hidden;color:#E8E4E0}
.bg{position:absolute;inset:0;background:radial-gradient(38% 55% at 0% 72%,rgba(164,85,44,.26),transparent 70%),radial-gradient(40% 58% at 100% 70%,rgba(196,176,176,.16),transparent 72%),radial-gradient(70% 60% at 50% 0%,rgba(107,92,92,.3),transparent 70%),#0D0C0C;transition:transform .85s cubic-bezier(.76,0,.24,1)}
.out .bg{transform:translateY(-100%)}
.stack{--w:min(76vw,26rem);--h:calc(var(--w)*.27);--step:calc(var(--h)*.6);position:absolute;left:50%;top:47%;width:var(--w);height:calc(var(--h) + 4*var(--step));translate:-50% -50%}
.pill{position:absolute;left:0;top:calc(var(--k)*var(--step));width:100%;height:var(--h);border-radius:999px;z-index:var(--k);display:flex;padding:calc(var(--h)*.2) 0 0 calc(var(--w)*.16);font-size:max(11px,calc(var(--w)*.036));font-weight:500;letter-spacing:.02em;color:#E8E4E0;
  background:linear-gradient(180deg,color-mix(in srgb,var(--c) 88%,#fff),var(--c) 22%,var(--c) 70%,color-mix(in srgb,var(--c) 82%,#000));
  box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 -1px 0 rgba(0,0,0,.25),0 calc(var(--h)*-.18) calc(var(--h)*.35) calc(var(--h)*-.12) rgba(0,0,0,.55);
  opacity:0;transform:translateY(-1.6rem) scale(.96);transition:opacity .45s ease,transform .75s cubic-bezier(.16,1,.3,1)}
.pill.on{opacity:1;transform:none}
.pill span{opacity:.82}
.out .pill{transition:transform .8s cubic-bezier(.7,0,.25,1) calc(var(--k)*45ms),opacity .5s ease calc(.25s + var(--k)*45ms);opacity:0;transform:translateX(calc(var(--dir)*115vw)) rotate(calc(var(--dir)*4deg))}
.hud{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:clamp(1.25rem,4vw,3rem);transition:opacity .35s}
.out .hud{opacity:0}
.top{display:flex;justify-content:space-between;font-size:.8125rem;color:rgba(232,228,224,.7)}.top b{color:#E8E4E0}
.bot{display:flex;justify-content:space-between;align-items:flex-end;gap:1.5rem}
.num{font-size:clamp(3.5rem,9vw,7.5rem);font-weight:700;line-height:.85;letter-spacing:-.05em}
.num small{display:block;margin-bottom:.9rem;font-size:.6875rem;letter-spacing:.16em;text-transform:uppercase;opacity:.62}
.bar{width:min(30vw,14rem);height:2px;background:rgba(232,228,224,.14);overflow:hidden;margin-bottom:.5rem}
.bar i{display:block;height:100%;background:linear-gradient(90deg,#6B5C5C,#C4B0B0,#D6B26E);transform-origin:0 50%;transform:scaleX(var(--p))}
@media(prefers-reduced-motion:reduce){.pill{transform:none}.out .pill{transform:none}}
</style>
