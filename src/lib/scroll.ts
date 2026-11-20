import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { device, SECTION_IDS } from './camState'
import { getLenis } from './smooth'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

/** Scroll position at which a section is centred in the viewport (same maths the camera timeline uses). */
export function sectionCenter(el: HTMLElement): number {
  const max = ScrollTrigger.maxScroll(window)
  const top = el.getBoundingClientRect().top + window.scrollY
  return Math.max(0, Math.min(max, top + el.offsetHeight / 2 - window.innerHeight / 2))
}

export function scrollToSection(id: (typeof SECTION_IDS)[number] | string) {
  const el = document.getElementById(id)
  if (!el) return
  const y = sectionCenter(el)
  if (device.reduced) {
    window.scrollTo({ top: y })
    return
  }
  const dist = Math.abs(window.scrollY - y)
  const l = getLenis()
  if (l) {
    l.scrollTo(y, { duration: Math.min(2.8, Math.max(1.2, dist / 2000)), easing: (t: number) => 1 - Math.pow(1 - t, 4) * (1 - t * 0) })
    return
  }
  gsap.to(window, {
    duration: Math.min(2.6, Math.max(1.1, dist / 2200)),
    scrollTo: { y, autoKill: true },
    ease: 'power3.inOut',
    overwrite: true,
  })
}
