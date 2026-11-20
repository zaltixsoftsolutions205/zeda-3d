import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { cam, device } from '../lib/camState'
import { digitalAmount, sample, Sample } from './cameraPath'

/** Reads the scroll-driven section coordinate and flies the camera along the authored path with damping. */
export function CameraController() {
  const { camera, size } = useThree()
  const s = useRef<Sample>({ p: new THREE.Vector3(), l: new THREE.Vector3(), fov: 40 })
  const pos = useRef(new THREE.Vector3())
  const look = useRef(new THREE.Vector3())
  const fov = useRef(40)
  const ready = useRef(false)

  useFrame(({ clock }, dt) => {
    const d = Math.min(dt, 0.05)
    // capture hook (used to render the static fallback frames): ?u=3.5 pins the camera
    const forced = (window as unknown as { __zedaU?: number }).__zedaU
    if (forced !== undefined) cam.u = forced
    cam.digital = digitalAmount(cam.u)
    sample(cam.u, device.tier > 0, s.current)

    const aspect = size.width / size.height
    const targetFov = s.current.fov * (aspect < 1 ? 1.2 + (1 - aspect) * 0.5 : 1)

    if (!ready.current) {
      pos.current.copy(s.current.p)
      look.current.copy(s.current.l)
      fov.current = targetFov
      ready.current = true
    }
    const k = forced !== undefined ? 200 : device.reduced ? 20 : 5.5
    pos.current.set(
      THREE.MathUtils.damp(pos.current.x, s.current.p.x, k, d),
      THREE.MathUtils.damp(pos.current.y, s.current.p.y, k, d),
      THREE.MathUtils.damp(pos.current.z, s.current.p.z, k, d),
    )
    look.current.set(
      THREE.MathUtils.damp(look.current.x, s.current.l.x, k, d),
      THREE.MathUtils.damp(look.current.y, s.current.l.y, k, d),
      THREE.MathUtils.damp(look.current.z, s.current.l.z, k, d),
    )
    fov.current = THREE.MathUtils.damp(fov.current, targetFov, k, d)

    // gentle handheld "breathing" + pointer parallax (scaled down indoors)
    const far = THREE.MathUtils.clamp(pos.current.y / 30, 0.05, 1)
    const t = device.reduced ? 0 : clock.elapsedTime
    const par = device.reduced || device.tier > 0 ? 0 : 1
    camera.position.set(
      pos.current.x + (cam.px * 1.2 * far + Math.sin(t * 0.4) * 0.05) * (par || 0.3),
      pos.current.y + (-cam.py * 0.7 * far + Math.sin(t * 0.55) * 0.03) * (par || 0.3),
      pos.current.z,
    )
    camera.lookAt(look.current)
    const pc = camera as THREE.PerspectiveCamera
    if (Math.abs(pc.fov - fov.current) > 0.01) {
      pc.fov = fov.current
      pc.updateProjectionMatrix()
    }
  })
  return null
}
