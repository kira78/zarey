import type { Ref } from 'vue'

/**
 * Anime à l'entrée dans le viewport les éléments [data-reveal] contenus dans root.
 * Sans JS ou en mouvement réduit, le contenu reste simplement visible.
 */
export function useReveal(root: Ref<HTMLElement | null>) {
  onMounted(() => {
    const { $gsap, $reducedMotion } = useNuxtApp()
    if (!root.value || $reducedMotion || !$gsap) return
    const ctx = $gsap.context(() => {
      root.value!.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        $gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          delay: Number(el.dataset.revealDelay ?? 0),
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })
    }, root.value)
    onBeforeUnmount(() => ctx.revert())
  })
}
