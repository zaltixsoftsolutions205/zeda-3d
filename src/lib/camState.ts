/**
 * Mutable, non-reactive state shared between the DOM scroll timeline (GSAP)
 * and the render loop (R3F). Mutating this never triggers React re-renders.
 */
export const cam = {
  /** Continuous section coordinate: 0 = Home … 6 = Final CTA (fractions in between). */
  u: 0,
  /** 0 = physical school, 1 = fully inside the digital environment. */
  digital: 0,
  /** Normalised pointer position (-1..1) for subtle parallax. */
  px: 0,
  py: 0,
}

export const device = {
  /** 0 = desktop, 1 = tablet, 2 = mobile */
  tier: 0 as 0 | 1 | 2,
  reduced: false,
}

export const SECTION_IDS = [
  'home',
  'about',
  'features',
  'why',
  'clients',
  'testimonials',
  'contact',
] as const
