import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { DIGITAL_Y } from './cameraPath'
import { digitalLights } from './sceneState'
import { device } from '../lib/camState'

const SKY = '#BFEBD3'
const YEL = '#FFA24A'

function GridFloor() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        fog: false,
        uniforms: { c: { value: new THREE.Color(SKY) } },
        vertexShader: `varying vec3 vW; void main(){ vec4 w = modelMatrix*vec4(position,1.); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,
        fragmentShader: `
          varying vec3 vW; uniform vec3 c;
          float grid(vec2 p, float s){ vec2 g = abs(fract(p/s-0.5)-0.5)/fwidth(p/s); return 1.0-min(min(g.x,g.y),1.0); }
          void main(){
            float d = length(vW.xz);
            float a = grid(vW.xz,4.)*0.55 + grid(vW.xz,20.)*0.9;
            a *= smoothstep(260.,20.,d);
            gl_FragColor = vec4(c, a*0.55);
          }`,
      }),
    [],
  )
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -9, 0]} material={mat}>
      <planeGeometry args={[600, 600]} />
    </mesh>
  )
}

function HoloCampus() {
  const g = useRef<THREE.Group>(null!)
  const lines = useMemo(() => {
    const parts: THREE.BufferGeometry[] = []
    const box = (w: number, h: number, d: number, x: number, y: number, z: number) => {
      const e = new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d))
      e.translate(x, y, z)
      parts.push(e)
    }
    box(48, 12.6, 16, 0, 6.3, 0)
    box(16, 15.6, 3.8, 0, 7.8, 9)
    box(20, 8.6, 20, -42, 4.3, 4)
    for (let i = 0; i < 3; i++) box(48, 0.05, 16, 0, 4.2 * (i + 1), 0)
    const merged = new THREE.BufferGeometry()
    const pos: number[] = []
    parts.forEach((p) => pos.push(...Array.from(p.attributes.position.array)))
    merged.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    return merged
  }, [])
  useFrame((_, dt) => {
    if (!device.reduced) g.current.rotation.y += dt * 0.08
  })
  return (
    <group ref={g} position={[0, -2, 0]} scale={0.55}>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color={SKY} transparent opacity={0.9} fog={false} toneMapped={false} />
      </lineSegments>
      <mesh position={[0, 6.3, 0]}>
        <boxGeometry args={[48, 12.6, 16]} />
        <meshBasicMaterial color="#2f9a6e" transparent opacity={0.1} fog={false} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[34, 34.6, 96]} />
        <meshBasicMaterial color={YEL} transparent opacity={0.8} fog={false} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function DataBars() {
  const ref = useRef<THREE.InstancedMesh>(null!)
  const N = 48
  const cfg = useMemo(
    () =>
      Array.from({ length: N }, (_, i) => {
        const a = (i / N) * Math.PI * 2
        const rad = 30 + (i % 3) * 4
        return { x: Math.cos(a) * rad, z: Math.sin(a) * rad, ph: i * 0.7, base: 3 + ((i * 37) % 11) }
      }),
    [],
  )
  useLayoutEffect(() => {
    const c = new THREE.Color()
    cfg.forEach((b, i) => ref.current.setColorAt(i, c.set(i % 4 === 0 ? YEL : i % 4 === 1 ? '#5fd0a0' : SKY)))
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
  }, [cfg])
  const m = useMemo(() => new THREE.Matrix4(), [])
  useFrame(({ clock }) => {
    const t = device.reduced ? 0 : clock.elapsedTime
    cfg.forEach((b, i) => {
      const h = b.base + Math.sin(t * 0.9 + b.ph) * 1.8 + 1
      m.compose(new THREE.Vector3(b.x, -9 + h / 2, b.z), new THREE.Quaternion(), new THREE.Vector3(1.4, h, 1.4))
      ref.current.setMatrixAt(i, m)
    })
    ref.current.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, N]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial transparent opacity={0.82} fog={false} toneMapped={false} />
    </instancedMesh>
  )
}

function Ribbons() {
  const g = useRef<THREE.Group>(null!)
  const curves = useMemo(
    () =>
      [0, 1, 2].map((k) => {
        const pts = Array.from({ length: 40 }, (_, i) => {
          const t = i / 39
          return new THREE.Vector3(-34 + t * 68, 8 + k * 6 + Math.sin(t * 6 + k) * 2.5 + t * 4, -14 - k * 5)
        })
        return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 120, 0.07, 6, false)
      }),
    [],
  )
  useFrame((_, dt) => {
    if (!device.reduced) g.current.rotation.y = Math.sin(performance.now() / 6000) * 0.1 + dt * 0
  })
  return (
    <group ref={g}>
      {curves.map((c, i) => (
        <mesh key={i} geometry={c}>
          <meshBasicMaterial color={i === 1 ? YEL : SKY} fog={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function Donut() {
  const g = useRef<THREE.Group>(null!)
  useFrame((_, dt) => {
    if (!device.reduced) g.current.rotation.y += dt * 0.35
  })
  const arcs: [number, number, string][] = [
    [0, 3.2, YEL],
    [3.3, 1.7, SKY],
    [5.1, 1.1, '#F28C28'],
  ]
  return (
    <group ref={g} position={[-26, 14, 14]}>
      {arcs.map(([s, l, c], i) => (
        <mesh key={i} rotation={[0, 0, s]}>
          <torusGeometry args={[5, 0.7, 12, 40, l]} />
          <meshBasicMaterial color={c} fog={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function Particles() {
  const ref = useRef<THREE.Points>(null!)
  const geo = useMemo(() => {
    const n = device.tier === 2 ? 260 : 700
    const p = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 8 + Math.random() * 120
      p[i * 3] = Math.cos(a) * r
      p[i * 3 + 1] = -8 + Math.random() * 70
      p[i * 3 + 2] = Math.sin(a) * r
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(p, 3))
    return g
  }, [])
  useFrame((_, dt) => {
    if (device.reduced) return
    const a = geo.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < a.count; i++) {
      let y = a.getY(i) + dt * 1.2
      if (y > 62) y = -8
      a.setY(i, y)
    }
    a.needsUpdate = true
    ref.current.rotation.y += dt * 0.01
  })
  return (
    <points ref={ref} geometry={geo} frustumCulled={false}>
      <pointsMaterial color={SKY} size={0.45} sizeAttenuation transparent opacity={0.8} depthWrite={false} fog={false} />
    </points>
  )
}

function GlassPanes() {
  const items: [number, number, number, number, number][] = [
    [-22, 16, -6, 0.5, 16],
    [22, 20, -4, -0.5, 18],
    [0, 26, -26, 0, 22],
  ]
  return (
    <>
      {items.map(([x, y, z, ry, w], i) => (
        <group key={i} position={[x, y, z]} rotation={[0, ry, 0]}>
          <mesh>
            <planeGeometry args={[w, w * 0.6]} />
            <meshBasicMaterial color="#F28C28" transparent opacity={0.1} side={THREE.DoubleSide} fog={false} depthWrite={false} />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(w, w * 0.6)]} />
            <lineBasicMaterial color={SKY} transparent opacity={0.7} fog={false} />
          </lineSegments>
        </group>
      ))}
    </>
  )
}

/** The futuristic data-space the camera dives into through the principal's monitor. */
export default function DigitalEnvironment() {
  return (
    <group
      position={[0, DIGITAL_Y, 0]}
      visible={false}
      ref={(g) => {
        digitalLights.digital = g
      }}
    >
      <GridFloor />
      <HoloCampus />
      <DataBars />
      <Ribbons />
      <Donut />
      <GlassPanes />
      <Particles />
    </group>
  )
}
