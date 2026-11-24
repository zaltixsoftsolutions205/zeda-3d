import { Suspense, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import SchoolEnvironment from './SchoolEnvironment'
import { CameraController } from './CameraController'
import { digitalLights, timeUniform } from './sceneState'
import { cam, device } from '../lib/camState'

const DAY_TOP = new THREE.Color('#58bfcc')
const DAY_HOR = new THREE.Color('#eaf8f6')
const NIGHT_TOP = new THREE.Color('#03323a')
const NIGHT_HOR = new THREE.Color('#0b5d68')
const FOG_DAY = new THREE.Color('#dcf3f0')
const FOG_NIGHT = new THREE.Color('#073f47')

function SkyDome() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: { top: { value: DAY_TOP.clone() }, hor: { value: DAY_HOR.clone() } },
        vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
        fragmentShader: `
          varying vec3 vP; uniform vec3 top; uniform vec3 hor;
          void main(){
            float h = clamp(vP.y*1.6+0.05,0.,1.);
            vec3 c = mix(hor, top, pow(h,0.65));
            gl_FragColor = vec4(c,1.);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }`,
      }),
    [],
  )
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ camera }) => {
    ref.current.position.copy(camera.position)
    mat.uniforms.top.value.lerpColors(DAY_TOP, NIGHT_TOP, cam.digital)
    mat.uniforms.hor.value.lerpColors(DAY_HOR, NIGHT_HOR, cam.digital)
  })
  return (
    <mesh ref={ref} material={mat} renderOrder={-10} frustumCulled={false}>
      <sphereGeometry args={[1000, 24, 16]} />
    </mesh>
  )
}

/** Drives fog / light intensity / visibility as the camera dives from the school into the digital space. */
function WorldState({ tier }: { tier: number }) {
  const { scene } = useThree()
  const sun = useRef<THREE.DirectionalLight>(null!)
  const hemi = useRef<THREE.HemisphereLight>(null!)
  const fog = useMemo(() => new THREE.Fog(FOG_DAY.clone(), 60, 520), [])
  scene.fog = fog

  useFrame(({ clock }, dt) => {
    timeUniform.value = device.reduced ? 0 : clock.elapsedTime
    const d = cam.digital
    fog.color.lerpColors(FOG_DAY, FOG_NIGHT, d)
    fog.near = THREE.MathUtils.lerp(60, 0.5, d)
    fog.far = THREE.MathUtils.lerp(520, 34, Math.pow(d, 0.6))
    const k = 1 - d * 0.92
    sun.current.intensity = 2.6 * k
    hemi.current.intensity = 0.55 * k
    scene.environmentIntensity = 0.55 * k
    if (digitalLights.school) digitalLights.school.visible = d < 0.995
    if (digitalLights.interior) digitalLights.interior.visible = d < 0.995
    if (digitalLights.digital) digitalLights.digital.visible = d > 0.01
    // keep the shadow frustum centred on the campus
    void dt
  })

  return (
    <>
      <hemisphereLight ref={hemi} args={['#cdefe8', '#b9b2a4', 0.6]} />
      <directionalLight
        ref={sun}
        position={[70, 95, 55]}
        intensity={2.6}
        color="#fff1dc"
        castShadow={tier < 2}
        shadow-mapSize={tier === 0 ? [2048, 2048] : [1024, 1024]}
        shadow-camera-left={-85}
        shadow-camera-right={85}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
        shadow-camera-near={10}
        shadow-camera-far={260}
        shadow-bias={-0.0004}
        shadow-normalBias={0.05}
      />
    </>
  )
}

export default function SchoolWorld({ tier }: { tier: number }) {
  const lite = tier > 0
  return (
    <>
      <CameraController />
      <SkyDome />
      <WorldState tier={tier} />
      {/* procedural studio environment: gives glass and paint believable reflections with zero downloads */}
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 12, 0]} rotation-x={Math.PI / 2} scale={[40, 40, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2.2} position={[-14, 5, 10]} rotation-y={Math.PI / 2} scale={[24, 12, 1]} color="#d8f3ef" />
        <Lightformer form="rect" intensity={2.4} position={[14, 4, -10]} rotation-y={-Math.PI / 2} scale={[24, 10, 1]} color="#fff0d8" />
        <Lightformer form="rect" intensity={1.2} position={[0, 3, 16]} scale={[40, 8, 1]} color="#cdefe8" />
      </Environment>
      <Suspense fallback={null}>
        <SchoolEnvironment lite={lite} />
      </Suspense>
    </>
  )
}
