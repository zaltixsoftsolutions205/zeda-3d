import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cam, device } from '../lib/camState'
import { sectionCenter } from '../lib/scroll'
import { startSmoothScroll } from '../lib/smooth'

gsap.registerPlugin(ScrollTrigger)

/**
 * Builds ONE continuous GSAP timeline, scrubbed by the page scroll, that drives
 * the camera's section coordinate `cam.u`. Each section centre maps to an integer
 * `u`; the camera path (see scenes/cameraPath.ts) interpolates between them.
 * Scrolling backwards simply reverses the timeline.
 */
export function useScrollCamera() {
  useLayoutEffect(() => {
    const stopSmooth = device.reduced ? () => {} : startSmoothScroll()
    let ctx: gsap.Context | null = null
    let raf = 0

    const build = () => {
      ctx?.revert()
      ctx = gsap.context(() => {
        const secs = gsap.utils.toArray<HTMLElement>('[data-section]')
        if (!secs.length) return
        const max = Math.max(1, ScrollTrigger.maxScroll(window))
        const centers = secs.map(sectionCenter)
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: document.documentElement,
            start: 0,
            end: max,
            scrub: device.reduced ? true : 0.8,
            invalidateOnRefresh: true,
          },
        })
        // total length == scrollable distance, so timeline time == scroll pixels
        tl.to({}, { duration: max }, 0)
        // initial state (also correct when the page loads mid-scroll)
        tl.set(cam, { u: 0 }, 0)
        for (let i = 1; i < secs.length; i++) {
          const from = centers[i - 1]
          const dur = Math.max(1, centers[i] - from)
          // power2.inOut = the camera dwells on every location while its section reads,
          // then glides to the next one.
          tl.to(cam, { u: i, duration: dur, ease: 'power2.inOut' }, from)
        }
      })
    }

    const schedule = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(build)
    }

    build()
    const onResize = () => schedule()
    window.addEventListener('resize', onResize)
    // layout can change when webfonts / images settle
    window.addEventListener('load', onResize)
    document.fonts?.ready.then(schedule)
    const ro = new ResizeObserver(schedule)
    ro.observe(document.body)

    const onPointer = (e: PointerEvent) => {
      cam.px = (e.clientX / window.innerWidth) * 2 - 1
      cam.py = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('load', onResize)
      window.removeEventListener('pointermove', onPointer)
      stopSmooth()
      ctx?.revert()
    }
  }, [])
}
