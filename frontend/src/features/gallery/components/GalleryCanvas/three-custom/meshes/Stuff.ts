import { Box, Vec3, Body, Material, World } from 'cannon-es'

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
  cannonBody: Body | undefined

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

  setCannonBody(world: World, mass?: number, material?: Material) {
    const shape = new Box(new Vec3(this.width / 2, this.height / 2, this.depth / 2))
    this.cannonBody = new Body({
      mass,
      position: new Vec3(this.x, this.y, this.z),
      shape,
      material,
    })
    this.cannonBody.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), this.rotationX)
    this.cannonBody.quaternion.setFromAxisAngle(new Vec3(0, 1, 0), this.rotationY)
    this.cannonBody.quaternion.setFromAxisAngle(new Vec3(0, 0, 1), this.rotationZ)
    world.addBody(this.cannonBody)
  }
}
