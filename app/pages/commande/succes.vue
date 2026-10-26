<script setup lang="ts">
import { formatPrice } from '#shared/cart'

useSeoMeta({ title: 'Merci pour ta commande', robots: 'noindex' })

const route = useRoute()
const cart = useCartStore()
const sessionId = typeof route.query.session_id === 'string' ? route.query.session_id : ''

const { data, status } = await useFetch(() => `/api/checkout/${encodeURIComponent(sessionId)}`, {
  immediate: !!sessionId,
  server: false,
})

watch(data, (d) => { if (d?.paid) cart.clear() }, { immediate: true })
</script>

<template>
  <section class="container-z flex min-h-[80vh] flex-col items-center justify-center pt-28 text-center">
    <img src="/media/logo.webp" alt="" width="240" height="117" class="mb-8 w-40 -rotate-6">
    <template v-if="data?.paid">
      <h1 class="h-display text-7xl md:text-9xl">Merci !</h1>
      <p class="mt-6 max-w-md text-lg">Ta commande de <strong>{{ formatPrice(data.amountTotal) }}</strong> est confirmée. Tu vas recevoir un email récapitulatif.</p>
    </template>
    <template v-else-if="status === 'pending'">
      <h1 class="h-display text-6xl">Vérification…</h1>
    </template>
    <template v-else>
      <h1 class="h-display text-6xl md:text-7xl">Commande en cours de traitement</h1>
      <p class="mt-6 max-w-md text-lg">Si ton paiement a été accepté, tu recevras un email de confirmation.</p>
    </template>
    <NuxtLink to="/boutique" class="btn btn-yellow mt-10">Retour à la boutique</NuxtLink>
  </section>
</template>
