import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { Kit, KitMeshes } from './kit'
import { Local } from './local'
import { texAsphalt, texCloud, texGrass, texPaver, texSign, tiled } from '../textures'
import { timeUniform } from '../sceneState'
import { device } from '../../lib/camState'

const rand = (seed: number) => {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function Flat({
  x,
  z,
  w,
  d,
  y = 0.02,
  map,
  rx,
  rz,
  color,
}: {
  x: number
  z: number
  w: number
  d: number
  y?: number
  map?: THREE.Texture
  rx?: number
  rz?: number
  color?: string
}) {
  return (
    <mesh position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial map={rx && rz ? tiled(map!, rx, rz) : map} color={color} roughness={0.92} />
    </mesh>
  )
}

/** Foliage that gently sways in the wind via a vertex-shader tweak (no per-frame CPU work). */
function useFoliageMaterial() {
  return useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.9, flatShading: false })
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = timeUniform
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nuniform float uTime;')
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
          #ifdef USE_INSTANCING
            float ph = instanceMatrix[3].x * 0.37 + instanceMatrix[3].z * 0.23;
            float sway = sin(uTime * 1.3 + ph) * 0.06 + sin(uTime * 2.7 + ph * 1.7) * 0.025;
            transformed.x += sway * (position.y + 0.8);
            transformed.z += cos(uTime * 1.1 + ph) * 0.04 * (position.y + 0.8);
          #endif`,
        )
    }
    m.customProgramCacheKey = () => 'foliage-sway'
    return m
  }, [])
}

function Trees({ points, lite }: { points: [number, number, number][]; lite: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null!)
  const mat = useFoliageMaterial()
  const geo = useMemo(() => {
    let g: THREE.BufferGeometry = new THREE.IcosahedronGeometry(1, lite ? 1 : 2)
    g.deleteAttribute('normal')
    g.deleteAttribute('uv')
    g = mergeVertices(g)
    const p = g.attributes.position
    const v = new THREE.Vector3()
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i)
      const n = 0.82 + 0.3 * Math.abs(Math.sin(v.x * 7.1 + v.y * 5.3 + v.z * 3.7))
      p.setXYZ(i, v.x * n, v.y * n * 0.9, v.z * n)
    }
    g.computeVertexNormals()
    return g
  }, [lite])

  const { trunks, clumps } = useMemo(() => {
    const r = rand(1234)
    const k = new Kit()
    const c: { p: THREE.Vector3; s: number; col: THREE.Color }[] = []
    for (const [x, z, s] of points) {
      const h = 3.2 * s
      k.cyl('bark', x, 0, z, 0.38 * s, h)
      const base = new THREE.Color().setHSL(0.27 + r() * 0.05, 0.45 + r() * 0.15, 0.14 + r() * 0.08)
      const n = lite ? 2 : 3
      for (let i = 0; i < n; i++) {
        const a = r() * Math.PI * 2
        const rr = i === 0 ? 0 : 1.2 * s
        c.push({
          p: new THREE.Vector3(x + Math.cos(a) * rr, h + 1.2 * s + i * 0.35 * s, z + Math.sin(a) * rr),
          s: (2.3 - i * 0.2) * s,
          col: base.clone().offsetHSL(0, 0, (r() - 0.5) * 0.06),
        })
      }
    }
    return { trunks: k, clumps: c }
  }, [points, lite])

  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    clumps.forEach((c, i) => {
      m.compose(c.p, new THREE.Quaternion(), new THREE.Vector3(c.s, c.s * 0.9, c.s))
      ref.current.setMatrixAt(i, m)
      ref.current.setColorAt(i, c.col)
    })
    ref.current.instanceMatrix.needsUpdate = true
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
    ref.current.computeBoundingSphere()
  }, [clumps])

  return (
    <>
      <KitMeshes kit={trunks} shadows={!lite} />
      <instancedMesh ref={ref} args={[geo, mat, clumps.length]} castShadow={!lite} receiveShadow />
    </>
  )
}

function Flowers() {
  const ref = useRef<THREE.InstancedMesh>(null!)
  const items = useMemo(() => {
    const r = rand(77)
    const cols = ['#e86a8c', '#f4c542', '#f08a3c', '#ffffff', '#b98be8']
    const out: { p: [number, number, number]; c: string }[] = []
    const beds: [number, number, number, number][] = [
      [-8.5, 20, 3, 14],
      [8.5, 20, 3, 14],
      [-8.5, 40, 3, 6],
      [8.5, 40, 3, 6],
    ]
    for (const [bx, bz, w, d] of beds)
      for (let i = 0; i < 90; i++)
        out.push({
          p: [bx + (r() - 0.5) * w, 0.22 + r() * 0.2, bz + (r() - 0.5) * d],
          c: cols[Math.floor(r() * cols.length)],
        })
    return out
  }, [])
  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    const c = new THREE.Color()
    items.forEach((it, i) => {
      m.compose(new THREE.Vector3(...it.p), new THREE.Quaternion(), new THREE.Vector3(0.28, 0.2, 0.28))
      ref.current.setMatrixAt(i, m)
      ref.current.setColorAt(i, c.set(it.c))
    })
    ref.current.instanceMatrix.needsUpdate = true
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
    ref.current.computeBoundingSphere()
  }, [items])
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, items.length]}>
      <sphereGeometry args={[1, 8, 6]} />
      <meshStandardMaterial roughness={0.8} />
    </instancedMesh>
  )
}

