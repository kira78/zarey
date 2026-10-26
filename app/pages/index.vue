<script setup lang="ts">
import { PRODUCTS } from '#shared/catalog'

useSeoMeta({
  title: 'Streetwear indépendant',
  ogTitle: 'ZAREY — Drop 01 : Oval Collection',
  description: 'ZAREY — streetwear indépendant. Découvre le Drop 01 : Oval Tee en 5 coloris et Oval Longsleeve.',
})

const root = ref<HTMLElement | null>(null)
const hero = ref<HTMLElement | null>(null)
const heroVideo = ref<HTMLVideoElement | null>(null)
const manifesto = ref<HTMLElement | null>(null)
const film = ref<{ open: () => void } | null>(null)
const playing = ref(false)

useReveal(root)

function toggleVideo() {
  const v = heroVideo.value
  if (!v) return
  if (v.paused) { void v.play(); playing.value = true }
  else { v.pause(); playing.value = false }
}

const lookFilters = ['Tous', 'Cité', 'Parking', 'Crew', 'Studio'] as const
type LookFilter = (typeof lookFilters)[number]
const activeLook = ref<LookFilter>('Tous')
const looks: { src: string, alt: string, tag: Exclude<LookFilter, 'Tous'>, tall?: boolean }[] = [
  { src: '/media/cite-1', alt: 'Oval Longsleeve blanc porté devant un immeuble', tag: 'Cité', tall: true },
  { src: '/media/parking-2', alt: 'Oval Tee blanc porté appuyé sur une voiture', tag: 'Parking' },
  { src: '/media/crew-2', alt: 'Le crew ZAREY en t-shirts noirs', tag: 'Crew' },
  { src: '/media/porte-bleue-1', alt: 'Oval Longsleeve blanc devant une porte bleue', tag: 'Cité', tall: true },
  { src: '/media/studio-1', alt: 'Deux membres du crew en studio', tag: 'Studio' },
  { src: '/media/parking-3', alt: 'Oval Tee blanc, assis dans une voiture', tag: 'Parking', tall: true },
  { src: '/media/crew-1', alt: 'Le crew ZAREY réuni en bas des immeubles', tag: 'Crew' },
  { src: '/media/cite-5', alt: 'Oval Longsleeve blanc dans la rue', tag: 'Cité' },
  { src: '/media/vestiaire-1', alt: 'Oval Tee noir dans un vestiaire', tag: 'Studio', tall: true },
  { src: '/media/cite-6', alt: 'Oval Longsleeve blanc sous la pluie', tag: 'Cité' },
  { src: '/media/parking-4', alt: 'Oval Tee blanc sur un passage piéton', tag: 'Parking' },
  { src: '/media/crew-4', alt: 'Le crew ZAREY sur les marches', tag: 'Crew', tall: true },
]
const visibleLooks = computed(() => activeLook.value === 'Tous' ? looks : looks.filter(l => l.tag === activeLook.value))

const manifestoWords = 'Violon, guidon, pinceau, skate. Une génération qui crée avec ce qu’elle a. ZAREY habille celles et ceux qui ne demandent la permission à personne.'.split(' ')

onMounted(() => {
  const { $gsap, $reducedMotion } = useNuxtApp()
  if ($reducedMotion) return
  if (heroVideo.value) {
    heroVideo.value.play().then(() => { playing.value = true }).catch(() => { playing.value = false })
  }
  const ctx = $gsap.context(() => {
    $gsap.from('.hero-char', { yPercent: 110, rotate: 8, stagger: 0.06, duration: 1.1, ease: 'expo.out', delay: 0.2 })
    $gsap.from('.hero-sub', { opacity: 0, y: 20, duration: 0.8, delay: 0.7, stagger: 0.1 })
    $gsap.to('.hero-media', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: hero.value, start: 'top top', end: 'bottom top', scrub: true } })
    $gsap.fromTo('.manifesto-word', { opacity: 0.12 }, {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: manifesto.value, start: 'top 75%', end: 'bottom 55%', scrub: true },
    })
  }, root.value!)
  onBeforeUnmount(() => ctx.revert())
})
</script>

