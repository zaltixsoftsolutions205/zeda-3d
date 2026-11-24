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

const cache = new Map<string, THREE.CanvasTexture>()

function make(
  key: string,
  w: number,
  h: number,
  draw: (g: CanvasRenderingContext2D, w: number, h: number, r: () => number) => void,
  seed = 7,
) {
  let t = cache.get(key)
  if (t) return t
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d')!, w, h, rng(seed))
  t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  cache.set(key, t)
  return t
}

/** Wall-mounted smart display showing the analytics lesson. */
export const texSmartBoard = () =>
  make('smartboard', 1024, 576, (g, w, h, r) => {
    g.fillStyle = '#04323a'
    g.fillRect(0, 0, w, h)
    const gr = g.createLinearGradient(0, 0, w, h)
    gr.addColorStop(0, 'rgba(47,143,102,0.35)')
    gr.addColorStop(1, 'rgba(7,31,23,0)')
    g.fillStyle = gr
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#0b5d68'
    g.fillRect(0, 0, w, 64)
    g.fillStyle = '#ffd36e'
    g.font = '700 30px "Playfair Display", Georgia, serif'
    g.fillText('Class 8-A  ·  Performance Analytics', 28, 42)
    g.fillStyle = '#fbaf22'
    g.fillRect(0, 62, w, 4)
    const cards = [['Average', '84%'], ['Attendance', '96%'], ['Top subject', 'Maths'], ['At risk', '14']]
    cards.forEach(([l, v], i) => {
      const x = 28 + i * 242
      g.fillStyle = 'rgba(255,255,255,0.08)'
      g.fillRect(x, 92, 222, 92)
      g.fillStyle = '#9ee3d4'
      g.font = '600 18px Manrope, Arial'
      g.fillText(l.toUpperCase(), x + 16, 122)
      g.fillStyle = '#ffffff'
      g.font = '800 40px "Playfair Display", Georgia, serif'
      g.fillText(v, x + 16, 166)
    })
    g.fillStyle = 'rgba(255,255,255,0.06)'
    g.fillRect(28, 210, 600, 318)
    g.strokeStyle = 'rgba(255,255,255,0.12)'
    g.lineWidth = 1
    for (let i = 0; i < 5; i++) {
      g.beginPath()
      g.moveTo(48, 240 + i * 62)
      g.lineTo(608, 240 + i * 62)
      g.stroke()
    }
    g.strokeStyle = '#fbaf22'
    g.lineWidth = 5
    g.beginPath()
    for (let i = 0; i < 9; i++) {
      const x = 60 + i * 66
      const y = 470 - i * 26 - Math.sin(i * 1.3) * 18
      if (i) g.lineTo(x, y)
      else g.moveTo(x, y)
    }
    g.stroke()
    for (let i = 0; i < 9; i++) {
      g.fillStyle = '#0b5d68'
      g.strokeStyle = '#fbaf22'
      g.lineWidth = 3
      const x = 60 + i * 66
      const y = 470 - i * 26 - Math.sin(i * 1.3) * 18
      g.beginPath()
      g.arc(x, y, 7, 0, Math.PI * 2)
      g.fill()
      g.stroke()
    }
    g.fillStyle = 'rgba(255,255,255,0.06)'
    g.fillRect(652, 210, 344, 318)
    const cols = ['#fbaf22', '#35bfa6', '#9ee3d4', '#fdba3b', '#35bfa6']
    for (let i = 0; i < 5; i++) {
      const bh = 60 + r() * 170
      g.fillStyle = cols[i]
      g.fillRect(684 + i * 62, 500 - bh, 40, bh)
    }
    g.fillStyle = '#ffd36e'
    g.font = '600 20px Manrope, Arial'
    g.fillText('Subject-wise scores', 676, 242)
  })

export const texHolo = (variant = 0) =>
  make('holo' + variant, 512, 320, (g, w, h, r) => {
    g.fillStyle = 'rgba(8,42,31,0.55)'
    g.fillRect(0, 0, w, h)
    g.strokeStyle = 'rgba(159,220,188,0.9)'
    g.lineWidth = 3
    g.strokeRect(6, 6, w - 12, h - 12)
    g.fillStyle = '#ffd36e'
    g.font = '700 26px "Playfair Display", Georgia, serif'
    g.fillText(['Attendance trend', 'Fee collection', 'Academic growth'][variant % 3], 24, 44)
    if (variant === 1) {
      g.strokeStyle = '#fbaf22'
      g.lineWidth = 16
      g.beginPath()
      g.arc(150, 190, 70, -Math.PI / 2, Math.PI * 1.1)
      g.stroke()
      g.fillStyle = '#fff'
      g.font = '800 38px Manrope, Arial'
      g.fillText('89%', 112, 204)
    } else {
      for (let i = 0; i < 12; i++) {
        const bh = 30 + r() * 150
        g.fillStyle = i % 3 === 0 ? '#fbaf22' : '#35bfa6'
        g.fillRect(28 + i * 40, h - 24 - bh, 26, bh)
      }
    }
  })
