import type { Kit } from './kit'
import { Local } from './local'

const SKIN = ['#e0ac82', '#c98f63', '#a86f47', '#8d5a38', '#e8bb94']
const HAIR = ['#1a1412', '#241b16', '#2d2018', '#111111']
const BAG = ['#12909a', '#ee5a48', '#fbaf22', '#35bfa6', '#0b5d68', '#ff8a7a']

export interface PersonOpts {
  shirt?: string
  pants?: string
  skin?: number
  bag?: boolean
  scale?: number
  y0?: number
  stride?: number
  seated?: boolean
  arms?: 'down' | 'desk' | 'up'
  girl?: boolean
}

/** Low-poly human built from instanced boxes/spheres (all tinted via the white "paper" material). */
export function person(kit: Kit, x: number, z: number, ang: number, o: PersonOpts = {}) {
  const s = o.scale ?? 0.95
  const shirt = o.shirt ?? '#f3f1ea'
  const pants = o.pants ?? '#123d2e'
  const skin = SKIN[(o.skin ?? Math.floor(Math.abs(Math.sin(x * 12.9 + z * 78.2)) * 5)) % 5]
  const hair = HAIR[Math.floor(Math.abs(Math.sin(x * 3.1 + z * 9.7)) * 4) % 4]
  const L = new Local(kit, x, z, ang, o.y0 ?? 0)
  const st = o.stride ?? 0

  if (o.seated) {
    // thighs forward, shins down
    for (const sx of [-1, 1]) {
      L.box('paper', sx * 0.09 * s, 0.44 * s, 0.22 * s, 0.13 * s, 0.13 * s, 0.4 * s, pants)
      L.box('paper', sx * 0.09 * s, 0.0, 0.4 * s, 0.12 * s, 0.46 * s, 0.12 * s, pants)
      L.box('rubber', sx * 0.09 * s, 0.0, 0.45 * s, 0.12 * s, 0.07 * s, 0.22 * s)
    }
    L.box('paper', 0, 0.5 * s, 0, 0.36 * s, 0.5 * s, 0.2 * s, shirt)
    L.sph('paper', 0, 1.06 * s, 0.02 * s, 0.21 * s, 1, skin)
    L.sph('paper', 0, 1.12 * s, -0.01 * s, 0.225 * s, 0.7, hair)
    for (const sx of [-1, 1]) {
      L.box('paper', sx * 0.22 * s, 0.72 * s, 0.18 * s, 0.09 * s, 0.09 * s, 0.4 * s, shirt)
    }
    return
  }

  for (const sx of [-1, 1]) {
    const f = sx * st * 0.14
    L.box('paper', sx * 0.09 * s, 0, f, 0.13 * s, 0.74 * s, 0.14 * s, pants)
    L.box('rubber', sx * 0.09 * s, 0, f + 0.04 * s, 0.13 * s, 0.07 * s, 0.24 * s)
  }
  L.box('paper', 0, 0.72 * s, 0, 0.36 * s, 0.52 * s, 0.2 * s, shirt)
  if (o.girl) L.box('paper', 0, 0.55 * s, 0, 0.4 * s, 0.26 * s, 0.24 * s, pants)
  L.sph('paper', 0, 1.29 * s, 0, 0.215 * s, 1, skin)
  L.sph('paper', 0, 1.35 * s, -0.01 * s, 0.23 * s, 0.7, hair)
  const up = o.arms === 'up'
  for (const sx of [-1, 1]) {
    if (up) L.box('paper', sx * 0.24 * s, 1.0 * s, 0.05 * s, 0.09 * s, 0.4 * s, 0.1 * s, shirt)
    else L.box('paper', sx * 0.23 * s, 0.72 * s, sx * st * -0.1 * s, 0.09 * s, 0.5 * s, 0.1 * s, shirt)
  }
  if (o.bag !== false)
    L.box('paper', 0, 0.78 * s, -0.17 * s, 0.3 * s, 0.4 * s, 0.14 * s, BAG[Math.floor(Math.abs(Math.sin(x * 5.3 + z * 1.7)) * 6) % 6])
}
