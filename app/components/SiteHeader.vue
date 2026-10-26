<script setup lang="ts">
const cart = useCartStore()
const route = useRoute()
const menuOpen = ref(false)
const { y } = useWindowScroll()
const solid = computed(() => y.value > 40 || route.path !== '/')

watch(() => route.fullPath, () => { menuOpen.value = false })

const links = [
  { to: '/boutique', label: 'Boutique' },
  { to: '/#lookbook', label: 'Lookbook' },
  { to: '/#film', label: 'Le film' },
]
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
    :class="solid ? 'bg-cream/95 text-ink shadow-[0_2px_0_0_#0d0d0d] backdrop-blur' : 'bg-transparent text-white'"
  >
    <div class="container-z flex h-16 items-center justify-between gap-4 md:h-20">
      <NuxtLink to="/" class="shrink-0" aria-label="ZAREY — accueil">
        <img src="/media/logo.webp" alt="ZAREY" width="120" height="58" class="h-10 w-auto transition-transform duration-300 hover:-rotate-6 md:h-12">
      </NuxtLink>

      <nav class="hidden md:block" aria-label="Navigation principale">
        <ul class="flex items-center gap-8 font-display text-xl uppercase tracking-wide">
          <li v-for="l in links" :key="l.to">
            <NuxtLink :to="l.to" class="relative py-2 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:origin-left after:scale-x-0 after:bg-zred after:transition-transform after:duration-300 hover:after:scale-x-100">
              {{ l.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="btn btn-yellow min-h-[44px] px-4 text-base"
          :aria-label="`Ouvrir le panier, ${cart.count} article${cart.count > 1 ? 's' : ''}`"
          @click="cart.open = true"
        >
          Panier
          <span class="grid h-6 min-w-6 place-items-center rounded-full bg-ink px-1.5 font-sans text-xs font-bold text-white">{{ cart.count }}</span>
        </button>
        <button
          type="button"
          class="grid h-11 w-11 place-items-center rounded-full border-2 border-current md:hidden"
          :aria-expanded="menuOpen"
          aria-controls="menu-mobile"
          aria-label="Menu"
          @click="menuOpen = !menuOpen"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path v-if="!menuOpen" d="M3 6h14M3 14h14" />
            <path v-else d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>
      </div>
    </div>

    <nav v-show="menuOpen" id="menu-mobile" class="border-t-2 border-ink bg-zblue text-white md:hidden" aria-label="Navigation mobile">
      <ul class="container-z flex flex-col py-4">
        <li v-for="l in links" :key="l.to">
          <NuxtLink :to="l.to" class="block py-3 font-display text-4xl uppercase">{{ l.label }}</NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>
