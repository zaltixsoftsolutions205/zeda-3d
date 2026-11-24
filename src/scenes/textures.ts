import * as THREE from 'three'

function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Draw = (g: CanvasRenderingContext2D, w: number, h: number, r: () => number) => void

interface Opts {
  seed?: number
  repeating?: boolean
}

function make(w: number, h: number, draw: Draw, o: Opts = {}) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')!
  draw(g, w, h, rng(o.seed ?? 7))
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  if (o.repeating !== false) t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.anisotropy = 8
  return t
}

const cache = new Map<string, THREE.CanvasTexture>()
const memo = (k: string, f: () => THREE.CanvasTexture) => {
  let t = cache.get(k)
  if (!t) cache.set(k, (t = f()))
  return t
}

/** Returns a texture clone with its own repeat so one canvas can tile at several scales. */
export const tiled = (t: THREE.Texture, rx: number, ry: number) => {
  const c = t.clone()
  c.needsUpdate = true
  c.repeat.set(rx, ry)
  return c
}

export const texGrass = () =>
  memo('grass', () =>
    make(
      512,
      512,
      (g, w, h, r) => {
        g.fillStyle = '#5dbb9c'
        g.fillRect(0, 0, w, h)
        for (let i = 0; i < 40; i++) {
          const x = r() * w
          const y = r() * h
          const rad = 40 + r() * 90
          const gr = g.createRadialGradient(x, y, 0, x, y, rad)
          const c = r() > 0.5 ? '70,170,140' : '90,190,160'
          gr.addColorStop(0, `rgba(${c},0.35)`)
          gr.addColorStop(1, `rgba(${c},0)`)
          g.fillStyle = gr
          g.fillRect(x - rad, y - rad, rad * 2, rad * 2)
        }
        for (let i = 0; i < 14000; i++) {
          const l = 28 + r() * 26
          g.fillStyle = `hsla(${150 + r() * 20},${40 + r() * 25}%,${l}%,${0.25 + r() * 0.35})`
          g.fillRect(r() * w, r() * h, 1 + r() * 2, 2 + r() * 4)
        }
      },
      { seed: 3 },
    ),
  )

export const texPaver = () =>
  memo('paver', () =>
    make(
      512,
      512,
      (g, w, h, r) => {
        g.fillStyle = '#b9ab95'
        g.fillRect(0, 0, w, h)
        const bw = 64
        const bh = 32
        for (let y = 0; y < h / bh; y++) {
          for (let x = -1; x < w / bw; x++) {
            const off = y % 2 ? bw / 2 : 0
            const l = 62 + r() * 12
            g.fillStyle = `hsl(${28 + r() * 8},${14 + r() * 8}%,${l}%)`
            g.fillRect(x * bw + off + 1.5, y * bh + 1.5, bw - 3, bh - 3)
          }
        }
        for (let i = 0; i < 3000; i++) {
          g.fillStyle = `rgba(0,0,0,${r() * 0.08})`
          g.fillRect(r() * w, r() * h, 2, 2)
        }
      },
      { seed: 11 },
    ),
  )

export const texAsphalt = () =>
  memo('asphalt', () =>
    make(
      512,
      512,
      (g, w, h, r) => {
        g.fillStyle = '#3b3d42'
        g.fillRect(0, 0, w, h)
        for (let i = 0; i < 16000; i++) {
          const l = 20 + r() * 38
          g.fillStyle = `rgba(${l * 4},${l * 4},${l * 4},${0.12 + r() * 0.2})`
          g.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2)
        }
      },
      { seed: 5 },
    ),
  )

export const texTile = () =>
  memo('tile', () =>
    make(
      512,
      512,
      (g, w, h, r) => {
        g.fillStyle = '#c9c5bd'
        g.fillRect(0, 0, w, h)
        const n = 2
        const s = w / n
        for (let y = 0; y < n; y++)
          for (let x = 0; x < n; x++) {
            const l = 86 + r() * 6
            g.fillStyle = `hsl(40,8%,${l}%)`
            g.fillRect(x * s + 2, y * s + 2, s - 4, s - 4)
            const gr = g.createLinearGradient(x * s, y * s, x * s + s, y * s + s)
            gr.addColorStop(0, 'rgba(255,255,255,0.35)')
            gr.addColorStop(1, 'rgba(255,255,255,0)')
            g.fillStyle = gr
            g.fillRect(x * s + 2, y * s + 2, s - 4, s - 4)
          }
      },
      { seed: 13 },
    ),
  )

export const texWood = (base = '#a67c52') =>
  memo('wood' + base, () =>
    make(
      512,
      512,
      (g, w, h, r) => {
        g.fillStyle = base
        g.fillRect(0, 0, w, h)
        const planks = 8
        const ph = h / planks
        for (let p = 0; p < planks; p++) {
          g.fillStyle = `rgba(${r() > 0.5 ? '255,235,200' : '40,20,5'},${0.05 + r() * 0.1})`
          g.fillRect(0, p * ph, w, ph)
          for (let i = 0; i < 40; i++) {
            g.strokeStyle = `rgba(60,35,15,${0.05 + r() * 0.12})`
            g.lineWidth = 1
            g.beginPath()
            const y = p * ph + r() * ph
            g.moveTo(0, y)
            g.bezierCurveTo(w * 0.3, y + r() * 4 - 2, w * 0.6, y + r() * 4 - 2, w, y + r() * 3 - 1.5)
            g.stroke()
          }
          g.fillStyle = 'rgba(30,15,5,0.5)'
          g.fillRect(0, p * ph, w, 1.5)
        }
      },
      { seed: 21 },
    ),
  )

