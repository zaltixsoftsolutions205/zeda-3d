import type * as THREE from 'three'

/** Refs to scene objects that the world controller modulates while crossing into the digital space. */
export const digitalLights: {
  interior: THREE.Group | null
  school: THREE.Group | null
  digital: THREE.Group | null
} = { interior: null, school: null, digital: null }

export const timeUniform = { value: 0 }