function Flag() {
  const g = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    if (device.reduced) return
    g.current.rotation.y = Math.sin(clock.elapsedTime * 1.6) * 0.12
    g.current.scale.x = 1 + Math.sin(clock.elapsedTime * 3.2) * 0.03
  })
  return (
    <group position={[-15, 0, 24]}>
      <mesh position={[0, 5, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.09, 10, 8]} />
        <meshStandardMaterial color="#c9ced6" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.7, 0.9, 0.4, 16]} />
        <meshStandardMaterial color="#b5b2aa" roughness={0.9} />
      </mesh>
      <group ref={g} position={[0, 9, 0]}>
        {[
          ['#ff9933', 0.4],
          ['#ffffff', 0],
          ['#138808', -0.4],
        ].map(([c, y], i) => (
          <mesh key={i} position={[0.9, y as number, 0]}>
            <planeGeometry args={[1.8, 0.4]} />
            <meshBasicMaterial color={c as string} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        ))}
        <mesh position={[0.9, 0, 0.002]}>
          <circleGeometry args={[0.15, 16]} />
          <meshBasicMaterial color="#000080" wireframe toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

function Clouds() {
  const g = useRef<THREE.Group>(null!)
  const tex = useMemo(() => texCloud(), [])
  const list = useMemo(() => {
    const r = rand(5)
    return Array.from({ length: 12 }, () => ({
      p: [(r() - 0.5) * 520, 95 + r() * 70, -150 + r() * 300] as [number, number, number],
      s: 90 + r() * 110,
    }))
  }, [])
  useFrame((_, dt) => {
    if (device.reduced) return
    g.current.children.forEach((c) => {
      c.position.x += dt * 1.4
      if (c.position.x > 280) c.position.x = -280
    })
  })
  return (
    <group ref={g}>
      {list.map((c, i) => (
        <sprite key={i} position={c.p} scale={[c.s, c.s * 0.5, 1]}>
          <spriteMaterial map={tex} transparent opacity={0.8} depthWrite={false} fog={false} />
        </sprite>
      ))}
    </group>
  )
}

function buildGrounds(k: Kit, lite: boolean) {
  // boundary wall
  const wallH = 2.4
  const X = 76
  const ZF = 50
  const ZB = -52
  k.slab('paint', -X, 0, ZB, X, wallH, ZB + 0.4)
  k.slab('paint', -X, 0, ZB, -X + 0.4, wallH, ZF)
  k.slab('paint', X - 0.4, 0, ZB, X, wallH, ZF)
  k.slab('paint', -X, 0, ZF - 0.4, -6, wallH, ZF)
  k.slab('paint', 6, 0, ZF - 0.4, X, wallH, ZF)
  k.slab('indigo', -X, wallH, ZF - 0.5, -6, wallH + 0.15, ZF + 0.1)
  k.slab('indigo', 6, wallH, ZF - 0.5, X, wallH + 0.15, ZF + 0.1)
  // pillars
  for (let x = -X + 6; x < X; x += 12) if (Math.abs(x) > 8) k.box('concrete', x, 0, ZF - 0.2, 0.7, wallH + 0.3, 0.7)
  // gate
  for (const s of [-1, 1]) {
    k.box('paintWhite', s * 5.6, 0, ZF - 0.2, 1.3, 4.4, 1.3)
    k.box('indigo', s * 5.6, 4.4, ZF - 0.2, 1.5, 0.25, 1.5)
    k.sph('yellowGlow', s * 5.6, 4.9, ZF - 0.2, 0.45)
    for (let i = 0; i < 6; i++) {
      k.box('frame', s * (1.2 + i * 0.5) * 1, 0.2, ZF - 0.2, 0.05, 1.9, 0.05)
    }
  }
  k.slab('indigo', -6, 4.0, ZF - 0.5, 6, 4.5, ZF + 0.1)
  // paths + lamp posts
  for (let z = 18; z <= 46; z += 7) {
    for (const x of [-4.4, 4.4]) {
      k.cyl('metal', x, 0, z, 0.12, 4.2)
      k.sph('yellowGlow', x, 4.35, z, 0.4)
    }
  }
  // hedges along the central axis
  for (const s of [-1, 1]) {
    k.box('hedge', s * 5.3, 0, 31, 0.9, 0.9, 30)
    k.box('hedge', s * 11, 0, 17.5, 11, 0.7, 0.8)
  }
  // benches
  for (const [x, z] of [
    [-12, 31],
    [12, 31],
    [-12, 38],
    [12, 38],
  ]) {
    k.box('woodLight', x, 0.42, z, 1.8, 0.06, 0.5)
    k.box('woodLight', x, 0.7, z - 0.22, 1.8, 0.4, 0.05)
    k.box('metal', x - 0.8, 0, z, 0.05, 0.42, 0.45)
    k.box('metal', x + 0.8, 0, z, 0.05, 0.42, 0.45)
  }
  // road markings
  for (let x = -150; x < 150; x += 8) k.box('white', x, 0.06, 58, 3.5, 0.02, 0.25)
  // cars in the parking apron
  const carMats = ['carRed', 'carWhite', 'carSilver', 'carBlue', 'carWhite', 'carSilver'] as const
  const n = lite ? 4 : 8
  for (let i = 0; i < n; i++) {
    const L = new Local(k, -62 + (i % 4) * 4.2, i < 4 ? 21 : 37, 0, 0)
    const m = carMats[i % carMats.length]
    L.box(m, 0, 0.3, 0, 1.8, 0.65, 4.2)
    L.box(m, 0, 0.9, -0.2, 1.6, 0.55, 2.2)
    L.box('frame', 0, 0.95, -0.2, 1.62, 0.4, 2.0)
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) L.cyl('rubber', sx * 0.9, 0.0, sz * 1.3, 0.62, 0.22)
  }
  void lite
}

