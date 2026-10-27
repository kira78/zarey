import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin((nuxtApp) => {
  gsap.registerPlugin(ScrollTrigger)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let lenis: Lenis | null = null
  if (!reduced) {
    lenis = new Lenis({ lerp: 0.1, anchors: true })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(time => lenis?.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
  }

  nuxtApp.hook('page:finish', () => {
    lenis?.scrollTo(0, { immediate: true })
    requestAnimationFrame(() => ScrollTrigger.refresh())
  })

  return { provide: { lenis, gsap, ScrollTrigger, reducedMotion: reduced } }
})
