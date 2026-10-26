<script setup lang="ts">
useSeoMeta({ title: 'Paiement annulé', robots: 'noindex' })
const cart = useCartStore()
</script>

<template>
  <section class="container-z flex min-h-[80vh] flex-col items-center justify-center pt-28 text-center">
    <h1 class="h-display text-6xl md:text-8xl">Paiement annulé</h1>
    <p class="mt-6 max-w-md text-lg">Aucun montant n'a été débité. Ton panier t'attend toujours.</p>
    <button type="button" class="btn btn-blue mt-10" @click="cart.open = true">Revoir mon panier</button>
  </section>
</template>
