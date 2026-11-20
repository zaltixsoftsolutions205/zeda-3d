import { useMemo } from 'react'
import * as THREE from 'three'
import { Kit, KitMeshes } from './kit'
import { texCourt, texField, texTrack, tiled } from '../textures'
import { person } from './people'

function rounded(w: number, h: number, r: number, hole = false) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r)
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h)
  s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  void hole
  return s
}

export function Playground({ lite }: { lite: boolean }) {
  const track = useMemo(() => {
    const outer = rounded(36, 54, 14)
    const inner = rounded(24, 42, 8)
    outer.holes.push(new THREE.Path(inner.getPoints(24).reverse()))
    const g = new THREE.ShapeGeometry(outer, 24)
    return g
  }, [])
  const trackTex = useMemo(() => tiled(texTrack(), 1 / 6, 1 / 6), [])

  const lanes = useMemo(
    () =>
      [1, 2, 3, 4, 5].map((n) => {
        const o = rounded(24 + 2 * n, 42 + 2 * n, 8 + n)
        o.holes.push(new THREE.Path(rounded(24 + 2 * n - 0.1, 42 + 2 * n - 0.1, 8 + n - 0.05).getPoints(24).reverse()))
        return new THREE.ShapeGeometry(o, 24)
      }),
    [],
  )

  const kit = useMemo(() => {
    const k = new Kit()
    // athletes mid-stride on the track + a kickabout on the field + basketball
    const run: [number, number, number][] = [
      [47 + 14.5, 4, 0],
      [47 + 15.5, 10, 0.1],
      [47 - 14.5, -2, Math.PI],
      [47 - 15.6, -9, Math.PI],
      [47 + 3, 4 - 22.2, Math.PI / 2],
      [47 - 4, 4 + 22.4, -Math.PI / 2],
    ]
    run.forEach(([x, z, a], i) =>
      person(k, x, z, a, { shirt: i % 2 ? '#e8731a' : '#2f8f66', pants: '#1a1a1a', stride: 1, arms: 'down', bag: false, skin: i % 5, scale: 1.0 }),
    )
    const field: [number, number][] = [[44, 2], [48, 6], [52, 0], [46, 12], [50, -6], [43, -4]]
    field.forEach(([x, z], i) =>
      person(k, x, z, i * 1.1, { shirt: i % 2 ? '#e8731a' : '#f3f1ea', pants: '#123d2e', stride: i % 2 ? 0.9 : -0.9, bag: false, skin: i % 5 }),
    )
    const court: [number, number][] = [[40, -36], [44, -34], [50, -38], [54, -35]]
    court.forEach(([x, z], i) => person(k, x, z, i * 0.8, { shirt: i % 2 ? '#e8731a' : '#2f8f66', pants: '#111', stride: 0.8, arms: 'up', bag: false, skin: i % 5 }))
    // football goals (z ends of the field)
    for (const sz of [-1, 1]) {
      const z = 4 + sz * 20.5
      k.box('white', 47 - 2.4, 0, z, 0.1, 2.4, 0.1)
      k.box('white', 47 + 2.4, 0, z, 0.1, 2.4, 0.1)
      k.box('white', 47, 2.4, z, 4.9, 0.1, 0.1)
    }
    // basketball hoops
    for (const sx of [-1, 1]) {
      const x = 47 + sx * 12.6
      k.cyl('metal', x, 0, -36, 0.14, 3.6)
      k.box('white', x - sx * 0.7, 2.9, -36, 0.06, 1.0, 1.7)
      k.box('red', x - sx * 1.0, 2.9, -36, 0.45, 0.04, 0.45)
    }
    // swings + slide for juniors
    for (const dx of [0, 4]) {
      k.cyl('metal', -46 + dx, 0, -30, 0.1, 2.6, { rz: 0 })
    }
    k.box('metal', -46, 2.6, -30, 4.1, 0.1, 0.1)
    k.box('metal', -46, 0, -31.3, 0.1, 2.6, 0.1)
    k.box('metal', -42, 0, -31.3, 0.1, 2.6, 0.1)
    k.box('metal', -46, 0, -28.7, 0.1, 2.6, 0.1)
    k.box('metal', -42, 0, -28.7, 0.1, 2.6, 0.1)
    for (const x of [-45, -43]) {
      k.box('chairYellow', x, 0.6, -30, 0.45, 0.05, 0.3)
      k.box('metal', x - 0.2, 0.6, -30, 0.02, 2.0, 0.02)
      k.box('metal', x + 0.2, 0.6, -30, 0.02, 2.0, 0.02)
    }
    k.box('chairOrange', -36, 1.0, -30, 0.9, 0.08, 2.6, { rx: 0.5 })
    k.box('metal', -36, 0, -31.2, 1.0, 2.0, 0.1)
    // bleachers
    for (let i = 0; i < 4; i++) k.box('concreteDark', 47, i * 0.4, 36 + i * 0.7, 18, 0.4, 0.7)
    void lite
    return k
  }, [lite])

  return (
    <group>
      <mesh position={[47, 0.045, 4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[27, 45]} />
        <meshStandardMaterial map={texField()} roughness={1} />
      </mesh>
      <mesh position={[47, 0.06, 4]} rotation={[-Math.PI / 2, 0, 0]} geometry={track} receiveShadow>
        <meshStandardMaterial map={trackTex} roughness={0.95} />
      </mesh>
      <mesh position={[47, 0.05, -36]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 16]} />
        <meshStandardMaterial map={texCourt()} roughness={0.8} />
      </mesh>
      {lanes.map((g, i) => (
        <mesh key={i} position={[47, 0.07, 4]} rotation={[-Math.PI / 2, 0, 0]} geometry={g}>
          <meshBasicMaterial color="#f4efe6" />
        </mesh>
      ))}
      <KitMeshes kit={kit} shadows={!lite} />
    </group>
  )
}
