import type { Kit } from './kit'

export const FL = 0.2 // interior floor level
export const CH = 4.2 // ground-floor ceiling height
export const ROOF = 12.8

const rand = (seed: number) => {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** Exterior of the main multi-storey block, entrance portico, roof and the left annex. */
export function buildShell(kit: Kit, lite: boolean) {
  const r = rand(42)

  // plinth / ground-floor slab + forecourt apron
  kit.slab('concrete', -24.8, 0, -8.6, 24.8, FL, 15.2)
  kit.slab('concrete', -5.5, 0, 15.2, 5.5, 0.12, 16.2) // steps
  kit.slab('concrete', -5, 0, 16.2, 5, 0.06, 16.9)

  // ---- ground floor exterior walls (real openings so the camera can fly in) ----
  const winY0 = 1.05
  const winY1 = 3.4
  const frontWin = [
    [-21.5, -18.5],
    [-16.5, -13.5],
    [-11.5, -8.5],
    [8.5, 11.5],
    [13.5, 16.5],
    [18.5, 21.5],
  ]
  kit.wall('paint', 'x', 7.85, -24, 24, 0.3, FL, CH, [
    { a: -3.6, b: 3.6, y0: FL, y1: 3.75 },
    ...frontWin.map(([a, b]) => ({ a, b, y0: winY0, y1: winY1 })),
  ])
  frontWin.forEach(([a, b]) => {
    kit.glaze('x', 7.95, a, b, winY0, winY1, { mullions: 2, depth: 0.2 })
    kit.box('concrete', (a + b) / 2, winY0 - 0.08, 8.05, b - a + 0.3, 0.08, 0.3) // sill
  })
  // entrance frame
  kit.box('frame', -3.65, FL, 7.95, 0.1, 3.55, 0.3)
  kit.box('frame', 3.65, FL, 7.95, 0.1, 3.55, 0.3)
  kit.box('frame', 0, 3.75, 7.95, 7.4, 0.1, 0.3)
  // back + side walls
  kit.wall('paint', 'x', -7.85, -24, 24, 0.3, FL, CH)
  for (const sx of [-23.85, 23.85]) {
    kit.wall('paint', 'z', sx, -8, 8, 0.3, FL, CH, [{ a: -0.3, b: 2.1, y0: 0.9, y1: 3.4 }])
    kit.glaze('z', sx, -0.3, 2.1, 0.9, 3.4, { mullions: 1, depth: 0.2 })
  }
  // back-wall decorative glass (non-opening) so the rear still reads as a school
  for (let i = 0; i < 8; i++) {
    const cx = -21 + i * 6
    kit.glaze('x', -8.02, cx - 1.4, cx + 1.4, winY0, winY1, { mullions: 1, depth: 0.14 })
  }

  // dark stone base, drain pipes, wall lamps, split ACs, shrubs: small details sell realism
  kit.slab('concreteDark', -24.2, FL, 8.0, -3.8, FL + 0.9, 8.14)
  kit.slab('concreteDark', 3.8, FL, 8.0, 24.2, FL + 0.9, 8.14)
  kit.slab('concreteDark', 23.9, FL, -8.2, 24.14, FL + 0.9, 8.2)
  kit.slab('concreteDark', -24.14, FL, -8.2, -23.9, FL + 0.9, 8.2)
  kit.slab('concreteDark', -24.2, FL, -8.14, 24.2, FL + 0.9, -8.0)
  for (const x of [-23.6, -7.6, 7.6, 23.6]) {
    kit.cyl('metal', x, FL, 8.18, 0.11, ROOF - FL)
    kit.cyl('metal', x, FL, -8.18, 0.11, ROOF - FL)
  }
  for (const x of [-4.4, 4.4]) {
    kit.box('frame', x, 3.0, 8.0, 0.22, 0.4, 0.16)
    kit.box('yellowGlow', x, 3.06, 8.09, 0.14, 0.14, 0.02)
  }
  for (const [cx, y] of [
    [-19.5, 4.95],
    [-13.5, 9.15],
    [13.5, 4.95],
    [19.5, 9.15],
    [-22.5, 9.15],
    [16.5, 4.95],
  ]) {
    kit.box('ac', cx, y, 8.2, 0.95, 0.3, 0.26)
    kit.box('metal', cx + 0.5, y - 0.9, 8.14, 0.04, 0.9, 0.04)
  }
  for (let i = 0; i < 6; i++) kit.box('ac', -21 + i * 8.4, 4.95 + (i % 2) * 4.2, -8.2, 0.95, 0.3, 0.26)
  for (let i = 0; i < 11; i++) {
    const x = i < 5 ? -22 + i * 3.6 : 8 + (i - 5) * 3.6
    kit.sph('hedge', x, FL + 0.45, 9.1, 1.5, { sy: 0.8 })
    kit.sph('hedge', x + 1.2, FL + 0.38, 9.3, 1.1, { sy: 0.8 })
    if (i % 2) kit.sph('red', x + 0.2, FL + 0.9, 9.0, 0.35)
  }

  // ---- upper storeys ----
  kit.slab('paint', -24, CH, -8, 24, ROOF, 8)
  // projecting slab bands
  kit.slab('indigo', -24.5, CH, -8.5, 24.5, CH + 0.4, 8.5)
  kit.slab('paintWhite', -24.4, 8.45, -8.4, 24.4, 8.7, 8.4)
  kit.slab('indigo', -24.5, ROOF - 0.1, -8.5, 24.5, ROOF + 0.3, 8.5)

  const floors = [
    { y0: 5.5, y1: 7.85 },
    { y0: 9.75, y1: 12.1 },
  ]
  const frontBays = [-22.5, -19.5, -16.5, -13.5, -10.5, 10.5, 13.5, 16.5, 19.5, 22.5]
  const allBays = Array.from({ length: 16 }, (_, i) => -22.5 + i * 3)
  for (const f of floors) {
    for (const cx of frontBays) {
      kit.glaze('x', 8.04, cx - 1.1, cx + 1.1, f.y0, f.y1, { mullions: 1, depth: 0.2 })
      kit.box('paintWhite', cx, f.y1 + 0.08, 8.3, 2.7, 0.08, 0.6)
    }
    for (const cx of allBays) {
      kit.glaze('x', -8.04, cx - 1.1, cx + 1.1, f.y0, f.y1, { mullions: 1, depth: 0.2 })
    }
    for (const cz of [-4.5, 0, 4.5]) {
      kit.glaze('z', 24.04, cz - 1.1, cz + 1.1, f.y0, f.y1, { mullions: 1, depth: 0.2 })
      kit.glaze('z', -24.04, cz - 1.1, cz + 1.1, f.y0, f.y1, { mullions: 1, depth: 0.2 })
    }
  }
  // vertical fins between bays (front)
  for (let i = -8; i <= 8; i++) {
    const x = i * 3 - 0
    if (Math.abs(x) < 8.7) continue
    kit.box('paintWhite', x, CH + 0.4, 8.12, 0.16, ROOF - CH - 0.5, 0.34)
  }

  // ---- entrance tower + canopy ----
  kit.slab('paintWhite', -8, CH + 0.4, 8, 8, 15.4, 9.9)
  kit.slab('indigo', -5.6, 9.1, 9.9, 5.6, 14.6, 10.05)
  kit.slab('yellow', -8.25, 15.4, 7.8, 8.25, 15.8, 10.2)
  kit.slab('paintWhite', -8.25, CH + 0.4, 7.9, -8, 15.4, 10.1)
  kit.slab('paintWhite', 8, CH + 0.4, 7.9, 8.25, 15.4, 10.1)
  // glass atrium band on tower
  kit.glaze('x', 9.95, -7.4, 7.4, 5.25, 8.3, { mullions: 7, depth: 0.2 })
  // canopy
  kit.slab('paintWhite', -9, CH, 8, 9, CH + 0.45, 14.6)
  kit.slab('indigo', -9, CH - 0.15, 14.4, 9, CH + 0.8, 14.65)
  for (const x of [-8.2, -4.4, 4.4, 8.2]) kit.cyl('paintWhite', x, FL, 14.0, 0.62, CH - FL)
  // soffit lights
  for (const x of [-6, -2, 2, 6]) kit.box('light', x, CH - 0.06, 11.5, 1.2, 0.05, 0.3)

  // ---- roof ----
  kit.slab('concrete', -24, ROOF, -8, 24, ROOF + 0.2, 8)
  const pw = 0.18
  const ph = 1.0
  kit.slab('paint', -24.2, ROOF + 0.3, -8.2, 24.2, ROOF + 0.3 + ph, -8.2 + pw)
  kit.slab('paint', -24.2, ROOF + 0.3, 8.2 - pw, 24.2, ROOF + 0.3 + ph, 8.2)
  kit.slab('paint', -24.2, ROOF + 0.3, -8.2, -24.2 + pw, ROOF + 0.3 + ph, 8.2)
  kit.slab('paint', 24.2 - pw, ROOF + 0.3, -8.2, 24.2, ROOF + 0.3 + ph, 8.2)
  const ry = ROOF + 0.2
  kit.slab('paint', -22, ry, -6.5, -17, ry + 3, -1.5) // stair headroom
  kit.slab('indigo', -22.1, ry + 3, -6.6, -16.9, ry + 3.2, -1.4)
  for (const [x, z] of [
    [-12, 5],
    [-8, 5],
    [8, 5.5],
    [12, 5.5],
  ])
    kit.box('ac', x, ry, z, 1.2, 0.9, 0.9)
  // black overhead water tanks (a familiar sight on Indian school roofs)
  for (const [x, z] of [
    [-13, -3],
    [-10.4, -3.2],
  ]) {
    kit.cyl('tank', x, ry, z, 2.0, 1.7)
    kit.sph('tank', x, ry + 1.7, z, 2.0, { sy: 0.35 })
  }
  // solar array
  const cols = lite ? 5 : 9
  for (let rr = 0; rr < 3; rr++)
    for (let c = 0; c < cols; c++) {
      const x = 2.5 + c * 2.35
      const z = -6.4 + rr * 1.9
      kit.box('solar', x, ry + 0.45, z, 2.1, 0.06, 1.35, { rx: -0.42 })
      kit.box('metal', x, ry, z - 0.5, 0.06, 0.45, 0.06)
      kit.box('metal', x, ry, z + 0.5, 0.06, 0.25, 0.06)
    }

  // ---- left annex (science / auditorium wing) ----
  const ax0 = -52
  const ax1 = -32
  const az0 = -6
  const az1 = 14
  kit.slab('paint', ax0, 0, az0, ax1, 8.6, az1)
  kit.slab('indigo', ax0 - 0.3, 4.0, az0 - 0.3, ax1 + 0.3, 4.3, az1 + 0.3)
  kit.slab('indigo', ax0 - 0.3, 8.6, az0 - 0.3, ax1 + 0.3, 8.9, az1 + 0.3)
  for (let i = 0; i < 6; i++) {
    const cx = ax0 + 3.5 + i * 3.1
    for (const [y0, y1] of [
      [1.2, 3.5],
      [5.2, 7.7],
    ]) {
      kit.glaze('x', az1 + 0.02, cx - 1.1, cx + 1.1, y0, y1, { mullions: 1, depth: 0.2 })
      kit.box('paintWhite', cx, y1 + 0.08, az1 + 0.2, 2.7, 0.07, 0.5)
    }
  }
  for (let i = 0; i < 5; i++) {
    const cz = az0 + 3 + i * 3.5
    for (const [y0, y1] of [
      [1.2, 3.5],
      [5.2, 7.7],
    ])
      kit.glaze('z', ax1 + 0.02, cz - 1.1, cz + 1.1, y0, y1, { mullions: 1, depth: 0.2 })
  }
  kit.slab('yellow', ax0 + 6, 0, az1 + 0.1, ax0 + 9, 8.9, az1 + 0.6) // feature fin
  kit.slab('concrete', ax0, 8.9, az0, ax1, 9.0, az1)

  // water-cooler / generator style details to break symmetry
  if (!lite) {
    for (let i = 0; i < 6; i++) kit.box('ac', ax0 + 2 + r() * 16, 8.9, az0 + 2 + r() * 16, 1.1, 0.8, 0.8)
  }
}