export function Grounds({ lite }: { lite: boolean }) {
  const kit = useMemo(() => {
    const k = new Kit()
    buildGrounds(k, lite)
    return k
  }, [lite])

  const grass = useMemo(() => tiled(texGrass(), 130, 130), [])
  const trees = useMemo(() => {
    const r = rand(2024)
    const pts: [number, number, number][] = []
    const add = (x: number, z: number, s = 0.8 + r() * 0.6) => pts.push([x, z, s])
    // along inside of the wall
    for (let x = -70; x <= 70; x += 8 + r() * 3) {
      if (Math.abs(x) < 9) continue
      add(x, 46 + r() * 2)
      add(x + 3, -48 + r() * 2)
    }
    for (let z = -44; z <= 44; z += 9 + r() * 3) {
      add(-72 + r() * 2, z)
      add(72 - r() * 2, z)
    }
    // front lawns
    for (const sx of [-1, 1]) for (let i = 0; i < 5; i++) add(sx * (14 + r() * 22), 20 + r() * 24)
    // behind the school
    for (let i = 0; i < 16; i++) add(-60 + r() * 120, -40 + r() * 20)
    // beyond the wall – a green belt that frames the campus
    for (let i = 0; i < (lite ? 40 : 90); i++) {
      const a = r() * Math.PI * 2
      const rad = 95 + r() * 70
      add(Math.cos(a) * rad * 1.35, Math.sin(a) * rad - 4, 1 + r() * 0.8)
    }
    return pts.filter(([x, z]) => !(Math.abs(x) < 8 && z > 10 && z < 50) && !(x > 26 && x < 70 && z > -26 && z < 34))
  }, [lite])

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[900, 900]} />
        <meshStandardMaterial map={grass} roughness={1} />
      </mesh>
      {/* paved forecourt axis + plaza */}
      <Flat x={0} z={31} w={7} d={34} map={texPaver()} rx={4} rz={20} />
      <Flat x={0} z={17.2} w={26} d={4} map={texPaver()} rx={14} rz={2.4} />
      <Flat x={0} z={51} w={12} d={10} map={texAsphalt()} rx={5} rz={4} y={0.03} />
      {/* perimeter walkway */}
      <Flat x={-38} z={15} w={26} d={3} map={texPaver()} rx={12} rz={2} />
      {/* road */}
      <Flat x={0} z={58} w={400} d={16} map={texAsphalt()} rx={80} rz={3} y={0.03} />
      <Flat x={0} z={65.5} w={400} d={2} color="#a9a79f" y={0.05} />
      <Flat x={0} z={50.5} w={400} d={1.5} color="#a9a79f" y={0.05} />
      {/* parking apron */}
      <Flat x={-50} z={29} w={34} d={30} map={texAsphalt()} rx={10} rz={9} y={0.03} />
      {/* name board at the gate */}
      <mesh position={[0, 4.25, 49.9]}>
        <planeGeometry args={[11, 0.4]} />
        <meshBasicMaterial map={texSign('ZEDA PUBLIC SCHOOL', { w: 1024, h: 48, bg: '#0F3D2E' })} toneMapped={false} />
      </mesh>
      <KitMeshes kit={kit} shadows={!lite} />
      <Trees points={trees} lite={lite} />
      <Flowers />
      <Flag />
      <Clouds />
    </group>
  )
}
