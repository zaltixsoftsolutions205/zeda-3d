import { useMemo } from 'react'
import * as THREE from 'three'
import { Kit, KitMeshes } from './kit'
import { buildShell, CH, FL } from './shell'
import { buildInterior, DOORS } from './interior'
import { texHolo, texSmartBoard } from '../texturesExtra'
import { texCarpet, texLogoWall, texScreen, texSign, texTile, texWhiteboard, texWood, tiled } from '../textures'
import { digitalLights } from '../sceneState'

function Plane({
  p,
  size,
  ry = 0,
  rx = 0,
  map,
  basic = false,
  color,
  overlay = false,
}: {
  p: [number, number, number]
  size: [number, number]
  ry?: number
  rx?: number
  map?: THREE.Texture
  basic?: boolean
  color?: string
  overlay?: boolean
}) {
  return (
    <mesh position={p} rotation={[rx, ry, 0]} receiveShadow={!basic}>
      <planeGeometry args={size} />
      {basic ? (
        <meshBasicMaterial map={map} color={color} toneMapped={false} transparent={overlay} opacity={overlay ? 0.88 : 1} depthWrite={!overlay} side={overlay ? 2 : 0} />
      ) : (
        <meshStandardMaterial map={map} color={color} roughness={0.55} metalness={0.05} />
      )}
    </mesh>
  )
}

export function Building({ lite }: { lite: boolean }) {
  const kit = useMemo(() => {
    const k = new Kit()
    buildShell(k, lite)
    buildInterior(k, lite)
    return k
  }, [lite])

  const tex = useMemo(
    () => ({
      tile: tiled(texTile(), 47.4 / 2.4, 15.4 / 2.4),
      wood: tiled(texWood('#b88c5c'), 3, 1.4),
      woodL: tiled(texWood('#c7a273'), 3, 1.1),
      carpet: tiled(texCarpet(), 6, 2),
      rug: texCarpet(),
    }),
    [],
  )

  const fy = FL + 0.002
  const sign = (t: string, sub?: string) => texSign(t, { sub, w: 768, h: 192 })

  return (
    <group>
      <KitMeshes kit={kit} shadows={!lite} />

      {/* floors */}
      <Plane p={[0, fy, 0]} size={[47.4, 15.4]} rx={-Math.PI / 2} map={tex.tile} />
      <Plane p={[-15, fy + 0.002, 5.15]} size={[18, 5.1]} rx={-Math.PI / 2} map={tex.woodL} />
      <Plane p={[15, fy + 0.002, 5.15]} size={[18, 5.1]} rx={-Math.PI / 2} map={tex.wood} />
      <Plane p={[-15, fy + 0.002, -4.35]} size={[18, 6.7]} rx={-Math.PI / 2} map={tex.wood} />
      <Plane p={[15, fy + 0.002, -4.35]} size={[18, 6.7]} rx={-Math.PI / 2} map={tex.carpet} />
      <Plane p={[20.2, fy + 0.012, 5.5]} size={[5.4, 3.6]} rx={-Math.PI / 2} color="#e3f1ee" />
      {/* forecourt under the portico */}
      <mesh position={[0, 0.125, 11.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 6.5]} />
        <meshStandardMaterial color="#cfc8ba" roughness={0.8} />
      </mesh>

      {/* digital classroom: smart board + floating holographic analytics */}
      <Plane p={[15.5, 2.12, -7.57]} size={[3.5, 1.97]} map={texSmartBoard()} basic />
      <Plane p={[10.6, 2.7, -5.9]} size={[1.9, 1.19]} ry={0.55} map={texHolo(0)} basic overlay />
      <Plane p={[20.6, 2.7, -5.9]} size={[1.9, 1.19]} ry={-0.55} map={texHolo(1)} basic overlay />
      <Plane p={[15.5, 3.4, -6.6]} size={[2.0, 1.25]} map={texHolo(2)} basic overlay />
      {/* reception logo wall */}
      <Plane p={[0, 2.3, -7.55]} size={[6.4, 3.2]} map={texLogoWall()} basic />
      {/* classroom whiteboard */}
      <Plane p={[-23.72, 1.95, 5.1]} size={[4.6, 1.15]} ry={Math.PI / 2} map={texWhiteboard()} />
      {/* principal's monitor + staff screens (faces -x) */}
      <Plane p={[20.42, 1.36, 5.85]} size={[0.56, 0.33]} ry={-Math.PI / 2} map={texScreen(0)} basic />

      {/* door signage */}
      <Plane p={[DOORS.class, 3.55, 2.38]} size={[2.2, 0.55]} ry={Math.PI} map={sign('CLASS 8-A', 'Classroom')} basic />
      <Plane p={[DOORS.office, 3.55, 2.38]} size={[2.2, 0.55]} ry={Math.PI} map={sign('PRINCIPAL', 'Administration Office')} basic />
      <Plane p={[DOORS.library, 3.55, -0.88]} size={[2.2, 0.55]} map={sign('LIBRARY', 'Reading Room')} basic />
      <Plane p={[DOORS.lab, 3.55, -0.88]} size={[2.2, 0.55]} map={sign('COMPUTER LAB', 'Digital Learning')} basic />

      {/* school name on tower */}
      <Plane
        p={[0, 11.9, 10.07]}
        size={[10.4, 2.6]}
        map={texSign('MEDAV.AI PUBLIC SCHOOL', { sub: 'Learn · Grow · Lead', w: 1024, h: 256 })}
        basic
      />

      {/* interior lighting – few real lights, rest is emissive panels */}
      <InteriorLights lite={lite} />
    </group>
  )
}

const lightPts: [number, number, number][] = [
  [0, CH - 0.5, 4.5],
  [0, CH - 0.5, -4.5],
  [-15, CH - 0.5, 0.8],
  [15, CH - 0.5, 0.8],
  [-14, CH - 0.5, 5.2],
  [15, CH - 0.5, 5.2],
  [-14, CH - 0.5, -4.3],
  [15, CH - 0.5, -4.3],
  [-4, CH - 0.5, 0.8],
  [5, CH - 0.5, 0.8],
]

function InteriorLights({ lite }: { lite: boolean }) {
  const pts = lite ? lightPts.slice(0, 6) : lightPts
  return (
    <group
      ref={(g) => {
        digitalLights.interior = g
      }}
    >
      {pts.map((p, i) => (
        <pointLight key={i} position={p} intensity={24} distance={16} decay={2} color="#fff1d6" />
      ))}
    </group>
  )
}
