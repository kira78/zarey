<script setup lang="ts">
const { public: cfg } = useRuntimeConfig()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-ink text-white">
    <MarqueeBand :words="['Zarey', 'Drop 01', 'Oval collection', 'Édition limitée']" tone="yellow" />
    <div class="container-z grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
      <div>
        <img src="/media/logo.webp" alt="ZAREY" width="240" height="117" loading="lazy" class="w-48">
        <p class="mt-6 max-w-sm text-white/70">Streetwear indépendant. Pièces en quantité limitée, pensées pour celles et ceux qui créent.</p>
      </div>
      <nav aria-label="Liens utiles">
        <h2 class="mb-4 font-display text-xl uppercase text-zyellow">Infos</h2>
        <ul class="space-y-2">
          <li><NuxtLink to="/boutique" class="hover:text-zyellow">Boutique</NuxtLink></li>
          <li><NuxtLink to="/cgv" class="hover:text-zyellow">CGV &amp; retours</NuxtLink></li>
          <li><NuxtLink to="/mentions-legales" class="hover:text-zyellow">Mentions légales</NuxtLink></li>
          <li><NuxtLink to="/confidentialite" class="hover:text-zyellow">Confidentialité</NuxtLink></li>
        </ul>
      </nav>
      <div>
        <h2 class="mb-4 font-display text-xl uppercase text-zyellow">Suis le crew</h2>
        <ul class="space-y-2">
          <li><a :href="cfg.tiktokUrl" target="_blank" rel="noopener noreferrer" class="hover:text-zyellow">TikTok — @zareypi</a></li>
          <li><a :href="cfg.instagramUrl" target="_blank" rel="noopener noreferrer" class="hover:text-zyellow">Instagram — @zarey.pi</a></li>
        </ul>
      </div>
    </div>
    <div class="container-z overflow-hidden">
      <p class="h-display select-none text-center text-[26vw] text-white/[0.06]" aria-hidden="true">ZAREY</p>
    </div>
    <div class="border-t border-white/15">
      <p class="container-z py-6 text-xs text-white/50">© {{ year }} ZAREY. Tous droits réservés. Toute reproduction des visuels, logos et designs est interdite.</p>
    </div>
  </footer>
</template>
