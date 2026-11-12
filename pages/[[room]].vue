<template>
  <main id="main">
    <Hero />
    <Doors />
    <LeetCode />
    <Story />
    <Footer />
  </main>
</template>
<script setup lang="ts">
import { doors as allDoors } from '~/composables/useContent'
// `/` and `/<room>` are the same page: the room is shown over the doors scene, so the URL follows the door
// without remounting anything (Doors.vue keeps the route and the open room in step).
definePageMeta({
  key: 'home',
  validate: (r) => !r.params.room || allDoors.some((d) => d.path === r.params.room),
  scrollToTop: (_to, from) => from.name !== 'room',
})
const route = useRoute()
const room = computed(() => doors.find((d) => d.path === route.params.room))
useSeo(() => room.value
  ? { path: `/${room.value.path}`, title: `${room.value.plate.replace('\n', ' ')} | Muhammed Rahil Nazar`, description: `${room.value.blurb} Selected work by Muhammed Rahil Nazar, full stack developer in Kochi, India.` }
  : { path: '/', title: 'Muhammed Rahil Nazar | Full Stack Developer, Kochi' })
</script>
