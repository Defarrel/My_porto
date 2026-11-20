import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useLayoutEffect } from 'react'
import { planet, POSES, target, type Pose } from './scrollState'

gsap.registerPlugin(ScrollTrigger)

// Smooth scroll + every scroll-driven animation on the page.
export function useScrollScene() {
  useLayoutEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = reduce ? null : new Lenis()
    const raf = (t: number) => lenis?.raf(t * 1000)
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)
    }

    const ctx = gsap.context(() => {
      gsap.to(planet, { intro: 1, duration: reduce ? 0 : 2.4, ease: 'expo.out', delay: 0.2 })

      // As each section scrolls into view, move the planet from the previous pose to its own.
      const steps: [string, Pose, Pose][] = [
        ['#about', POSES.hero, POSES.about],
        ['#work', POSES.about, POSES.work],
        ['#contact', POSES.work, POSES.contact],
      ]
      for (const [trigger, from, to] of steps) {
        gsap.fromTo(target, { ...from }, {
          ...to,
          ease: 'sine.inOut',
          immediateRender: false,
          scrollTrigger: { trigger, start: 'top bottom', end: 'top top', scrub: true },
        })
      }

      if (!reduce) {
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            y: 40,
            opacity: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
          })
        })
      }
    })

    return () => {
      ctx.revert()
      if (lenis) {
        gsap.ticker.remove(raf)
        lenis.destroy()
      }
    }
  }, [])
}
