import type { Kit } from './kit'
import { Local } from './local'
import { CH, FL } from './shell'
import { person } from './people'

const rand = (seed: number) => {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const BOOK_COLORS = ['#c0392b', '#2c5282', '#d69e2e', '#2f855a', '#6b46c1', '#dd6b20', '#2b6cb0', '#97266d', '#e2e8f0', '#25245B']

/** Positions of the door / window openings in the corridor partitions (shared with the scene for signage). */
export const DOORS = {
  class: -15,
  office: 15,
  library: -15,
  lab: 15,
}

const winsL: [number, number][] = [
  [-22.2, -19.2],
  [-11.6, -8.6],
]
const winsR: [number, number][] = [
  [8.6, 11.6],
  [19.6, 22.6],
]

function doorFrame(kit: Kit, z: number, cx: number, top: number) {
  kit.box('frame', cx - 1.25, FL, z, 0.1, top - FL, 0.26)
  kit.box('frame', cx + 1.25, FL, z, 0.1, top - FL, 0.26)
  kit.box('frame', cx, top, z, 2.6, 0.1, 0.26)
}

function chair(kit: Kit, cx: number, cz: number, a: number, mat: 'chairIndigo' | 'chairYellow' | 'chairOrange' | 'chairBlue' = 'chairIndigo') {
  const L = new Local(kit, cx, cz, a, FL)
  L.box(mat, 0, 0.44, 0, 0.44, 0.06, 0.44)
  L.box(mat, 0, 0.5, -0.21, 0.44, 0.42, 0.05)
  for (const sx of [-1, 1])
    for (const sz of [-1, 1]) L.cyl('metal', sx * 0.18, 0, sz * 0.18, 0.035, 0.44)
}

function bookshelf(kit: Kit, cx: number, cz: number, a: number, len: number, rows: number, h: number, rng: () => number, density = 1) {
  const L = new Local(kit, cx, cz, a, FL)
  const d = 0.34
  L.box('woodDark', 0, 0, -d / 2 + 0.01, len, h, 0.03) // back
  L.box('woodDark', -len / 2, 0, 0, 0.04, h, d)
  L.box('woodDark', len / 2, 0, 0, 0.04, h, d)
  L.box('woodDark', 0, 0, 0, len, 0.08, d)
  for (let i = 0; i <= rows; i++) L.box('woodDark', 0, 0.08 + (i * (h - 0.12)) / rows, 0, len, 0.035, d)
  const rh = (h - 0.12) / rows
  for (let rIdx = 0; rIdx < rows; rIdx++) {
    let x = -len / 2 + 0.07
    const y = 0.115 + rIdx * rh
    while (x < len / 2 - 0.1) {
      const w = 0.025 + rng() * 0.04
      const bh = rh * (0.6 + rng() * 0.32)
      if (rng() < 0.93 / density) {
        L.box('paper', x + w / 2, y, 0.02, w, bh, d * 0.75, BOOK_COLORS[Math.floor(rng() * BOOK_COLORS.length)])
      }
      x += w + 0.004
    }
  }
}

function plant(kit: Kit, x: number, z: number, s = 1) {
  kit.cyl('pot', x, FL, z, 0.5 * s, 0.5 * s)
  kit.sph('leaf', x, FL + 0.95 * s, z, 0.85 * s, { sy: 1.2 })
  kit.sph('leaf', x + 0.12 * s, FL + 1.35 * s, z - 0.05, 0.55 * s)
}

function monitor(L: Local, lx: number, y: number, lz: number, variantColor?: string) {
  L.box('black', lx, y, lz, 0.1, 0.05, 0.16) // stand foot
  L.box('black', lx, y + 0.05, lz, 0.04, 0.16, 0.04)
  L.box('black', lx, y + 0.2, lz, 0.6, 0.36, 0.03)
  L.box('screen', lx, y + 0.215, lz + 0.017, 0.56, 0.33, 0.006, variantColor)
  L.box('black', lx, y + 0.0, lz + 0.2, 0.42, 0.02, 0.14) // keyboard
}

export function buildInterior(kit: Kit, lite: boolean) {
  const r = rand(99)
  const density = lite ? 1.6 : 1

  // ceiling + floor edges
  kit.slab('ceiling', -23.7, CH - 0.1, -7.7, 23.7, CH, 7.7)

  // ---- partitions ----
  const T = 0.2
  const door = (c: number) => ({ a: c - 1.2, b: c + 1.2, y0: FL, y1: 3.1 })
  const wins = (list: [number, number][]) => list.map(([a, b]) => ({ a, b, y0: 1.0, y1: 3.0 }))
  // front rooms' corridor wall (z = 2.5)
  kit.wall('paint', 'x', 2.5, -24, -6, T, FL, CH, [door(DOORS.class), ...wins(winsL)])
  kit.wall('paint', 'x', 2.5, 6, 24, T, FL, CH, [door(DOORS.office), ...wins(winsR)])
  // back rooms' corridor wall (z = -1)
  kit.wall('paint', 'x', -1, -24, -6, T, FL, CH, [door(DOORS.library), ...wins(winsL)])
  kit.wall('paint', 'x', -1, 6, 24, T, FL, CH, [door(DOORS.lab), ...wins(winsR)])
  for (const z of [2.5, -1]) {
    for (const [a, b] of [...winsL, ...winsR]) kit.glaze('x', z, a, b, 1.0, 3.0, { mullions: 0, depth: 0.24 })
  }
  // lobby side walls
  for (const sx of [-6, 6]) {
    kit.wall('paint', 'z', sx, 2.5, 7.7, T, FL, CH)
    kit.wall('paint', 'z', sx, -7.7, -1, T, FL, CH)
  }
  doorFrame(kit, 2.5, DOORS.class, 3.1)
  doorFrame(kit, 2.5, DOORS.office, 3.1)
  doorFrame(kit, -1, DOORS.library, 3.1)
  doorFrame(kit, -1, DOORS.lab, 3.1)
  // skirting accent stripe along corridor walls
  for (const [a, b] of [
    [-24, -6],
    [6, 24],
  ]) {
    kit.box('indigo', (a + b) / 2, FL, 2.39, b - a, 0.12, 0.02)
    kit.box('indigo', (a + b) / 2, FL, -0.89, b - a, 0.12, 0.02)
  }

  // ---- ceiling lights ----
  const panel = (x: number, z: number, w = 1.3, d = 0.32) => kit.box('light', x, CH - 0.15, z, w, 0.05, d)
  for (let x = -21; x <= 21; x += 3) panel(x, 0.75)
  for (const x of [-3, 3]) for (const z of [-5, 5]) panel(x, z, 1.8, 0.5)
  for (const x of [-21, -17, -13, -9]) for (const z of [3.9, 6.4]) panel(x, z)
  for (const x of [9, 13, 17, 21]) for (const z of [3.9, 6.4]) panel(x, z)
  for (const x of [-21, -17, -13, -9]) for (const z of [-3, -5.6]) panel(x, z)
  for (const x of [9, 13, 17, 21]) for (const z of [-3, -5.6]) panel(x, z)

  // ---- LOBBY / RECEPTION ----
  kit.box('indigo', 0, FL, -5.3, 6, 1.1, 0.9)
  kit.box('woodLight', 0, FL + 1.1, -5.25, 6.3, 0.07, 1.15)
  kit.box('yellowGlow', 0, FL + 0.35, -4.83, 5.6, 0.05, 0.02)
  kit.box('white', -4.0, FL, -5.3, 0.9, 0.75, 0.9)
  chair(kit, -1.6, -6.4, 0, 'chairYellow')
  chair(kit, 1.6, -6.4, 0, 'chairYellow')
  person(kit, 1.6, -6.4, 0, { seated: true, y0: FL, bag: false, scale: 1.1 })
  person(kit, -1.4, 1.3, Math.PI / 2, { y0: FL, scale: 1.1, bag: false, shirt: '#e8e2d2', pants: '#2a2a2a', stride: 0.6 })
  {
    const L = new Local(kit, 1.2, -5.4, Math.PI, FL)
    monitor(L, 0, 1.17, 0)
  }
  // wood slat panels flanking the logo wall
  for (let i = 0; i < 12; i++) {
    kit.box('woodLight', -7.2 + i * 0.55 - 0, FL, -7.55, 0.3, 3.9, 0.06)
  }
  // lobby sofas + low tables
  for (const [x, a, m] of [
    [-3.9, Math.PI / 2, 'sofa'],
    [3.9, -Math.PI / 2, 'sofa'],
  ] as const) {
    const L = new Local(kit, x, 5.4, a, FL)
    L.box(m, 0, 0.1, 0, 2.2, 0.4, 0.9)
    L.box(m, 0, 0.45, -0.38, 2.2, 0.5, 0.16)
    L.box(m, -1.05, 0.1, 0, 0.16, 0.6, 0.9)
    L.box(m, 1.05, 0.1, 0, 0.16, 0.6, 0.9)
  }
  kit.box('woodLight', 0, FL + 0.38, 5.4, 1.2, 0.05, 0.8)
  kit.box('metal', 0, FL, 5.4, 0.08, 0.38, 0.08)
  plant(kit, -5.3, 7.0, 1.3)
  plant(kit, 5.3, 7.0, 1.3)
  plant(kit, -5.3, -7.0, 1.2)
  plant(kit, 5.3, -7.0, 1.2)
  plant(kit, 5.4, 3.3, 0.9)
  // display plinth w/ trophy
  kit.box('white', -5.2, FL, 0.2, 0.5, 0.9, 0.7)
  kit.cyl('yellowGlow', -5.2, FL + 0.9, 0.2, 0.12, 0.28)
  kit.sph('yellowGlow', -5.2, FL + 1.3, 0.2, 0.2)

  // ---- CORRIDOR dressing ----
  const poster = (x: number, z: number, i: number) => {
    const m = (['poster1', 'poster2', 'poster3'] as const)[i % 3]
    kit.box('cork', x, 1.0, z, 1.2, 1.1, 0.03)
    kit.box(m, x - 0.25, 1.35, z + (z > 1 ? -0.025 : 0.025), 0.5, 0.55, 0.01)
    kit.box('paper', x + 0.3, 1.2, z + (z > 1 ? -0.025 : 0.025), 0.4, 0.4, 0.01)
  }
  ;[-17.7, -12.6, -7.1, 7.1, 12.6, 17.8].forEach((x, i) => {
    poster(x, 2.38, i)
    poster(x + 0.2, -0.88, i + 1)
  })
  for (const x of [-9.9, 9.9]) {
    kit.box('woodLight', x, FL + 0.42, 2.0, 1.6, 0.06, 0.4)
    kit.box('metal', x - 0.65, FL, 2.0, 0.05, 0.42, 0.35)
    kit.box('metal', x + 0.65, FL, 2.0, 0.05, 0.42, 0.35)
  }
  for (const x of [-6.5, 6.5]) kit.cyl('red', x, FL + 0.9, 2.3, 0.14, 0.4)
  // lockers on corridor ends
  for (let i = 0; i < 6; i++) {
    kit.box(i % 2 ? 'locker' : 'chairYellow', -23.3 + i * 0.0, FL, -0.4 + i * 0.42, 0.45, 1.9, 0.38)
    kit.box(i % 2 ? 'locker' : 'chairYellow', 23.3, FL, -0.4 + i * 0.42, 0.45, 1.9, 0.38)
  }

  // ---- CLASSROOM x[-24,-6] z[2.6,7.7] ----
  {
    const cols = [-19.4, -16.6, -13.4, -10.6]
    const rows = [3.75, 5.2, 6.65]
    for (const x of cols)
      for (const z of rows) {
        const L = new Local(kit, x, z, -Math.PI / 2, FL)
        L.box('woodLight', 0, 0.72, 0, 1.15, 0.04, 0.55)
        L.box('metal', 0, 0.55, 0, 1.1, 0.025, 0.5)
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) L.cyl('metal', sx * 0.54, 0, sz * 0.22, 0.04, 0.72)
        chair(kit, x + 0.7, z, -Math.PI / 2, (['chairBlue', 'chairIndigo', 'chairOrange'] as const)[Math.floor(r() * 3)])
        if (r() < 0.7) person(kit, x + 0.7, z, -Math.PI / 2, { seated: true, y0: FL, skin: Math.floor(r() * 5), girl: r() < 0.4 })
      }
    // teacher desk
    const T = new Local(kit, -21.8, 5.2, Math.PI / 2, FL)
    T.box('woodDark', 0, 0.72, 0, 1.6, 0.05, 0.75)
    T.box('woodDark', -0.7, 0, 0, 0.06, 0.72, 0.7)
    T.box('woodDark', 0.7, 0, 0, 0.06, 0.72, 0.7)
    T.box('black', 0, 0.77, 0.05, 0.36, 0.02, 0.25)
    chair(kit, -21.0, 5.2, Math.PI / 2, 'chairYellow')
    person(kit, -22.6, 3.6, Math.PI / 2, { y0: FL, scale: 1.12, bag: false, shirt: '#2f8f66', pants: '#222222', arms: 'down' })
    // board frame
    kit.box('frame', -23.78, 1.35, 5.1, 0.06, 1.32, 4.8)
    kit.box('metal', -23.7, 1.33, 5.1, 0.08, 0.04, 4.6)
    // cupboard
    kit.box('woodLight', -23.4, FL, 7.0, 0.5, 2.0, 1.2)
    kit.box('woodLight', -9.0, FL, 2.9, 1.6, 1.0, 0.45)
    plant(kit, -6.6, 7.2, 0.9)
    // wall charts
    kit.box('poster2', -23.77, 2.4, 3.2, 0.03, 0.8, 0.6)
    kit.box('poster3', -23.77, 2.4, 7.0, 0.03, 0.8, 0.6)
  }

  // ---- ADMIN / PRINCIPAL'S OFFICE x[6,24] z[2.6,7.7] ----
  {
    const D = new Local(kit, 20.6, 5.85, -Math.PI / 2, FL)
    D.box('woodDark', 0, 0.72, 0, 2.7, 0.06, 1.15)
    D.box('woodDark', -1.2, 0, 0, 0.08, 0.72, 1.1)
    D.box('woodDark', 1.2, 0, 0, 0.08, 0.72, 1.1)
    D.box('woodDark', 0, 0.12, 0.5, 2.4, 0.6, 0.04)
    D.box('woodDark', 0.85, 0.1, -0.05, 0.55, 0.62, 0.9)
    D.box('yellow', -0.9, 0.78, 0.35, 0.3, 0.05, 0.08) // nameplate
    D.box('paper', -0.5, 0.78, -0.2, 0.3, 0.012, 0.4)
    // monitor faces the visitor side (local +z = world -x)
    monitor(D, 0.0, 0.78, 0.15)
    chair(kit, 22.0, 5.85, -Math.PI / 2, 'chairIndigo')
    person(kit, 22.0, 5.85, -Math.PI / 2, { seated: true, y0: FL, scale: 1.1, bag: false, shirt: '#e8e2d2', pants: '#1a1a1a' })
    chair(kit, 18.2, 4.7, Math.PI / 2, 'chairYellow')
    chair(kit, 18.2, 7.0, Math.PI / 2, 'chairYellow')
    // bookshelf along east wall
    bookshelf(kit, 23.45, 5.2, -Math.PI / 2, 4.4, 4, 2.4, r, density)
    // staff desks near windows
    for (const x of [9.0, 12.0]) {
      const S = new Local(kit, x, 6.7, Math.PI, FL)
      S.box('white', 0, 0.72, 0, 1.5, 0.04, 0.7)
      S.box('metal', -0.7, 0, 0, 0.04, 0.72, 0.65)
      S.box('metal', 0.7, 0, 0, 0.04, 0.72, 0.65)
      monitor(S, 0, 0.76, 0.1)
      chair(kit, x, 5.8, 0, 'chairOrange')
    }
    // filing cabinets, sofa lounge
    for (let i = 0; i < 3; i++) kit.box('metal', 6.5, FL, 3.2 + i * 0.6, 0.5, 1.3, 0.55)
    const so = new Local(kit, 12.5, 3.6, Math.PI, FL)
    so.box('sofaYellow', 0, 0.1, 0, 2.0, 0.4, 0.85)
    so.box('sofaYellow', 0, 0.45, 0.36, 2.0, 0.5, 0.15)
    kit.box('woodLight', 12.5, FL + 0.38, 4.7, 0.9, 0.04, 0.6)
    plant(kit, 23.0, 7.3, 1.1)
    plant(kit, 6.8, 7.3, 1.0)
  }

  // ---- LIBRARY x[-24,-6] z[-7.7,-1] ----
  {
    person(kit, -20.3, -1.95, Math.PI, { seated: true, y0: FL, skin: 2 })
    person(kit, -9.2, -3.45, 0, { seated: true, y0: FL, skin: 4, girl: true })
    person(kit, -17.2, -3.2, Math.PI / 2, { y0: FL, scale: 0.98, stride: 0.5 })
    bookshelf(kit, -15, -7.45, 0, 17, 5, 2.6, r, density)
    for (const cx of [-20, -10]) {
      bookshelf(kit, cx, -5.2, 0, 5.0, 4, 2.1, r, density)
      bookshelf(kit, cx, -4.85, Math.PI, 5.0, 4, 2.1, r, density)
    }
    for (const x of [-20.5, -9.5]) {
      kit.box('woodLight', x, FL + 0.74, -2.7, 2.6, 0.05, 1.1)
      kit.box('metal', x - 1.1, FL, -2.7, 0.05, 0.74, 0.9)
      kit.box('metal', x + 1.1, FL, -2.7, 0.05, 0.74, 0.9)
      for (const dx of [-0.8, 0, 0.8]) {
        chair(kit, x + dx, -1.95, Math.PI, 'chairOrange')
        chair(kit, x + dx, -3.45, 0, 'chairOrange')
      }
      kit.box('yellowGlow', x, FL + 0.8, -2.7, 0.25, 0.03, 0.18) // reading lamp glow
    }
    plant(kit, -23.2, -1.8, 1.0)
    plant(kit, -6.9, -1.8, 1.0)
  }

  // ---- COMPUTER LAB x[6,24] z[-7.7,-1] ----
  {
    const rowsZ = [-2.9, -4.8, -6.7]
    rowsZ.forEach((z, ri) => {
      for (let i = 0; i < 6; i++) {
        const x = 8.5 + i * 2.5
        const L = new Local(kit, x, z, 0, FL)
        L.box('white', 0, 0.72, 0, 2.3, 0.04, 0.7)
        L.box('metal', -1.1, 0, 0, 0.04, 0.72, 0.65)
        L.box('metal', 1.1, 0, 0, 0.04, 0.72, 0.65)
        const shade = ['#7fd0ff', '#9be3a8', '#ffe39a', '#a9a8f5', '#7fd0ff'][(i + ri) % 5]
        monitor(L, -0.4, 0.76, -0.05, shade)
        monitor(L, 0.55, 0.76, -0.05, shade)
        L.box('black', 0.1, 0.0, 0.0, 0.0001, 0.0001, 0.0001)
        chair(kit, x - 0.4, z + 0.85, Math.PI, 'chairBlue')
        if ((i + ri) % 3 !== 1) person(kit, x - 0.4, z + 0.85, Math.PI, { seated: true, y0: FL, skin: (i + ri) % 5, girl: (i + ri) % 2 === 0 })
        chair(kit, x + 0.55, z + 0.85, Math.PI, 'chairBlue')
      }
    })
    kit.box('black', 23.6, 1.4, -4.8, 0.08, 1.7, 3.2)
    kit.box('screen', 23.54, 1.5, -4.8, 0.02, 1.5, 3.0, { c: '#a9d8ff' })
    plant(kit, 23.0, -1.8, 1.0)
  }

  void lite
}
