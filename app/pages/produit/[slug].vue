<script setup lang="ts">
import { PRODUCTS, type Size, getColorways, getProduct } from '#shared/catalog'
import { formatPrice } from '#shared/cart'

const route = useRoute()
const product = computed(() => getProduct(String(route.params.slug)))
if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Produit introuvable', fatal: true })
}
const p = computed(() => product.value!)
const colorways = computed(() => getColorways(p.value.group))
const related = computed(() => PRODUCTS.filter(x => x.slug !== p.value.slug).slice(0, 3))

const cart = useCartStore()
const size = ref<Size | null>(null)
const sizeError = ref(false)
const added = ref(false)

watch(() => route.params.slug, () => { size.value = null; added.value = false })

function addToCart() {
  if (!size.value) { sizeError.value = true; return }
  sizeError.value = false
  cart.add({ slug: p.value.slug, size: size.value, qty: 1 })
  added.value = true
  cart.open = true
}

useSeoMeta({
  title: () => `${p.value.name} ${p.value.colorway}`,
  description: () => p.value.description,
  ogImage: () => p.value.images[0],
})

// schema.org Product
useHead(() => ({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': `${p.value.name} ${p.value.colorway}`,
      'brand': { '@type': 'Brand', 'name': 'ZAREY' },
      'image': p.value.images,
      'description': p.value.description,
      'offers': { '@type': 'Offer', 'priceCurrency': 'EUR', 'price': (p.value.price / 100).toFixed(2), 'availability': 'https://schema.org/InStock' },
    }),
  }],
}))
</script>

<template>
  <div class="pt-24 md:pt-28">
    <div class="container-z">
      <nav aria-label="Fil d'Ariane" class="mb-6 text-sm">
        <ol class="flex gap-2 text-ink/60">
          <li><NuxtLink to="/" class="hover:text-ink">Accueil</NuxtLink> /</li>
          <li><NuxtLink to="/boutique" class="hover:text-ink">Boutique</NuxtLink> /</li>
          <li aria-current="page" class="text-ink">{{ p.name }} {{ p.colorway }}</li>
        </ol>
      </nav>

      <div class="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <!-- Galerie -->
        <ul class="grid gap-4 sm:grid-cols-2">
          <li v-for="(img, i) in p.images" :key="img" class="overflow-hidden rounded-[28px] border-2 border-ink bg-white" :class="i === 0 ? 'sm:col-span-2' : ''">
            <img :src="img" :alt="`${p.name} ${p.colorway} — vue ${i + 1}`" width="880" height="1100" :loading="i === 0 ? 'eager' : 'lazy'" :fetchpriority="i === 0 ? 'high' : undefined" class="aspect-[4/5] h-full w-full object-cover">
          </li>
        </ul>

        <!-- Infos -->
        <div class="lg:sticky lg:top-28 lg:self-start">
          <span v-if="p.badge" class="sticker mb-4 -rotate-3">{{ p.badge }}</span>
          <h1 class="h-display text-7xl md:text-8xl">{{ p.name }}</h1>
          <p class="mt-2 text-xl font-medium">{{ p.colorway }}</p>
          <p class="mt-4 inline-block rounded-full border-2 border-ink bg-white px-4 py-1 text-2xl font-bold shadow-sticker">{{ formatPrice(p.price) }}</p>
          <p class="mt-6 max-w-md text-lg text-ink/80">{{ p.description }}</p>

          <div v-if="colorways.length > 1" class="mt-8">
            <p class="mb-3 font-display text-lg uppercase">Coloris — {{ p.colorway }}</p>
            <ul class="flex flex-wrap gap-3">
              <li v-for="c in colorways" :key="c.slug">
                <NuxtLink
                  :to="`/produit/${c.slug}`"
                  class="block h-11 w-11 rounded-full border-2 border-ink transition hover:-translate-y-0.5"
                  :class="c.slug === p.slug ? 'ring-4 ring-zyellow ring-offset-2 ring-offset-cream' : ''"
                  :style="{ background: c.swatch }"
                  :aria-label="`${c.name} ${c.colorway}`"
                  :aria-current="c.slug === p.slug ? 'true' : undefined"
                />
              </li>
            </ul>
          </div>

          <fieldset class="mt-8" :aria-describedby="sizeError ? 'size-error' : undefined">
            <legend class="mb-3 font-display text-lg uppercase">Taille</legend>
            <div class="flex flex-wrap gap-2">
              <label v-for="s in p.sizes" :key="s" class="relative cursor-pointer">
                <input v-model="size" type="radio" name="size" :value="s" class="peer sr-only" @change="sizeError = false">
                <span class="grid h-12 min-w-14 place-items-center rounded-full border-2 border-ink bg-white px-4 font-bold transition peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zblue hover:bg-zyellow">{{ s }}</span>
              </label>
            </div>
            <p v-if="sizeError" id="size-error" class="mt-2 font-medium text-zred" role="alert">Choisis une taille.</p>
          </fieldset>

          <button type="button" class="btn btn-blue mt-8 w-full text-xl" @click="addToCart">
            {{ added ? 'Ajouté — encore un ?' : 'Ajouter au panier' }}
          </button>

          <div class="mt-10 divide-y-2 divide-ink border-y-2 border-ink">
            <details class="group py-4" open>
              <summary class="flex cursor-pointer list-none items-center justify-between font-display text-xl uppercase">Détails<span class="transition group-open:rotate-45" aria-hidden="true">+</span></summary>
              <ul class="mt-3 list-disc space-y-1 pl-5 text-ink/80">
                <li v-for="d in p.details" :key="d">{{ d }}</li>
              </ul>
            </details>
            <details class="group py-4">
              <summary class="flex cursor-pointer list-none items-center justify-between font-display text-xl uppercase">Livraison &amp; retours<span class="transition group-open:rotate-45" aria-hidden="true">+</span></summary>
              <p class="mt-3 text-ink/80">Expédition sous 2 à 5 jours ouvrés en France, Belgique, Luxembourg, Suisse et Monaco. Livraison offerte dès 80 €. Retours acceptés sous 14 jours (voir <NuxtLink to="/cgv" class="underline">CGV</NuxtLink>).</p>
            </details>
          </div>
        </div>
      </div>
    </div>

    <section class="container-z py-24">
      <h2 class="h-display mb-10 text-6xl md:text-7xl">Complète le fit</h2>
      <ul class="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="r in related" :key="r.slug"><ProductCard :product="r" /></li>
      </ul>
    </section>
  </div>
</template>
