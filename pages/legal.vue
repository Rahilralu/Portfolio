<template>
  <main class="legal shell">
    <NuxtLink to="/" class="back">← Back to home</NuxtLink>
    <h1>Privacy &amp; credits</h1>
    <h2>Privacy</h2>
    <p>This site does not use cookies of its own. If analytics (Microsoft Clarity) is enabled by the site owner, it may record anonymous usage such as clicks and scrolling to help improve the site. The contact form never sends data to a server: it opens your own email app with the message pre-filled, and nothing is stored here.</p>
    <h2>Credits</h2>
    <p>Designed and built by Muhammed Rahil Nazar with Nuxt, Vue and Lenis. Typeface: Onest.</p>
    <p><a :href="`mailto:${profile.email}`" class="u">{{ profile.email }}</a></p>
  </main>
  <Footer />
</template>
<script setup lang="ts">
useHead({ title: 'Privacy & credits — Muhammed Rahil Nazar' })
</script>
<style scoped>
.legal{padding-top:9rem;padding-bottom:8rem;max-width:52rem}
.back{color:var(--muted)}
h1{font-size:3.4rem;font-weight:600;letter-spacing:-.03em;margin:1.5rem 0 2rem}
h2{font-size:1.4rem;margin:2rem 0 .6rem}
p{color:var(--muted);font-size:1.1rem;line-height:1.65;margin-bottom:1rem}
.u{text-decoration:underline;color:var(--foreground)}
</style>