export const texCarpet = () =>
  memo('carpet', () =>
    make(
      256,
      256,
      (g, w, h, r) => {
        g.fillStyle = '#4a5160'
        g.fillRect(0, 0, w, h)
        for (let i = 0; i < 9000; i++) {
          const l = 30 + r() * 25
          g.fillStyle = `hsla(220,10%,${l}%,0.5)`
          g.fillRect(r() * w, r() * h, 2, 2)
        }
      },
      { seed: 17 },
    ),
  )

export const texTrack = () =>
  memo('track', () =>
    make(
      256,
      256,
      (g, w, h, r) => {
        g.fillStyle = '#e8604f'
        g.fillRect(0, 0, w, h)
        for (let i = 0; i < 8000; i++) {
          g.fillStyle = `hsla(${8 + r() * 10},${45 + r() * 20}%,${35 + r() * 20}%,0.4)`
          g.fillRect(r() * w, r() * h, 2, 2)
        }
      },
      { seed: 9 },
    ),
  )

export const texField = () =>
  memo('field', () =>
    make(
      640,
      1024,
      (g, w, h) => {
        const bands = 12
        for (let i = 0; i < bands; i++) {
          g.fillStyle = i % 2 ? '#3fae92' : '#46b79a'
          g.fillRect(0, (i * h) / bands, w, h / bands + 1)
        }
        g.strokeStyle = 'rgba(255,255,255,0.9)'
        g.lineWidth = 6
        g.strokeRect(24, 24, w - 48, h - 48)
        g.beginPath()
        g.moveTo(24, h / 2)
        g.lineTo(w - 24, h / 2)
        g.stroke()
        g.beginPath()
        g.arc(w / 2, h / 2, 86, 0, Math.PI * 2)
        g.stroke()
        g.strokeRect(w / 2 - 150, 24, 300, 130)
        g.strokeRect(w / 2 - 150, h - 154, 300, 130)
        g.strokeRect(w / 2 - 70, 24, 140, 50)
        g.strokeRect(w / 2 - 70, h - 74, 140, 50)
      },
      { repeating: false },
    ),
  )

export const texCourt = () =>
  memo('court', () =>
    make(
      1024,
      540,
      (g, w, h) => {
        g.fillStyle = '#ee5a48'
        g.fillRect(0, 0, w, h)
        g.fillStyle = '#12909a'
        g.fillRect(60, 40, w - 120, h - 80)
        g.fillStyle = '#ff7a6b'
        g.fillRect(60, h / 2 - 120, 230, 240)
        g.fillRect(w - 290, h / 2 - 120, 230, 240)
        g.strokeStyle = '#fff'
        g.lineWidth = 6
        g.strokeRect(60, 40, w - 120, h - 80)
        g.beginPath()
        g.moveTo(w / 2, 40)
        g.lineTo(w / 2, h - 40)
        g.stroke()
        g.beginPath()
        g.arc(w / 2, h / 2, 70, 0, Math.PI * 2)
        g.stroke()
        g.strokeRect(60, h / 2 - 120, 230, 240)
        g.strokeRect(w - 290, h / 2 - 120, 230, 240)
        g.beginPath()
        g.arc(290, h / 2, 90, -Math.PI / 2, Math.PI / 2)
        g.stroke()
        g.beginPath()
        g.arc(w - 290, h / 2, 90, Math.PI / 2, (Math.PI * 3) / 2)
        g.stroke()
      },
      { repeating: false },
    ),
  )

export const texCloud = () =>
  memo('cloud', () =>
    make(
      256,
      128,
      (g, w, h, r) => {
        for (let i = 0; i < 26; i++) {
          const x = w * (0.2 + r() * 0.6)
          const y = h * (0.45 + r() * 0.25)
          const rad = 14 + r() * 30
          const gr = g.createRadialGradient(x, y, 0, x, y, rad)
          gr.addColorStop(0, 'rgba(255,255,255,0.55)')
          gr.addColorStop(1, 'rgba(255,255,255,0)')
          g.fillStyle = gr
          g.fillRect(x - rad, y - rad, rad * 2, rad * 2)
        }
      },
      { repeating: false },
    ),
  )

