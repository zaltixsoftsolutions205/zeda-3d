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

function make(key: string, w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number, r: () => number) => void, seed = 7) {
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

/** Transparent weathering layer: panel joints, rain streaks under ledges, base splash. Laid over flat walls. */
export function texFacade(wM: number, hM: number, seed: number, jointEvery = 3) {
  const w = Math.min(2048, Math.round(wM * 42))
  const h = Math.max(64, Math.round(w * (hM / wM)))
  return make(`facade:${wM}:${hM}:${seed}`, w, h, (g, w, h, r) => {
    const px = w / wM
    g.clearRect(0, 0, w, h)
    for (let i = 0; i < w / 6; i++) {
      const x = r() * w
      const len = h * (0.1 + r() * 0.55)
      const gr = g.createLinearGradient(0, 0, 0, len)
      gr.addColorStop(0, `rgba(70,62,50,${0.05 + r() * 0.09})`)
      gr.addColorStop(1, 'rgba(70,62,50,0)')
      g.fillStyle = gr
      g.fillRect(x, 0, 1.2 + r() * 3, len)
    }
    for (let i = 0; i < 60; i++) {
      const x = r() * w
      const y = r() * h
      const rad = 20 + r() * 90
      const gr = g.createRadialGradient(x, y, 0, x, y, rad)
      gr.addColorStop(0, `rgba(90,80,60,${0.03 + r() * 0.05})`)
      gr.addColorStop(1, 'rgba(90,80,60,0)')
      g.fillStyle = gr
      g.fillRect(x - rad, y - rad, rad * 2, rad * 2)
    }
    const gb = g.createLinearGradient(0, h, 0, h * 0.8)
    gb.addColorStop(0, 'rgba(60,52,40,0.35)')
    gb.addColorStop(1, 'rgba(60,52,40,0)')
    g.fillStyle = gb
    g.fillRect(0, h * 0.8, w, h * 0.2)
    g.fillStyle = 'rgba(40,35,28,0.16)'
    for (let m = 0; m <= wM; m += jointEvery) g.fillRect(m * px - 0.8, 0, 1.6, h)
    g.fillStyle = 'rgba(40,35,28,0.12)'
    g.fillRect(0, h * 0.5, w, 1.4)
  }, seed)
}

/** Soft dark blob used as fake ambient occlusion around building bases. */
export const texBlob = () =>
  make('blob', 256, 256, (g, w, h) => {
    const gr = g.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w / 2)
    gr.addColorStop(0, 'rgba(20,25,15,0.55)')
    gr.addColorStop(1, 'rgba(20,25,15,0)')
    g.fillStyle = gr
    g.fillRect(0, 0, w, h)
  })
