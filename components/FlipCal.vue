<template>
  <span ref="root" class="cal rv" :style="{ '--d': '450ms', '--from': 'translateY(.5em)', '--ease': 'var(--e-soft)', '--fit': fit }" role="text" :aria-label="words[idx]">
    <span class="cal__body" :style="{ width: w }">
      <span class="cal__stand"></span>
      <span class="cal__card">
        <!-- resting halves: top shows the incoming word, bottom still shows the outgoing one -->
        <span class="half top"><span class="w">{{ words[tgt] }}</span></span>
        <span class="half bot"><span class="w">{{ words[idx] }}</span></span>
        <!-- the two flaps that actually turn -->
        <span class="flap ftop" :class="{ go: flipping }"><span class="half top"><span class="w">{{ words[idx] }}</span></span><i class="fshade"></i></span>
        <span class="flap fbot" :class="{ go: flipping }"><span class="half bot"><span class="w">{{ words[next] }}</span></span><i class="fshade"></i></span>
        <span class="cal__hinge"></span>
        <span class="cal__no tnum mono">{{ pad(tgt + 1) }} / {{ pad(words.length) }}</span>
        <span class="cal__holes"><i v-for="n in 12" :key="n"></i></span>
      </span>
      <span class="cal__rings"><i v-for="n in 12" :key="n"></i></span>
    </span>
    <span v-for="(wd, i) in words" :key="wd" :ref="(el) => (meas[i] = el as HTMLElement)" class="cal__measure">{{ wd }}</span>
  </span>
