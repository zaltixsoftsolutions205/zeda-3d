import type { Kit } from './kit'
import type { MatKey } from '../materials'

/**
 * Local coordinate frame for furniture/vehicles: build an object once facing +z,
 * then drop it anywhere with a yaw angle. Local +z maps to world (sin a, cos a).
 */
export class Local {
  private c: number
  private s: number
  constructor(
    private kit: Kit,
    private cx: number,
    private cz: number,
    private a: number,
    private y0 = 0,
  ) {
    this.c = Math.cos(a)
    this.s = Math.sin(a)
  }

  private w(lx: number, lz: number): [number, number] {
    return [this.cx + lx * this.c + lz * this.s, this.cz - lx * this.s + lz * this.c]
  }

  box(mat: MatKey, lx: number, y: number, lz: number, w: number, h: number, d: number, col?: string) {
    const [x, z] = this.w(lx, lz)
    this.kit.box(mat, x, this.y0 + y, z, w, h, d, { ry: this.a, c: col })
  }

  cyl(mat: MatKey, lx: number, y: number, lz: number, d: number, h: number, col?: string) {
    const [x, z] = this.w(lx, lz)
    this.kit.cyl(mat, x, this.y0 + y, z, d, h, { c: col })
  }

  sph(mat: MatKey, lx: number, y: number, lz: number, d: number, sy = 1, col?: string) {
    const [x, z] = this.w(lx, lz)
    this.kit.sph(mat, x, this.y0 + y, z, d, { sy, c: col })
  }
}
