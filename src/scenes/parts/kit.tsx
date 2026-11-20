import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { mats, MatKey } from '../materials'

type V3 = [number, number, number]
type Shape = 'box' | 'cyl' | 'sph'

interface Item {
  p: V3
  s: V3
  rx?: number
  ry?: number
  rz?: number
  c?: string
}

interface Opt {
  rx?: number
  ry?: number
  rz?: number
  c?: string
}

/**
 * Collects thousands of simple solids and renders them as a handful of
 * InstancedMesh draw calls (one per shape × material). All positions are
 * "base anchored": y is the bottom of the solid, x/z the centre.
 */
export class Kit {
  groups = new Map<string, { shape: Shape; mat: MatKey; items: Item[] }>()

  private add(shape: Shape, mat: MatKey, item: Item) {
    const k = shape + ':' + mat
    let g = this.groups.get(k)
    if (!g) this.groups.set(k, (g = { shape, mat, items: [] }))
    g.items.push(item)
  }

  box(mat: MatKey, x: number, y: number, z: number, w: number, h: number, d: number, o: Opt = {}) {
    this.add('box', mat, { p: [x, y + h / 2, z], s: [w, h, d], ...o })
  }

  /** Box defined by two corners (min/max) – handy for slabs and walls. */
  slab(mat: MatKey, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, o: Opt = {}) {
    this.box(mat, (x0 + x1) / 2, y0, (z0 + z1) / 2, Math.abs(x1 - x0), y1 - y0, Math.abs(z1 - z0), o)
  }

  /** Cylinder with diameter `d` and height `h`. */
  cyl(mat: MatKey, x: number, y: number, z: number, d: number, h: number, o: Opt = {}) {
    this.add('cyl', mat, { p: [x, y + h / 2, z], s: [d, h, d], ...o })
  }

  /** Sphere (diameter `d`) whose centre is at y. */
  sph(mat: MatKey, x: number, y: number, z: number, d: number, o: Opt & { sy?: number } = {}) {
    this.add('sph', mat, { p: [x, y, z], s: [d, d * (o.sy ?? 1), d], ...o })
  }

  /** Axis-aligned wall with rectangular openings (doors / windows). */
  wall(
    mat: MatKey,
    axis: 'x' | 'z',
    fixed: number,
    a0: number,
    a1: number,
    t: number,
    y0: number,
    y1: number,
    ops: { a: number; b: number; y0: number; y1: number }[] = [],
  ) {
    const put = (s: number, e: number, by: number, ty: number) => {
      if (e - s < 1e-3 || ty - by < 1e-3) return
      if (axis === 'x') this.box(mat, (s + e) / 2, by, fixed, e - s, ty - by, t)
      else this.box(mat, fixed, by, (s + e) / 2, t, ty - by, e - s)
    }
    let cur = a0
    for (const o of [...ops].sort((p, q) => p.a - q.a)) {
      put(cur, o.a, y0, y1)
      put(o.a, o.b, y0, o.y0)
      put(o.a, o.b, o.y1, y1)
      cur = o.b
    }
    put(cur, a1, y0, y1)
  }

  /** Window frame + glass pane filling an opening. */
  glaze(
    axis: 'x' | 'z',
    fixed: number,
    a: number,
    b: number,
    y0: number,
    y1: number,
    opts: { mullions?: number; frame?: number; depth?: number } = {},
  ) {
    const { mullions = 1, frame = 0.07, depth = 0.16 } = opts
    const len = b - a
    const h = y1 - y0
    const mid = (a + b) / 2
    const B = (cx: number, by: number, w: number, hh: number, d: number, m: MatKey) =>
      axis === 'x' ? this.box(m, cx, by, fixed, w, hh, d) : this.box(m, fixed, by, cx, d, hh, w)
    B(mid, y0, len, frame, depth, 'frame')
    B(mid, y1 - frame, len, frame, depth, 'frame')
    B(a + frame / 2, y0, frame, h, depth, 'frame')
    B(b - frame / 2, y0, frame, h, depth, 'frame')
    for (let i = 1; i <= mullions; i++) {
      const cx = a + (len * i) / (mullions + 1)
      B(cx, y0, frame * 0.8, h, depth * 0.8, 'frame')
    }
    B(mid, y0, len - frame, h - frame, 0.025, 'glass')
  }

  get count() {
    let n = 0
    this.groups.forEach((g) => (n += g.items.length))
    return n
  }
}

const geos: Record<Shape, THREE.BufferGeometry> = {
  box: new THREE.BoxGeometry(1, 1, 1),
  cyl: new THREE.CylinderGeometry(0.5, 0.5, 1, 20),
  sph: new THREE.SphereGeometry(0.5, 20, 14),
}

const _m = new THREE.Matrix4()
const _q = new THREE.Quaternion()
const _e = new THREE.Euler()
const _p = new THREE.Vector3()
const _s = new THREE.Vector3()
const _c = new THREE.Color()

function InstGroup({
  shape,
  mat,
  items,
  shadows,
}: {
  shape: Shape
  mat: MatKey
  items: Item[]
  shadows: boolean
}) {
  const ref = useRef<THREE.InstancedMesh>(null!)
  const material = mats[mat]
  const transparent = (material as THREE.Material).transparent
  const hasColor = items.some((i) => i.c)

  useLayoutEffect(() => {
    const mesh = ref.current
    items.forEach((it, i) => {
      _p.set(...it.p)
      _s.set(...it.s)
      _e.set(it.rx ?? 0, it.ry ?? 0, it.rz ?? 0)
      _q.setFromEuler(_e)
      _m.compose(_p, _q, _s)
      mesh.setMatrixAt(i, _m)
      if (it.c) mesh.setColorAt(i, _c.set(it.c))
      else if (hasColor) mesh.setColorAt(i, _c.set('#ffffff'))
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    mesh.computeBoundingSphere()
    mesh.computeBoundingBox()
  }, [items, hasColor])

  return (
    <instancedMesh
      ref={ref}
      args={[geos[shape], material, items.length]}
      castShadow={shadows && !transparent}
      receiveShadow={shadows && !transparent}
      frustumCulled
    />
  )
}

export function KitMeshes({ kit, shadows = true }: { kit: Kit; shadows?: boolean }) {
  const groups = useMemo(() => [...kit.groups.entries()], [kit])
  return (
    <>
      {groups.map(([k, g]) => (
        <InstGroup key={k} shape={g.shape} mat={g.mat} items={g.items} shadows={shadows} />
      ))}
    </>
  )
}
