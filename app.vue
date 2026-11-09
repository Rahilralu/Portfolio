<template>
  <div>
    <Loader v-if="!ready" @done="ready = true" />
    <a class="skip" href="#main">Skip to content</a>
    <TopBar />
    <PullCord />
    <NuxtPage />
    <WorkRoom />
    <NavOverlay />
    <ContactModal />
    <BackToTop />
    <CustomCursor />
    <div v-if="cover" class="roomcover" :class="{ off: coverOff }" aria-hidden="true"></div>
  </div>
</template>

<script setup lang="ts">
// the loading intro only plays when the home page itself is loaded or refreshed
const route = useRoute()
const ready = ref(route.path !== '/')
// a room URL is server-rendered as the home page; this room-coloured sheet hides it until the room has opened
const cover = ref(!!doors.find((d) => d.path === route.params.room)), coverOff = ref(false)
const { active } = useDoor()
const dropCover = () => { if (!cover.value || coverOff.value) return; coverOff.value = true; setTimeout(() => (cover.value = false), 700) }
watch(active, (v) => { if (v) setTimeout(dropCover, 450) })
onMounted(() => { if (cover.value) setTimeout(dropCover, 3000) }) // safety net
useHead({ bodyAttrs: { class: ready.value ? 'ready' : '' } })
const clarityId = useRuntimeConfig().public.clarityId as string
const { sync } = useTheme()
onMounted(async () => {
  sync()
  if (clarityId) {
    const { default: Clarity } = await import('@microsoft/clarity')
    Clarity.init(clarityId)
  }
})
watch(ready, (v) => { if (v) document.body.classList.add('ready') })
</script>

<style>
.roomcover{position:fixed;inset:0;z-index:104;background:var(--room);pointer-events:none;transition:opacity .6s ease}
.roomcover.off{opacity:0}
</style>
