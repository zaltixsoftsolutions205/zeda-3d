import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { mats } from '../materials'
import { texSign } from '../textures'
import { device } from '../../lib/camState'

/** Yellow school bus built from rounded solids with glazing, decals, wheels and lights. Faces +z. */
export function BusModel() {
  const decal = texSign('MEDAV.AI PUBLIC SCHOOL', { w: 1024, h: 128, bg: '#fbaf22', fg: '#0b5d68', accent: '#0b5d68' })
  const wheels: [number, number][] = [
    [1.2, 3.1],
    [-1.2, 3.1],
    [1.2, -3.0],
    [-1.2, -3.0],
  ]
  return (
    <group>
      <RoundedBox args={[2.5, 2.1, 10]} radius={0.18} smoothness={3} position={[0, 1.6, 0]} castShadow receiveShadow material={mats.busYellow} />
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[2.3, 0.4, 9.6]} />
        <primitive object={mats.black} attach="material" />
      </mesh>
      {/* side windows */}
      {[-1, 1].map((s) =>
        Array.from({ length: 7 }, (_, i) => (
          <mesh key={s + '-' + i} position={[s * 1.26, 2.05, -3.6 + i * 1.15]}>
            <boxGeometry args={[0.04, 0.78, 0.95]} />
            <meshPhysicalMaterial color="#0a3a42" roughness={0.05} metalness={0.7} />
          </mesh>
        )),
      )}
      {/* windshield */}
      <mesh position={[0, 2.0, 5.02]}>
        <boxGeometry args={[2.1, 0.95, 0.04]} />
        <meshPhysicalMaterial color="#0a3a42" roughness={0.05} metalness={0.7} />
      </mesh>
      {/* side decals + stripes */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 1.27, 1.2, 0]} rotation={[0, s * Math.PI * 0.5, 0]}>
          <planeGeometry args={[6.4, 0.45]} />
          <meshBasicMaterial map={decal} toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[0, 1.58, 5.015]}>
        <boxGeometry args={[2.5, 0.12, 0.02]} />
        <primitive object={mats.black} attach="material" />
      </mesh>
      {/* bumper, lights */}
      <mesh position={[0, 0.55, 5.1]}>
        <boxGeometry args={[2.6, 0.28, 0.2]} />
        <primitive object={mats.black} attach="material" />
      </mesh>
      {[-0.85, 0.85].map((x) => (
        <mesh key={x} position={[x, 1.0, 5.03]}>
          <boxGeometry args={[0.3, 0.2, 0.04]} />
          <meshBasicMaterial color="#fff6d6" toneMapped={false} />
        </mesh>
      ))}
      {wheels.map(([x, z], i) => (
        <group key={i} position={[x, 0.5, z]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 0.35, 20]} />
            <primitive object={mats.rubber} attach="material" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[Math.sign(x) * 0.18, 0, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.03, 16]} />
            <primitive object={mats.metal} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/** A parked bus on the apron + one slowly driving along the road. */
export function Buses() {
  const mover = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    if (device.reduced || !mover.current) return
    const t = (clock.elapsedTime * 4.5 + 160) % 320
    mover.current.position.x = t - 160
  })
  return (
    <>
      <group position={[-46, 0, 28]} rotation={[0, 0.0, 0]}>
        <BusModel />
      </group>
      <group ref={mover} position={[-40, 0, 61]} rotation={[0, Math.PI / 2, 0]}>
        <BusModel />
      </group>
    </>
  )
}
