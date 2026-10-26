<script setup lang="ts">
// Écran d'intro façon "jauge" (clin d'œil GASS) : 1re visite de la session uniquement,
// jamais bloquant (le contenu est déjà rendu dessous), ignoré en mouvement réduit.
const visible = ref(false)
const progress = ref(0)

onMounted(() => {
  const { $gsap, $reducedMotion } = useNuxtApp()
  let seen = true
  try {
    seen = sessionStorage.getItem('zarey-intro') === '1'
    sessionStorage.setItem('zarey-intro', '1')
  }
  catch { /* stockage indisponible : pas d'intro */ }
  if (seen || $reducedMotion) return

  visible.value = true
  const counter = { v: 0 }
  $gsap.timeline({ onComplete: () => { visible.value = false } })
    .to(counter, { v: 100, duration: 1.3, ease: 'power2.inOut', onUpdate: () => { progress.value = Math.round(counter.v) } })
    .to('.preloader-logo', { scale: 1.15, rotate: -6, duration: 0.25, ease: 'back.out(3)' }, '-=0.15')
    .to('.preloader', { yPercent: -100, duration: 0.7, ease: 'expo.inOut' })
})
</script>

<template>
  <div v-if="visible" class="preloader fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink text-white" aria-hidden="true">
    <img src="/media/logo.webp" alt="" width="240" height="117" class="preloader-logo w-48 md:w-60">
    <div class="absolute bottom-6 left-4 right-4 flex items-end justify-between md:left-8 md:right-8">
      <span class="font-bubble text-sm text-zyellow">jeunesse sans pareille</span>
      <span class="font-display text-6xl tabular-nums md:text-8xl">{{ progress }}<span class="text-2xl text-zyellow">%</span></span>
    </div>
    <div class="absolute bottom-0 left-0 h-1.5 bg-zyellow" :style="{ width: `${progress}%` }" />
  </div>
</template>
