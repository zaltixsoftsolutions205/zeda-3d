import { Vector3 } from 'three'

/** Vertical offset of the digital environment above the physical campus. */
export const DIGITAL_Y = 300

export interface Key {
  /** Section coordinate: integers are section centres, fractions are waypoints in between. */
  u: number
  p: [number, number, number]
  l: [number, number, number]
  fov: number
  /** Waypoint can be skipped on small screens (shorter, simpler camera path). */
  opt?: boolean
}

const D = DIGITAL_Y

/**
 * The whole story as one camera path through the campus:
 * aerial → entrance → lobby → corridor → classroom → corridor → admin office →
 * (dive into the principal's monitor) → digital space → campus wide → aerial pull-back.
 */
export const KEYS: Key[] = [
  { u: 0, p: [64, 46, 86], l: [-16, 5, 4], fov: 38 },
  { u: 0.5, p: [46, 30, 72], l: [0, 7, 4], fov: 40, opt: true },
  { u: 1, p: [0, 3.6, 30], l: [0, 4.8, 8], fov: 50 },
  { u: 1.45, p: [0, 2.2, 13.5], l: [0, 2.3, 0], fov: 62, opt: true },
  { u: 1.6, p: [0, 1.95, 8.2], l: [0, 1.8, -5], fov: 64 },
  { u: 1.78, p: [-3.2, 1.85, 1.3], l: [-14, 1.7, 1.0], fov: 64 },
  { u: 1.9, p: [-11, 1.85, 0.95], l: [-15, 1.5, 3.8], fov: 64, opt: true },
  { u: 2, p: [-15, 1.8, 3.5], l: [-21.5, 1.35, 5.7], fov: 62 },
  { u: 2.3, p: [-14.6, 1.85, 1.0], l: [-5, 1.75, 0.9], fov: 64, opt: true },
  { u: 2.75, p: [11.5, 1.85, 0.95], l: [15, 1.5, 3.6], fov: 64 },
  { u: 3, p: [15.2, 1.8, 3.5], l: [20.4, 1.25, 6.0], fov: 58 },
  { u: 3.5, p: [19.1, 1.32, 5.85], l: [20.5, 1.3, 5.85], fov: 46 },
  { u: 4, p: [0, D + 10, 44], l: [0, D + 6, 0], fov: 50 },
  { u: 4.5, p: [-52, 120, 104], l: [0, 14, 0], fov: 44, opt: true },
  { u: 5, p: [-64, 36, 92], l: [4, 8, 4], fov: 42 },
  { u: 6, p: [34, 92, 176], l: [0, -22, 6], fov: 38 },
]

export const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** 0 → 1 when diving into the monitor, 1 → 0 when returning to the physical campus. */
export const digitalAmount = (u: number) =>
  Math.min(1, Math.max(0, smooth(3.3, 3.8, u) - smooth(4.35, 4.85, u)))

export interface Sample {
  p: Vector3
  l: Vector3
  fov: number
}

const tmpA = new Vector3()
const tmpB = new Vector3()

function hermite(out: Vector3, k: Key[], i: number, t: number, kind: 'p' | 'l') {
  const n = k.length
  const a = k[i]
  const b = k[i + 1]
  const pa = k[Math.max(0, i - 1)]
  const nb = k[Math.min(n - 1, i + 2)]
  const h = b.u - a.u
  const s = t
  const s2 = s * s
  const s3 = s2 * s
  const h00 = 2 * s3 - 3 * s2 + 1
  const h10 = s3 - 2 * s2 + s
  const h01 = -2 * s3 + 3 * s2
  const h11 = s3 - s2
  const av = a[kind]
  const bv = b[kind]
  const pv = pa[kind]
  const nv = nb[kind]
  const du0 = Math.max(1e-4, b.u - pa.u)
  const du1 = Math.max(1e-4, nb.u - a.u)
  const outArr: number[] = []
  for (let c = 0; c < 3; c++) {
    // Catmull-Rom tangents (non-uniform aware); end points get one-sided slopes
    const m0 = i === 0 ? (bv[c] - av[c]) / h : (bv[c] - pv[c]) / du0
    const m1 = i + 1 === n - 1 ? (bv[c] - av[c]) / h : (nv[c] - av[c]) / du1
    outArr.push(h00 * av[c] + h10 * h * m0 + h01 * bv[c] + h11 * h * m1)
  }
  out.set(outArr[0], outArr[1], outArr[2])
}

export function sample(u: number, small: boolean, out: Sample) {
  const keys = small ? KEYS.filter((k) => !k.opt) : KEYS
  const uu = Math.min(keys[keys.length - 1].u, Math.max(0, u))
  let i = 0
  while (i < keys.length - 2 && uu >= keys[i + 1].u) i++
  const a = keys[i]
  const b = keys[i + 1]
  const t = (uu - a.u) / (b.u - a.u)
  hermite(tmpA, keys, i, t, 'p')
  hermite(tmpB, keys, i, t, 'l')
  out.p.copy(tmpA)
  out.l.copy(tmpB)
  out.fov = a.fov + (b.fov - a.fov) * t * t * (3 - 2 * t)
}
