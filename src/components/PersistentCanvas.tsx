import { Component, lazy, ReactNode, Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { useDevice } from '../hooks/useDevice'
import FallbackBackground from './FallbackBackground'

// Heavy 3D code is code-split and only fetched after first paint.
const SchoolWorld = lazy(() => import('../scenes/SchoolWorld'))

class Boundary extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(e: unknown) {
    console.error('3D scene unavailable: ' + String((e as Error)?.message ?? e))
    this.props.onFail()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

/** Small on-screen status so a blank background can be diagnosed without opening DevTools. */
function Diagnostics() {
  const [msgs, setMsgs] = useState<string[]>([])
  useEffect(() => {
    const add = (m: string) => setMsgs((a) => (a.includes(m) ? a : [...a, m].slice(-4)))
    try {
      const c = document.createElement('canvas')
      const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null
      if (!gl) add('WebGL is OFF in this browser – showing a static school image. Enable it at chrome://settings/system (graphics acceleration), then restart Chrome.')
      else {
        const ext = gl.getExtension('WEBGL_debug_renderer_info')
        console.info('[zeda] GPU:', ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'unknown')
      }
    } catch (e) {
      add('WebGL check failed: ' + String(e))
    }
    const onErr = (e: ErrorEvent) => add('Error: ' + e.message)
    const onRej = (e: PromiseRejectionEvent) => add('Error: ' + String(e.reason?.message ?? e.reason))
    const onLost = () => add('WebGL context lost')
    window.addEventListener('error', onErr)
    window.addEventListener('unhandledrejection', onRej)
    window.addEventListener('webglcontextlost', onLost, true)
    window.addEventListener('webglcontextcreationerror', onLost as never, true)
    const origErr = console.error
    console.error = (...a: unknown[]) => {
      const t = a.map((x) => (typeof x === 'string' ? x : (x as Error)?.message ?? '')).join(' ')
      if (/shader|program|WebGL|THREE/i.test(t)) add(t.slice(0, 220))
      origErr(...a)
    }
    return () => {
      window.removeEventListener('error', onErr)
      window.removeEventListener('unhandledrejection', onRej)
      console.error = origErr
    }
  }, [])
  if (!msgs.length) return null
  return (
    <div className="pointer-events-auto fixed bottom-3 left-3 z-[200] max-w-sm rounded-xl bg-black/80 p-3 font-mono text-[11px] leading-snug text-yellow-200">
      <b>3D diagnostics</b>
      {msgs.map((m) => (
        <div key={m} className="mt-1">{m}</div>
      ))}
    </div>
  )
}

/** ONE fixed WebGL canvas behind the whole page. It never captures pointer events. */
export default function PersistentCanvas({ onReady }: { onReady: () => void }) {
  const { tier } = useDevice()
  const [failed, setFailed] = useState(false)
  const [dprMax, setDprMax] = useState(tier === 0 ? 1.5 : tier === 1 ? 1.35 : 1.25)

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0"
      style={{ pointerEvents: 'none', background: 'linear-gradient(#5fa6e6,#eaf5fd)' }}
    >
      {failed && <FallbackBackground />}
      <Diagnostics />
      <Boundary
        onFail={() => {
          setFailed(true)
          onReady()
        }}
      >
        <Canvas
          shadows={tier < 2 ? { type: THREE.PCFSoftShadowMap } : false}
          dpr={[1, dprMax]}
          camera={{ fov: 40, near: 0.1, far: 1800, position: [78, 64, 98] }}
          gl={{
            antialias: tier === 0,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.0,
          }}
          style={{ pointerEvents: 'none' }}
          eventSource={undefined}
          onCreated={() => requestAnimationFrame(() => setTimeout(onReady, 400))}
        >
          <PerformanceMonitor
            onDecline={() => setDprMax((d) => Math.max(1, d - 0.5))}
            flipflops={3}
            onFallback={() => setDprMax(1)}
          />
          <Suspense fallback={null}>
            <SchoolWorld tier={tier} />
          </Suspense>
        </Canvas>
      </Boundary>
    </div>
  )
}