export function texSign(
  text: string,
  opts: { sub?: string; bg?: string; fg?: string; w?: number; h?: number; accent?: string } = {},
) {
  const { sub, bg = '#0b5d68', fg = '#ffd36e', w = 1024, h = 256, accent = '#fbaf22' } = opts
  return memo(`sign:${text}:${sub}:${bg}:${fg}`, () =>
    make(
      w,
      h,
      (g) => {
        g.fillStyle = bg
        g.fillRect(0, 0, w, h)
        g.fillStyle = accent
        g.fillRect(0, h - 10, w, 10)
        g.fillStyle = fg
        g.textAlign = 'center'
        g.textBaseline = 'middle'
        const big = sub ? h * 0.4 : h * 0.46
        g.font = `800 ${big}px "Playfair Display", Georgia, serif`
        g.fillText(text, w / 2, sub ? h * 0.4 : h * 0.5, w - 40)
        if (sub) {
          g.font = `600 ${h * 0.17}px Manrope, Arial, sans-serif`
          g.globalAlpha = 0.85
          g.fillText(sub, w / 2, h * 0.74, w - 40)
        }
      },
      { repeating: false },
    ),
  )
}

export const texWhiteboard = () =>
  memo('wb', () =>
    make(
      1024,
      256,
      (g, w, h, r) => {
        g.fillStyle = '#f7f8fa'
        g.fillRect(0, 0, w, h)
        const gr = g.createLinearGradient(0, 0, w, h)
        gr.addColorStop(0, 'rgba(180,200,230,0.25)')
        gr.addColorStop(1, 'rgba(255,255,255,0)')
        g.fillStyle = gr
        g.fillRect(0, 0, w, h)
        g.fillStyle = '#0b5d68'
        g.font = '700 54px "Playfair Display", Georgia'
        g.fillText('Class 8-A · Mathematics', 40, 78)
        g.strokeStyle = '#ee5a48'
        g.lineWidth = 4
        g.beginPath()
        g.moveTo(40, 96)
        g.lineTo(560, 96)
        g.stroke()
        g.fillStyle = '#0e7c86'
        g.font = '500 40px Manrope, Arial'
        g.fillText('x² + 5x + 6 = (x + 2)(x + 3)', 40, 160)
        g.fillStyle = '#12909a'
        g.fillText('Homework → Exercise 4.2', 40, 218)
        g.strokeStyle = 'rgba(37,36,91,0.25)'
        g.lineWidth = 2
        for (let i = 0; i < 6; i++) {
          g.beginPath()
          g.arc(780 + r() * 160, 90 + r() * 100, 30 + r() * 30, 0, Math.PI * 2)
          g.stroke()
        }
      },
      { repeating: false },
    ),
  )

export const texScreen = (variant = 0) =>
  memo('screen' + variant, () =>
    make(
      512,
      320,
      (g, w, h, r) => {
        const dark = variant === 0
        g.fillStyle = dark ? '#16153f' : '#eaf8f6'
        g.fillRect(0, 0, w, h)
        g.fillStyle = '#0b5d68'
        g.fillRect(0, 0, w, 34)
        g.fillStyle = '#ffd36e'
        g.font = '700 20px Arial'
        g.fillText('Medav.ai · School Dashboard', 14, 23)
        const cols = ['#ffd36e', '#cdefe8', '#6fdcc4', '#fdba3b']
        for (let i = 0; i < 4; i++) {
          g.fillStyle = dark ? 'rgba(255,255,255,0.1)' : '#fff'
          g.fillRect(14 + i * 122, 48, 112, 58)
          g.fillStyle = cols[i]
          g.fillRect(24 + i * 122, 60, 52, 8)
          g.fillStyle = dark ? '#fff' : '#0b5d68'
          g.font = '700 26px Arial'
          g.fillText(String(Math.round(60 + r() * 900)), 24 + i * 122, 95)
        }
        for (let i = 0; i < 14; i++) {
          const bh = 20 + r() * 100
          g.fillStyle = cols[i % 4]
          g.fillRect(24 + i * 22, h - 14 - bh, 14, bh)
        }
        g.strokeStyle = '#ffd36e'
        g.lineWidth = 3
        g.beginPath()
        for (let i = 0; i < 12; i++) {
          const x = 330 + i * 14
          const y = 180 + Math.sin(i * 0.8) * 30 - i * 3
          if (i) g.lineTo(x, y)
          else g.moveTo(x, y)
        }
        g.stroke()
      },
      { repeating: false },
    ),
  )

export const texLogoWall = () =>
  memo('logowall', () =>
    make(
      1024,
      512,
      (g, w, h) => {
        g.fillStyle = '#0b5d68'
        g.fillRect(0, 0, w, h)
        const gr = g.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * 0.6)
        gr.addColorStop(0, 'rgba(60,150,110,0.4)')
        gr.addColorStop(1, 'rgba(15,61,46,0)')
        g.fillStyle = gr
        g.fillRect(0, 0, w, h)
        g.fillStyle = '#ffd36e'
        g.font = '800 200px "Playfair Display", Georgia'
        g.textAlign = 'center'
        g.textBaseline = 'middle'
        g.fillText('MEDAV.AI', w / 2, h * 0.46)
        g.font = '600 34px Manrope, Arial'
        g.fillStyle = '#cdefe8'
        g.fillText('SCHOOL MANAGEMENT SYSTEM', w / 2, h * 0.78)
      },
      { repeating: false },
    ),
  )
