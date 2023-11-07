export type StuffArgs = {
  name: string
  x?: number
  y?: number
  z?: number
  rotationX?: number
  rotationY?: number
  rotationZ?: number
  width?: number
  height?: number
  depth?: number
}

export class Stuff {
  name: string
  x: number
  y: number
  z: number
  rotationX: number
  rotationY: number
  rotationZ: number
  width: number
  height: number
  depth: number

  constructor(info: StuffArgs) {
    this.name = info.name
    this.x = info.x || 0
    this.y = info.y || 0
    this.z = info.z || 0
    this.rotationX = info.rotationX || 0
    this.rotationY = info.rotationY || 0
    this.rotationZ = info.rotationZ || 0
    this.width = info.width || 0
    this.height = info.height || 0
    this.depth = info.depth || 0
  }
}