<template>
  <div ref="root">
    <!-- HERO -->
    <section ref="hero" class="relative flex h-[100svh] min-h-[560px] items-end overflow-hidden bg-ink text-white">
      <div class="hero-media absolute inset-0 -top-[10%] h-[120%]">
        <video
          ref="heroVideo"
          class="h-full w-full object-cover"
          src="/media/hero-loop.mp4"
          poster="/media/hero-poster.webp"
          muted
          loop
          playsinline
          preload="metadata"
          aria-hidden="true"
        />
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/40" />

      <div class="container-z relative pb-10 md:pb-14">
        <p class="hero-sub sticker mb-5 -rotate-3">Drop 01 — Oval Collection</p>
        <h1 class="h-display overflow-hidden text-[27vw] md:text-[22vw] lg:text-[19vw]" aria-label="ZAREY">
          <span v-for="(c, i) in 'ZAREY'" :key="i" class="hero-char inline-block" aria-hidden="true">{{ c }}</span>
        </h1>
        <div class="mt-6 flex flex-wrap items-center gap-4">
          <NuxtLink to="/boutique" class="hero-sub btn btn-yellow">Shop le drop</NuxtLink>
          <button type="button" class="hero-sub btn btn-white" @click="film?.open()">
            <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor" aria-hidden="true"><path d="M0 0l14 8-14 8z" /></svg>
            Voir le film
          </button>
        </div>
      </div>

      <button
        type="button"
        class="absolute right-4 top-20 grid h-12 w-12 place-items-center rounded-full border-2 border-white/80 bg-ink/40 backdrop-blur md:bottom-6 md:right-8 md:top-auto"
        :aria-label="playing ? 'Mettre la vidéo en pause' : 'Lancer la vidéo'"
        @click="toggleVideo"
      >
        <svg v-if="playing" width="14" height="16" viewBox="0 0 14 16" fill="currentColor" aria-hidden="true"><path d="M1 0h4v16H1zM9 0h4v16H9z" /></svg>
        <svg v-else width="14" height="16" viewBox="0 0 14 16" fill="currentColor" aria-hidden="true"><path d="M0 0l14 8-14 8z" /></svg>
      </button>
    </section>

    <MarqueeBand :words="['Oval Tee', '5 coloris', 'Oval Longsleeve', 'Quantités limitées']" />

    <!-- DROP -->
    <section id="drop" class="container-z py-20 md:py-28">
      <div class="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div data-reveal>
          <span class="sticker mb-4 rotate-2 bg-zpink">Nouveau</span>
          <h2 class="h-display text-7xl md:text-9xl">Le drop</h2>
        </div>
        <p class="max-w-sm text-lg text-ink/80" data-reveal data-reveal-delay="0.1">
          Un logo ovale, cinq couleurs, une coupe oversize. Choisis ton camp.
        </p>
      </div>
      <div class="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="(p, i) in PRODUCTS" :key="p.slug" data-reveal :data-reveal-delay="(i % 3) * 0.08">
          <ProductCard :product="p" :eager="i < 3" />
        </div>
      </div>
      <div class="mt-14 text-center" data-reveal>
        <NuxtLink to="/boutique" class="btn btn-ink">Toute la boutique</NuxtLink>
      </div>
    </section>

    <!-- COLORIS -->
    <section class="border-y-2 border-ink bg-zblue text-white">
      <div class="container-z grid items-center gap-10 py-20 md:grid-cols-2 md:py-28">
        <div class="overflow-hidden rounded-[28px] border-2 border-ink shadow-sticker-lg" data-reveal>
          <img src="/media/flatlay-1-1600.webp" srcset="/media/flatlay-1-800.webp 800w, /media/flatlay-1-1600.webp 1600w" sizes="(min-width: 768px) 50vw, 100vw" alt="Les Oval Tee bleu roi, rose et blanc posés à plat" width="1600" height="2133" loading="lazy" class="w-full">
        </div>
        <div data-reveal data-reveal-delay="0.1">
          <h2 class="h-display text-7xl text-zyellow md:text-8xl">5 coloris.<br>1 ovale.</h2>
          <p class="mt-6 max-w-md text-lg text-white/85">Bleu roi, rose, kaki, noir, blanc. Chaque Oval Tee porte le logo côté cœur, avec un liseré qui claque.</p>
          <ul class="mt-8 flex gap-3" aria-label="Coloris disponibles">
            <li v-for="p in PRODUCTS.filter(x => x.group === 'oval-tee')" :key="p.slug">
              <NuxtLink :to="`/produit/${p.slug}`" class="block h-12 w-12 rounded-full border-2 border-ink shadow-sticker transition hover:-translate-y-1" :style="{ background: p.swatch }" :aria-label="`Oval Tee ${p.colorway}`" />
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- LOOKBOOK -->
    <section id="lookbook" class="bg-ink py-20 text-white md:py-28">
      <div class="container-z">
        <div class="mb-10 flex flex-wrap items-end justify-between gap-6">
          <h2 class="h-display text-7xl md:text-9xl" data-reveal>Lookbook</h2>
          <div class="flex flex-wrap gap-2" role="group" aria-label="Filtrer le lookbook">
            <button
              v-for="f in lookFilters"
              :key="f"
              type="button"
              class="min-h-[44px] rounded-full border-2 px-4 font-bold transition"
              :class="activeLook === f ? 'border-zyellow bg-zyellow text-ink' : 'border-white/30 hover:border-white'"
              :aria-pressed="activeLook === f"
              @click="activeLook = f"
            >
              {{ f }}
            </button>
          </div>
        </div>
        <TransitionGroup tag="ul" class="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 [grid-auto-flow:dense]" move-class="transition-transform duration-500" enter-from-class="opacity-0 scale-95" enter-active-class="transition duration-500" leave-active-class="hidden">
          <li v-for="l in visibleLooks" :key="l.src" class="group relative overflow-hidden rounded-2xl" :class="l.tall ? 'row-span-2' : ''">
            <img :src="`${l.src}-800.webp`" :srcset="`${l.src}-800.webp 800w, ${l.src}-1600.webp 1600w`" sizes="(min-width: 768px) 25vw, 50vw" :alt="l.alt" loading="lazy" width="800" height="1000" class="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105">
            <span class="absolute bottom-3 left-3 rounded-full bg-ink/70 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur">{{ l.tag }}</span>
          </li>
        </TransitionGroup>
      </div>
    </section>

    <!-- FILM / MANIFESTE -->
    <section id="film" class="relative overflow-hidden bg-cream py-24 md:py-36">
      <div class="container-z grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <p ref="manifesto" class="h-display text-5xl leading-[0.95] md:text-7xl">
          <span v-for="(w, i) in manifestoWords" :key="i" class="manifesto-word">{{ w }} </span>
        </p>
        <button type="button" class="group relative block overflow-hidden rounded-[28px] border-2 border-ink text-left shadow-sticker-lg" @click="film?.open()">
          <img src="/media/hero-poster.webp" alt="" width="1024" height="576" loading="lazy" class="aspect-video w-full object-cover transition duration-700 group-hover:scale-105">
          <span class="absolute inset-0 grid place-items-center bg-ink/30">
            <span class="btn btn-yellow">
              <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor" aria-hidden="true"><path d="M0 0l14 8-14 8z" /></svg>
              Le film — 1 min 33
            </span>
          </span>
        </button>
      </div>
    </section>

    <!-- COMMUNAUTÉ -->
    <section class="border-t-2 border-ink bg-zred text-white">
      <div class="container-z flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-center md:py-20">
        <h2 class="h-display text-6xl md:text-8xl" data-reveal>Rejoins<br>le crew</h2>
        <div class="flex flex-wrap gap-4" data-reveal data-reveal-delay="0.1">
          <a :href="useRuntimeConfig().public.tiktokUrl" target="_blank" rel="noopener noreferrer" class="btn btn-white">TikTok @zareypi</a>
          <a :href="useRuntimeConfig().public.instagramUrl" target="_blank" rel="noopener noreferrer" class="btn btn-yellow">Instagram @zarey.pi</a>
        </div>
      </div>
    </section>

    <FilmDialog ref="film" />
  </div>
</template>
