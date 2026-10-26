<script setup lang="ts">
import type { Product } from '#shared/catalog'
import { formatPrice } from '#shared/cart'

const props = defineProps<{ product: Product, eager?: boolean }>()
const hoverImage = computed(() => props.product.images[1])
</script>

<template>
  <NuxtLink :to="`/produit/${product.slug}`" class="group block" :aria-label="`${product.name} ${product.colorway}, ${formatPrice(product.price)}`">
    <div class="relative aspect-[4/5] overflow-hidden rounded-[28px] border-2 border-ink bg-white shadow-sticker transition duration-300 ease-out group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-sticker-lg">
      <img
        :src="product.images[0]"
        :alt="`${product.name} ${product.colorway}`"
        width="880"
        height="1100"
        :loading="eager ? 'eager' : 'lazy'"
        class="absolute inset-0 h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
        :class="hoverImage ? 'group-hover:opacity-0' : ''"
      >
      <img
        v-if="hoverImage"
        :src="hoverImage"
        alt=""
        width="880"
        height="1100"
        loading="lazy"
        class="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition duration-500 ease-out group-hover:scale-100 group-hover:opacity-100"
      >
      <span v-if="product.badge" class="sticker absolute left-4 top-4 -rotate-6">{{ product.badge }}</span>
    </div>
    <div class="mt-4 flex items-start justify-between gap-3 px-1">
      <div>
        <h3 class="font-display text-2xl uppercase leading-none">{{ product.name }}</h3>
        <p class="mt-1 flex items-center gap-2 text-sm text-ink/70">
          <span class="h-3.5 w-3.5 rounded-full border-2 border-ink" :style="{ background: product.swatch }" />
          {{ product.colorway }}
        </p>
      </div>
      <p class="rounded-full border-2 border-ink bg-white px-3 py-1 font-bold">{{ formatPrice(product.price) }}</p>
    </div>
  </NuxtLink>
</template>
