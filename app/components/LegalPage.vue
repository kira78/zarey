<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <article class="container-z max-w-3xl pb-24 pt-28 md:pt-36">
    <h1 class="h-display mb-10 text-6xl md:text-8xl">{{ title }}</h1>
    <div class="space-y-6 text-lg leading-relaxed [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:uppercase [&_mark]:bg-zyellow [&_mark]:px-1">
      <slot />
    </div>
  </article>
</template>
