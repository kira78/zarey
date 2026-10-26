<script setup lang="ts">
import { PRODUCTS } from '#shared/catalog'

useSeoMeta({
  title: 'Boutique',
  description: 'Tous les produits ZAREY : Oval Tee en 5 coloris et Oval Longsleeve.',
})

const root = ref<HTMLElement | null>(null)
useReveal(root)

const filters = [
  { id: 'all', label: 'Tout' },
  { id: 'oval-tee', label: 'T-shirts' },
  { id: 'oval-longsleeve', label: 'Manches longues' },
] as const
const active = ref<(typeof filters)[number]['id']>('all')
const products = computed(() => active.value === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.group === active.value))
</script>

<template>
  <div ref="root" class="pt-28 md:pt-36">
    <section class="container-z pb-24">
      <div class="mb-10 flex flex-wrap items-end justify-between gap-6 border-b-2 border-ink pb-8">
        <h1 class="h-display text-8xl md:text-[10rem]" data-reveal>Boutique</h1>
        <div class="flex flex-wrap gap-2" role="group" aria-label="Filtrer les produits">
          <button
            v-for="f in filters"
            :key="f.id"
            type="button"
            class="min-h-[44px] rounded-full border-2 border-ink px-4 font-bold transition"
            :class="active === f.id ? 'bg-ink text-white' : 'bg-white hover:bg-zyellow'"
            :aria-pressed="active === f.id"
            @click="active = f.id"
          >
            {{ f.label }}
          </button>
        </div>
      </div>
      <p class="mb-8 text-sm text-ink/70" aria-live="polite">{{ products.length }} produit{{ products.length > 1 ? 's' : '' }}</p>
      <ul class="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="(p, i) in products" :key="p.slug">
          <ProductCard :product="p" :eager="i < 3" />
        </li>
      </ul>
    </section>
  </div>
</template>