</template>
<script setup lang="ts">
const props = defineProps<{ words: string[] }>()
const idx = ref(0), next = ref(1 % props.words.length), flipping = ref(false), w = ref('7em')
const tgt = computed(() => (flipping.value ? next.value : idx.value))
const meas = ref<HTMLElement[]>([])
const pad = (n: number) => String(n).padStart(2, '0')
const widthEm = (i: number) => {
  const el = meas.value[i]; if (!el) return 7
  const fs = parseFloat(getComputedStyle(el.parentElement as HTMLElement).fontSize) || 16
  return el.offsetWidth / fs + 0.95
}
// phones: shrink the whole card so the widest word always fits the line (desktop stays at 1)
const root = ref<HTMLElement | null>(null)
const fit = ref(1)
const fitCard = () => {
  const el = root.value, line = el?.parentElement
  if (!el || !line) return
  if (innerWidth >= 640) { fit.value = 1; return }
  const widest = Math.max(...props.words.map((_, i) => widthEm(i)))
  const base = (parseFloat(getComputedStyle(line).fontSize) || 16) * 0.9
  fit.value = Math.max(0.6, Math.min(1, (line.clientWidth - 2) / (widest * base)))
}
onMounted(() => {
  const refit = () => { fitCard(); w.value = widthEm(idx.value) + 'em' }
  w.value = widthEm(0) + 'em'
  fitCard()
  // the web font may land after the first measure: measure again once it has
  document.fonts?.ready.then(refit)
  addEventListener('resize', refit)
  onBeforeUnmount(() => removeEventListener('resize', refit))
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const id = setInterval(() => {
    next.value = (idx.value + 1) % props.words.length
    // while flipping the card only ever grows, so neither word is clipped mid-turn; it settles to the new width afterwards
    w.value = Math.max(widthEm(idx.value), widthEm(next.value)) + 'em'
    flipping.value = true
    setTimeout(() => { idx.value = next.value; flipping.value = false; w.value = widthEm(idx.value) + 'em' }, 800)
  }, 2900)
  onBeforeUnmount(() => clearInterval(id))
})
</script>
<style scoped>
.cal{position:relative;display:inline-block;font-size:calc(.9em * var(--fit,1));max-width:100%;vertical-align:top}
.cal.rv{transition-duration:1.1s}
.cal__body{position:relative;display:block;height:1.72em;transition:width .55s var(--e-soft)}
.cal__stand{position:absolute;left:.1em;right:.1em;top:.3em;bottom:-.3em;border-radius:.26em;background:linear-gradient(165deg,#3a3a3a 0%,#141414 40%,#050505 100%);box-shadow:0 .5em .9em -.35em rgba(0,0,0,.55),inset 0 .02em 0 rgba(255,255,255,.12)}
.cal__card{position:absolute;inset:0;display:block;border-radius:.2em;perspective:60em;perspective-origin:50% 50%;transform-style:flat;isolation:isolate;
  box-shadow:0 .045em 0 #d8d4cb,0 .08em 0 #f6f4ef,0 .115em 0 #d0cbc1,0 .15em 0 #f2f0ea,0 .185em 0 #c8c3b8,0 .22em 0 #e9e6df,0 .255em 0 #aaa498,0 .45em .6em -.2em rgba(0,0,0,.35)}
.half{position:absolute;left:0;right:0;display:block;overflow:hidden;color:#0a0a0a}
.half.top{top:0;height:50%;border-radius:.2em .2em 0 0;background:linear-gradient(180deg,#fdfcf9 0%,#f6f4ef 100%)}
.half.bot{bottom:0;height:50%;border-radius:0 0 .2em .2em;background:linear-gradient(180deg,#efede7 0%,#f3f1ec 100%)}
.w{position:absolute;left:0;right:0;height:200%;display:flex;align-items:center;padding:.1em .4em 0;font-weight:700;letter-spacing:-.035em;line-height:1;white-space:nowrap}
.half.top .w{top:0}.half.bot .w{bottom:0}
.flap{position:absolute;left:0;right:0;display:block;backface-visibility:hidden;will-change:transform}
.ftop{top:0;height:50%;transform-origin:50% 100%;z-index:3}
.fbot{bottom:0;height:50%;transform-origin:50% 0;transform:rotateX(90deg);z-index:2}
.flap .half{inset:0;height:100%;border-radius:inherit}
.ftop .half{border-radius:.2em .2em 0 0}.fbot .half{border-radius:0 0 .2em .2em}
.fshade{position:absolute;inset:0;pointer-events:none;opacity:0;border-radius:inherit}
.ftop .fshade{background:linear-gradient(0deg,rgba(0,0,0,.55),rgba(0,0,0,.1))}
.fbot .fshade{background:linear-gradient(180deg,rgba(0,0,0,.5),rgba(0,0,0,.05))}
.ftop.go{animation:flapTop .38s cubic-bezier(.55,.05,.85,.4) forwards}
.ftop.go .fshade{animation:shadeIn .38s ease-in forwards}
.fbot.go{animation:flapBot .42s cubic-bezier(.2,.7,.35,1.05) .36s forwards}
.fbot.go .fshade{animation:shadeOut .42s ease-out .36s forwards}
@keyframes flapTop{0%{opacity:1}92%{opacity:1}to{transform:rotateX(-90deg);opacity:0}}
@keyframes flapBot{from{transform:rotateX(90deg)}to{transform:rotateX(0)}}
@keyframes shadeIn{to{opacity:1}}
@keyframes shadeOut{from{opacity:1}to{opacity:0}}
.cal__hinge{position:absolute;left:0;right:0;top:50%;height:.035em;margin-top:-.0175em;background:linear-gradient(180deg,rgba(0,0,0,.28),rgba(0,0,0,.08));z-index:4;pointer-events:none}
.cal__no{position:absolute;right:.42em;bottom:.2em;font-size:.15em;font-weight:500;letter-spacing:.08em;color:rgba(10,10,10,.42);z-index:1}
.cal__holes{position:absolute;top:.09em;left:.32em;right:.32em;height:.07em;display:flex;justify-content:space-between;z-index:5;pointer-events:none}
.cal__holes i{display:block;width:.075em;height:.075em;border-radius:50%;background:#1b1b1b;box-shadow:inset 0 .01em .01em rgba(255,255,255,.3)}
.cal__rings{position:absolute;top:-.27em;left:.32em;right:.32em;height:.42em;display:flex;justify-content:space-between;z-index:6;pointer-events:none}
.cal__rings i{display:block;width:.075em;height:.42em;position:relative}
.cal__rings i::before{content:"";position:absolute;left:-.065em;right:-.065em;top:0;bottom:0;border-radius:.2em;border:.04em solid #a9a9a9;border-left-color:#ededed;border-top-color:#f6f6f6;border-right-color:#6f6f6f;border-bottom-color:#8a8a8a;filter:drop-shadow(.01em .025em .015em rgba(0,0,0,.35))}
.cal__measure{position:absolute;visibility:hidden;white-space:nowrap;font-weight:700;letter-spacing:-.035em;pointer-events:none}
</style>
