<template>
  <div class="sfw" :class="{ 'sfw--dark': true }">
    <footer id="contact" class="sf">
      <div class="sf__in">
        <p class="sf__eye"><i></i> Available for new work</p>
        <h2 class="sf__h"><span class="w">Need something built?</span><span>Let's make it happen.</span></h2>
        <p class="sf__p">I'm open to internships and freelance work: web apps, backends, AI features and interfaces. Tell me what you need and I'll get back to you within a day.</p>
        <div class="sf__cta">
          <button class="sf__btn" @click="openContact()">Hire me <b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></b></button>
          <a class="sf__btn sf__btn--plain" href="/Muhammed_Rahil_Nazar_Resume.pdf" download>Download resume</a>
          <button class="sf__ghost" @click="scrollTo('#works', -10)">See my work</button>
        </div>
        <div class="sf__cols">
          <div><h3>Work</h3><ul class="work"><li v-for="d in doors" :key="d.id"><button @click="toDoor(d.id)">{{ d.nav }}</button></li></ul></div>
          <div><h3>Navigate</h3><ul>
            <li><button @click="scrollTo('#main')">Home</button></li><li><button @click="scrollTo('#leetcode', -30)">LeetCode</button></li><li><button @click="scrollTo('#story', -30)">My story</button></li><li><button @click="openContact()">Contact</button></li>
            <li><a :href="profile.github" target="_blank" rel="noreferrer">GitHub</a></li><li><a :href="profile.linkedin" target="_blank" rel="noreferrer">LinkedIn</a></li></ul></div>
          <div><h3>Status</h3><ul><li class="st">Available for work</li><li class="st">Remote-first, worldwide</li><li class="st">{{ profile.location }}</li></ul></div>
        </div>
        <div class="sf__bot"><span>© {{ new Date().getFullYear() }} {{ profile.name }}. Designed and built by Rahil.</span><span class="sf__legal"><NuxtLink to="/legal">Privacy &amp; credits</NuxtLink></span><button @click="scrollTo('#main')">Back to top ↑</button></div>
      </div>
    </footer>
  </div>
</template>
<script setup lang="ts">
const { openContact } = useContact()
const nav = useGo()
const scrollTo = (sel: string, off = 0) => (sel === '#main' ? nav.top() : nav.go(sel, off))
function toDoor(id: string) { nav.toDoor(id) }
</script>
<style scoped>
.sfw{position:relative;z-index:2;background:transparent;margin-top:-32px}
.sf{--sf-bg:#1A1818;--sf-fg:#E8E4E0;--sf-rgb:232,228,224;position:relative;z-index:2;background:var(--sf-bg);color:var(--sf-fg);border-radius:2rem 2rem 0 0;overflow:hidden}
html[data-mode="dark"] .sf{--sf-bg:#0F0E0E;box-shadow:inset 0 1px 0 rgba(232,228,224,.1)}
.sf__in{position:relative;z-index:1;max-width:88rem;margin:0 auto;padding:5.5rem 1.25rem 1.5rem}
@media(min-width:1024px){.sf__in{padding:7rem 5.5rem 1.75rem}}
.sf__eye{display:inline-flex;align-items:center;gap:.6rem;font-size:.8125rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:rgba(var(--sf-rgb),.6)}
.sf__eye i{width:.5rem;height:.5rem;border-radius:50%;background:#8FBF7A;animation:pulse 2.2s ease-out infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(143,191,122,.6)}70%{box-shadow:0 0 0 .55rem rgba(143,191,122,0)}100%{box-shadow:0 0 0 0 rgba(143,191,122,0)}}
.sf__h{margin:1.4rem 0 1.25rem;font-size:clamp(2.75rem,7.5vw,6.5rem);font-weight:600;line-height:.95;letter-spacing:-.035em}
.sf__h span{display:block}.sf__h span:last-child{color:rgba(var(--sf-rgb),.42)}
.sf__p{max-width:46ch;font-size:1.0625rem;line-height:1.6;color:rgba(var(--sf-rgb),.7)}
.sf__cta{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:2.25rem}
.sf__btn{display:inline-flex;align-items:center;gap:.8rem;height:3.5rem;padding:0 .55rem 0 1.6rem;border-radius:999px;background:var(--sf-fg);color:var(--sf-bg);font-size:1rem;font-weight:600;transition:transform .35s var(--e-soft)}
.sf__btn b{display:grid;place-items:center;width:2.5rem;height:2.5rem;border-radius:50%;background:var(--sf-bg);color:var(--sf-fg)}
.sf__btn svg{width:1.05rem;height:1.05rem;transition:transform .35s var(--e-soft)}.sf__btn:hover{transform:translateY(-2px)}.sf__btn:hover svg{transform:translateX(3px)}
.sf__btn--plain{padding:0 1.6rem}
.sf__ghost{display:inline-flex;align-items:center;height:3.5rem;padding:0 1.5rem;border-radius:999px;border:1px solid rgba(var(--sf-rgb),.2);color:var(--sf-fg);font-size:1rem;font-weight:500;transition:background .25s}
.sf__ghost:hover{background:rgba(var(--sf-rgb),.07)}
.sf__cols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2.25rem 1.5rem;margin-top:5rem;padding-top:2.5rem;border-top:1px solid rgba(var(--sf-rgb),.12)}
.sf__cols>div:first-child{grid-column:1/-1}
@media(min-width:768px){.sf__cols{grid-template-columns:2fr 1fr 1fr}.sf__cols>div:first-child{grid-column:auto}}
.sf__cols h3{margin-bottom:1rem;font-size:.75rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(var(--sf-rgb),.66)}
.sf__cols ul{display:flex;flex-direction:column;gap:0}
.sf__cols button,.sf__cols a{color:rgba(var(--sf-rgb),.85);font-size:.9375rem;font-weight:500;text-align:left;transition:color .2s}.sf__cols button:hover,.sf__cols a:hover{color:#fff}
.sf__cols li.st{font-size:.9375rem;color:rgba(var(--sf-rgb),.85)}
.sf__cols .work{display:grid;grid-template-columns:repeat(auto-fill,minmax(10rem,1fr));gap:0 1.5rem}
.sf__cols button,.sf__cols a,.sf__bot button,.sf__legal a{min-height:44px;display:inline-flex;align-items:center}
.sf__cols li.st{min-height:32px;display:flex;align-items:center}
.sf__bot{position:relative;z-index:1;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:.75rem;margin-top:1.75rem;font-size:.8125rem;color:rgba(var(--sf-rgb),.68)}
.sf__bot button:hover{color:var(--sf-fg)}.sf__legal a{text-decoration:underline;text-underline-offset:.2em}
</style>
