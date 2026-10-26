<script setup lang="ts">
const cart = useCartStore()
onMounted(() => cart.hydrate())
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <a href="#contenu" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-zyellow focus:px-4 focus:py-2 focus:font-bold">
      Aller au contenu
    </a>
    <SitePreloader />
    <SiteHeader />
    <main id="contenu" class="flex-1">
      <slot />
    </main>
    <SiteFooter />
    <CartDrawer />
  </div>
</template>
