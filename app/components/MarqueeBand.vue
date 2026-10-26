<script setup lang="ts">
withDefaults(defineProps<{ words: string[], tone?: 'blue' | 'yellow' | 'red' }>(), { tone: 'blue' })
</script>

<template>
  <div
    class="overflow-hidden border-y-2 border-ink py-3"
    :class="{ 'bg-zblue text-zyellow': tone === 'blue', 'bg-zyellow text-ink': tone === 'yellow', 'bg-zred text-white': tone === 'red' }"
    aria-hidden="true"
  >
    <div class="animate-marquee flex w-max">
      <div v-for="n in 2" :key="n" class="flex shrink-0 items-center">
        <template v-for="(w, i) in [...words, ...words]" :key="`${n}-${i}`">
          <span class="px-6 font-display text-3xl uppercase md:text-5xl">{{ w }}</span>
          <svg width="44" height="22" viewBox="0 0 44 22" class="shrink-0" aria-hidden="true">
            <ellipse cx="22" cy="11" rx="20" ry="9" fill="none" stroke="currentColor" stroke-width="3" />
          </svg>
        </template>
      </div>
    </div>
  </div>
</template>
