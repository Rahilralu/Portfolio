<template>
  <section id="home" class="hero">
    <div class="hero__vig"></div>
    <div class="hero__stage">
      <div class="fig">
        <img src="/profile.png" alt="Illustrated portrait of Muhammed Rahil Nazar" />
      </div>
    </div>
    <div class="shell hero__content">
      <div class="hero__left">
        <h1 class="h1">
          <span class="line"><span style="--d:250ms">Hi, I'm {{ profile.first }}.</span></span>
          <span class="line soft"><span style="--d:370ms">I am a</span></span>
          <span class="cal-line"><FlipCal :words="roles" /></span>
        </h1>
        <div class="rv ctas" style="--d:560ms">
          <button class="pill pill--arrow pill--dark" @click="openContact()"><span class="pill__in">Hire me <span class="pill__badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span></span></button>
          <a class="pill pill--outline" href="#works" @click.prevent="scrollTo('#works', -10)"><span class="pill__in">See my work</span></a>
          <a class="pill pill--outline ctas__cv" href="/Muhammed_Rahil_Nazar_Resume.pdf" download><span class="pill__in">Resume</span></a>
        </div>
      </div>
    </div>
    <div class="shell hero__bar rv" style="--from:none;--d:900ms">
      <span>Available for work</span><span class="mid">Remote-first · Kochi, India</span>
      <a class="scroll" href="#works" @click.prevent="scrollTo('#works', -10)">Scroll to explore <i>↓</i></a>
    </div>
  </section>
</template>
<script setup lang="ts">
const { openContact } = useContact()
const scrollTo = useScrollTo()
</script>
<style scoped>
.hero{position:relative;isolation:isolate;overflow:hidden;z-index:2;border-radius:0 0 var(--radius-card) var(--radius-card);--fig-h:27rem;min-height:100svh;display:flex;flex-direction:column;
  background:radial-gradient(120% 90% at 62% 30%,var(--hero-from) 0%,var(--hero-mid) 48%,var(--hero-to) 100%);
  box-shadow:0 1px 0 rgba(26,24,24,.1),0 1.75rem 3rem -1.5rem rgba(26,24,24,.3)}
html[data-mode="dark"] .hero{box-shadow:0 1px 0 rgba(232,228,224,.08),0 1.75rem 3rem -1.25rem rgba(0,0,0,.85)}
.hero::before{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;opacity:0;background:radial-gradient(120% 90% at 62% 30%,#2A2525 0%,#1F1C1C 48%,#141212 100%)}
html[data-mode="dark"] .hero::before{opacity:1}
.hero__vig{position:absolute;inset:0;z-index:0;pointer-events:none;background:linear-gradient(to bottom,var(--vig),transparent,var(--vig))}
.hero__stage{position:absolute;inset:0;z-index:2;pointer-events:none}
.fig{position:absolute;bottom:var(--bar-h);left:50%;height:var(--fig-h);aspect-ratio:801/1033;pointer-events:auto;opacity:0;transform:translate(-50%,2.5rem);transition:opacity 1.1s var(--e-soft) 120ms,transform 1.3s var(--e-soft) 120ms}
body.ready .fig{opacity:1;transform:translate(-50%,0)}
@media(min-width:1024px){
  .fig{height:min(calc(100% - var(--bar-h) - 6rem),58rem,calc((min(100vw,var(--shell)) - 2*var(--gut))*.44*1033/801));left:auto;right:calc(var(--gut) + (100% - min(100%,var(--shell)))/2);transform:translateY(2.5rem)}
  body.ready .fig{transform:none}
}
.fig img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 20%;border-radius:999px 999px 0 0;filter:saturate(.9) contrast(1.03);-webkit-mask:linear-gradient(180deg,#000 80%,transparent);mask:linear-gradient(180deg,#000 80%,transparent)}
.fig__wm{position:absolute;left:50%;translate:-50% 0;bottom:42%;z-index:1;white-space:nowrap;pointer-events:none;user-select:none;font-weight:700;line-height:1;letter-spacing:-.02em;color:rgba(255,255,255,.16);font-size:4.25rem}
@media(min-width:640px) and (max-width:1023.98px){.fig__wm{font-size:8rem}}
@media(min-width:1024px){.fig__wm{left:auto;right:-1rem;translate:none;bottom:24%;font-size:11rem}}

.hero__content{position:relative;z-index:20;flex:1;display:flex;flex-direction:column;gap:2rem;padding-top:7rem;padding-bottom:calc(var(--fig-h) + 1.25rem);pointer-events:none}
.hero__content a,.hero__content button{pointer-events:auto}
@media(min-width:1024px){.hero__content{display:grid;min-height:calc(100lvh - var(--bar-h));grid-template-columns:repeat(12,1fr);align-content:center;gap:2.5rem;padding-top:7rem;padding-bottom:4rem}}
.hero__left{display:flex;flex-direction:column;gap:1.75rem;min-width:0}
@media(min-width:1024px){.hero__left{grid-column:1/span 7}}
.h1{font-size:2.625rem;font-weight:600;line-height:.98;letter-spacing:-.02em;text-wrap:balance}
@media(min-width:640px){.h1{font-size:3.5rem}}@media(min-width:768px){.h1{font-size:4.25rem}}@media(min-width:1024px){.h1{font-size:4.75rem}}
.soft{color:rgba(var(--fg-rgb),.5)}
.cal-line{display:block;padding-top:.34em;margin-top:.1em;padding-bottom:.42em;pointer-events:auto}
.ctas{display:flex;flex-wrap:wrap;gap:.75rem}
@media(max-width:639.98px){.ctas__cv{display:none}.ctas{gap:.5rem}.ctas :deep(.pill__in){padding-inline:1.1rem}.ctas :deep(.pill--arrow .pill__in){padding:.375rem .375rem .375rem 1.1rem}}
.hero__bar{position:relative;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:.75rem;height:var(--bar-h);border-top:1px solid rgba(var(--fg-rgb),.1);font-size:.75rem;font-weight:500;text-transform:uppercase;letter-spacing:.025em;color:rgba(var(--fg-rgb),.72);max-width:none;padding-inline:max(1.25rem,calc((100vw - var(--shell))/2 + var(--gut)))}
.mid{display:none}@media(min-width:640px){.mid{display:inline}}
.scroll{display:inline-flex;align-items:center;gap:.5rem}
.scroll i{font-style:normal;display:inline-block;animation:nudge 1.8s var(--e-snap) infinite}
@keyframes nudge{0%,100%{transform:translateY(0)}50%{transform:translateY(3px)}}
</style>
