import { useEffect, useRef } from 'react'
import { cam, device } from '../lib/camState'

const FRAMES = 13 // pre-rendered stills of the camera path, one every 0.5 section units

/**
 * Used only when WebGL is unavailable: crossfades stills rendered from the real 3D camera
 * path, driven by the same scroll coordinate (cam.u), with a gentle zoom + pointer parallax.
 */
export default function FallbackBackground() {
  const refs = useRef<(HTMLImageElement | null)[]>([])
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    let u = cam.u
    let t0 = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - t0) / 1000)
      t0 = now
      u += (cam.u - u) * Math.min(1, dt * 6)
      const f = Math.min(FRAMES - 1, Math.max(0, u * 2))
      refs.current.forEach((img, i) => {
        if (!img) return
        const w = Math.max(0, 1 - Math.abs(f - i))
        img.style.opacity = String(w)
        img.style.visibility = w > 0.001 ? 'visible' : 'hidden'
      })
      if (box.current && !device.reduced) {
        const frac = f - Math.floor(f)
        const zoom = 1.03 + Math.sin(frac * Math.PI) * 0.05
        box.current.style.transform = `translate(${cam.px * -14}px, ${cam.py * -8}px) scale(${zoom})`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0b5d68]">
      <div ref={box} className="absolute inset-[-3%] will-change-transform">
        {Array.from({ length: FRAMES }, (_, i) => (
          <img
            key={i}
            ref={(el) => {
              refs.current[i] = el
            }}
            src={`/fallback/f${i}.jpg`}
            alt=""
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: i === 0 ? 1 : 0 }}
          />
        ))}
      </div>
    </div>
  )
}
