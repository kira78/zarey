<script setup lang="ts">
import { MAX_QTY_PER_LINE, SHIPPING } from '#shared/catalog'
import { formatPrice } from '#shared/cart'

const cart = useCartStore()
const acceptTerms = ref(false)
const loading = ref(false)
const error = ref('')
const panel = ref<HTMLElement | null>(null)
const { $lenis } = useNuxtApp()

const remainingForFree = computed(() => Math.max(0, SHIPPING.freeFrom - cart.subtotal))

watch(() => cart.open, async (open) => {
  error.value = ''
  if (open) {
    $lenis?.stop()
    await nextTick()
    panel.value?.querySelector<HTMLElement>('button, a, input')?.focus()
  }
  else {
    $lenis?.start()
  }
})

onKeyStroke('Escape', () => { cart.open = false })

async function checkout() {
  if (!acceptTerms.value || loading.value) return
  loading.value = true
  error.value = ''
  try {
    const res = await $fetch<{ url: string }>('/api/checkout', {
      method: 'POST',
      body: { items: cart.items, acceptTerms: true },
    })
    // On ne suit qu'une redirection vers Stripe
    if (!res.url.startsWith('https://checkout.stripe.com/')) throw new Error('URL inattendue')
    window.location.assign(res.url)
  }
  catch (e: unknown) {
    const status = (e as { statusCode?: number })?.statusCode
    error.value = status === 503
      ? 'Le paiement en ligne arrive très bientôt. Repasse vite !'
      : status === 429
        ? 'Trop de tentatives. Réessaie dans une minute.'
        : 'Impossible de lancer le paiement. Réessaie dans un instant.'
    loading.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition enter-from-class="opacity-0" leave-to-class="opacity-0" enter-active-class="transition-opacity duration-300" leave-active-class="transition-opacity duration-300">
      <div v-if="cart.open" class="fixed inset-0 z-[70] bg-ink/60" aria-hidden="true" @click="cart.open = false" />
    </Transition>
    <Transition enter-from-class="translate-x-full" leave-to-class="translate-x-full" enter-active-class="transition-transform duration-500 ease-out" leave-active-class="transition-transform duration-300 ease-in">
      <aside
        v-if="cart.open"
        ref="panel"
        class="fixed bottom-0 right-0 top-0 z-[80] flex w-full max-w-md flex-col border-l-2 border-ink bg-cream"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        data-lenis-prevent
      >
        <div class="flex items-center justify-between border-b-2 border-ink bg-zyellow px-5 py-4">
          <h2 id="cart-title" class="h-display text-4xl">Panier <span class="font-sans text-lg font-bold">({{ cart.count }})</span></h2>
          <button type="button" class="grid h-11 w-11 place-items-center rounded-full border-2 border-ink bg-white" aria-label="Fermer le panier" @click="cart.open = false">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" /></svg>
          </button>
        </div>

        <div v-if="!cart.lines.length" class="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
          <p class="h-display text-5xl">Panier vide</p>
          <p class="text-ink/70">Le drop t'attend.</p>
          <NuxtLink to="/boutique" class="btn btn-blue" @click="cart.open = false">Voir la boutique</NuxtLink>
        </div>

        <template v-else>
          <p v-if="remainingForFree > 0" class="border-b-2 border-ink px-5 py-3 text-sm font-medium">
            Plus que <strong>{{ formatPrice(remainingForFree) }}</strong> pour la livraison offerte.
          </p>
          <p v-else class="border-b-2 border-ink bg-zblue px-5 py-3 text-sm font-bold text-white">Livraison offerte</p>

          <ul class="flex-1 divide-y-2 divide-ink/10 overflow-y-auto px-5">
            <li v-for="line in cart.lines" :key="line.slug + line.size" class="flex gap-4 py-4">
              <NuxtLink :to="`/produit/${line.slug}`" class="shrink-0 overflow-hidden rounded-xl border-2 border-ink bg-white" @click="cart.open = false">
                <img :src="line.product.images[0]" :alt="`${line.product.name} ${line.product.colorway}`" width="88" height="110" class="h-[110px] w-[88px] object-cover" loading="lazy">
              </NuxtLink>
              <div class="flex flex-1 flex-col">
                <div class="flex justify-between gap-2">
                  <div>
                    <p class="font-display text-xl uppercase leading-tight">{{ line.product.name }}</p>
                    <p class="text-sm text-ink/70">{{ line.product.colorway }} · Taille {{ line.size }}</p>
                  </div>
                  <p class="font-bold">{{ formatPrice(line.product.price * line.qty) }}</p>
                </div>
                <div class="mt-auto flex items-center justify-between">
                  <div class="flex items-center rounded-full border-2 border-ink bg-white">
                    <button type="button" class="grid h-9 w-9 place-items-center text-lg font-bold" :aria-label="`Retirer un ${line.product.name}`" @click="cart.setQty(line.slug, line.size, line.qty - 1)">−</button>
                    <span class="w-6 text-center font-bold tabular-nums" aria-live="polite">{{ line.qty }}</span>
                    <button type="button" class="grid h-9 w-9 place-items-center text-lg font-bold disabled:opacity-30" :disabled="line.qty >= MAX_QTY_PER_LINE" :aria-label="`Ajouter un ${line.product.name}`" @click="cart.setQty(line.slug, line.size, line.qty + 1)">+</button>
                  </div>
                  <button type="button" class="text-sm underline underline-offset-4 hover:text-zred" @click="cart.remove(line.slug, line.size)">Retirer</button>
                </div>
              </div>
            </li>
          </ul>

          <div class="space-y-4 border-t-2 border-ink bg-white px-5 py-5">
            <dl class="space-y-1 text-sm">
              <div class="flex justify-between"><dt>Sous-total</dt><dd class="font-bold">{{ formatPrice(cart.subtotal) }}</dd></div>
              <div class="flex justify-between"><dt>Livraison</dt><dd>{{ cart.shipping === 0 ? 'Offerte' : formatPrice(cart.shipping) }}</dd></div>
              <div class="flex justify-between border-t border-ink/10 pt-2 text-lg"><dt class="font-display uppercase">Total TTC</dt><dd class="font-bold">{{ formatPrice(cart.subtotal + cart.shipping) }}</dd></div>
            </dl>
            <label class="flex cursor-pointer items-start gap-3 text-sm">
              <input v-model="acceptTerms" type="checkbox" class="mt-0.5 h-5 w-5 shrink-0 accent-zblue">
              <span>J'accepte les <NuxtLink to="/cgv" class="underline" @click="cart.open = false">conditions générales de vente</NuxtLink>.</span>
            </label>
            <p v-if="error" class="rounded-xl border-2 border-zred bg-zred/10 px-3 py-2 text-sm font-medium" role="alert">{{ error }}</p>
            <button type="button" class="btn btn-blue w-full" :disabled="!acceptTerms || loading" @click="checkout">
              {{ loading ? 'Redirection…' : 'Payer en sécurité' }}
            </button>
            <p class="flex items-center justify-center gap-2 text-xs text-ink/60">
              <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden="true"><path d="M6 0a4 4 0 0 0-4 4v2H1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-1V4a4 4 0 0 0-4-4Zm-2 6V4a2 2 0 1 1 4 0v2H4Z" /></svg>
              Paiement chiffré via Stripe — CB, Apple Pay, Google Pay
            </p>
          </div>
        </template>
      </aside>
    </Transition>
  </Teleport>
</template>
