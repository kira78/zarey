<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const is404 = computed(() => props.error.statusCode === 404)
useSeoMeta({ title: () => (is404.value ? 'Page introuvable' : 'Erreur'), robots: 'noindex' })
</script>

<template>
  <main class="flex min-h-screen flex-col items-center justify-center bg-ink px-4 text-center text-white">
    <img src="/media/logo.webp" alt="ZAREY" width="240" height="117" class="mb-10 w-40 rotate-6">
    <p class="h-display text-[30vw] leading-none text-zyellow md:text-[18rem]">{{ error.statusCode }}</p>
    <h1 class="mt-4 font-display text-3xl uppercase">{{ is404 ? 'Cette page a quitté le crew' : 'Un souci est survenu' }}</h1>
    <button type="button" class="btn btn-yellow mt-10" @click="clearError({ redirect: '/' })">Retour à l'accueil</button>
  </main>
</template>
