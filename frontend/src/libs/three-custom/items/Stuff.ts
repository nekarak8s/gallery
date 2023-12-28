import { Box, Vec3, Body, Material, World, Quaternion, Cylinder } from 'cannon-es'

export type StuffArgs = {
  name?: string
  x?: number | undefined
  y?: number | undefined
  z?: number | undefined
  rotationX?: number | undefined
  rotationY?: number | undefined
  rotationZ?: number | undefined
  width?: number | undefined
  height?: number | undefined
  depth?: number | undefined
}

export class Stuff {
  name: string = ''
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
    this.name = info.name || ''

    // position
    this.x = info.x || 0
    this.y = info.y || 0
    this.z = info.z || 0

    // rotation
    this.rotationX = info.rotationX || 0
    this.rotationY = info.rotationY || 0
    this.rotationZ = info.rotationZ || 0

    // size
    this.width = info.width || 0
    this.height = info.height || 0
    this.depth = info.depth || 0
  }

  /**
   * Create Box shaped cannonBody
   */
  setBoxCannonBody(
    world: World,
    mass: number = 0,
    material?: Material,
    width?: number,
    height?: number,
    depth?: number
  ) {
    // Create shape
    const shape = new Box(
      new Vec3(
        width ? width / 2 : this.width / 2,
        height ? height / 2 : this.height / 2,
        depth ? depth / 2 : this.depth / 2
      )
    )

    // Create cannon body
    this.cannonBody = new Body({
      mass,
      position: new Vec3(this.x, this.y, this.z),
      shape,
      material,
    })

    // Set the cannonbody quaternion
    const quaternionX = new Quaternion()
    const quaternionY = new Quaternion()
    const quaternionZ = new Quaternion()
    quaternionX.setFromAxisAngle(new Vec3(1, 0, 0), this.rotationX)
    quaternionY.setFromAxisAngle(new Vec3(0, 1, 0), this.rotationY)
    quaternionZ.setFromAxisAngle(new Vec3(0, 0, 1), this.rotationZ)
    this.cannonBody.quaternion.copy(quaternionX.mult(quaternionY).mult(quaternionZ))

    // Add to the world
    world.addBody(this.cannonBody)
  }

  /**
   * Create Cylinder shaped cannonBody
   */
  setCylinderCannonBody(
    world: World,
    mass: number = 0,
    material?: Material,
    width?: number,
    height?: number,
    numSegments?: number
  ) {
    // Create shape
    const shape = new Cylinder(
      width ? width / 2 : this.width / 2,
      width ? width / 2 : this.width / 2,
      height ? height / 2 : this.height / 2,
      numSegments ? numSegments : 12
    )

    // Create cannon body
    this.cannonBody = new Body({
      mass,
      position: new Vec3(this.x, this.y, this.z),
      shape,
      material,
    })

    // Set the cannonbody quaternion
    const quaternionX = new Quaternion()
    const quaternionY = new Quaternion()
    const quaternionZ = new Quaternion()
    quaternionX.setFromAxisAngle(new Vec3(1, 0, 0), this.rotationX)
    quaternionY.setFromAxisAngle(new Vec3(0, 1, 0), this.rotationY)
    quaternionZ.setFromAxisAngle(new Vec3(0, 0, 1), this.rotationZ)
    this.cannonBody.quaternion.copy(quaternionX.mult(quaternionY).mult(quaternionZ))

    // add to the world
    world.addBody(this.cannonBody)
  }
}
