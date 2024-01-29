import { Body, Box, Quaternion, Vec3, World } from 'cannon-es'
import * as THREE from 'three'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

type EdgeData = {
  x: number
  y: number
  z: number
  width: number
  height: number
  depth: number
  rotationX?: number
  rotationY?: number
  rotationZ?: number
}

export type EdgesArgs = {
  container: THREE.Mesh | THREE.Scene
  world?: World
  edgesData: EdgeData[]
}

export class Edges {
  type: string = 'edges'
  mesh: THREE.Mesh
  cannonBodies: Body[] = []

  dispose: () => void

  constructor(info: EdgesArgs) {
    const geometries: THREE.BoxGeometry[] = []

    info.edgesData.forEach((edgeData) => {
      // Geometry
      const geometry = new THREE.BoxGeometry(edgeData.width, edgeData.height, edgeData.depth)

      // Adjust position
      const rotationX = edgeData.rotationX || 0
      const rotationY = edgeData.rotationY || 0
      const rotationZ = edgeData.rotationZ || 0

      geometry.rotateX(rotationX)
      geometry.rotateY(rotationY)
      geometry.rotateZ(rotationZ)
      geometry.translate(edgeData.x, edgeData.y, edgeData.z)

      geometries.push(geometry)

      // Cannon body
      if (info.world) {
        const cannonBody = new Body({
          mass: 0,
          position: new Vec3(edgeData.x, edgeData.y, edgeData.z),
          shape: new Box(new Vec3(edgeData.width / 2, edgeData.height / 2, edgeData.depth / 2)),
        })

        const quaternionX = new Quaternion()
        const quaternionY = new Quaternion()
        const quaternionZ = new Quaternion()
        quaternionX.setFromAxisAngle(new Vec3(1, 0, 0), rotationX)
        quaternionY.setFromAxisAngle(new Vec3(0, 1, 0), rotationY)
        quaternionZ.setFromAxisAngle(new Vec3(0, 0, 1), rotationZ)

        cannonBody.quaternion.copy(quaternionX.mult(quaternionY).mult(quaternionZ))

        this.cannonBodies.push(cannonBody)
        info.world.addBody(cannonBody)
      }
    })

    // Merge geometry
    const geometry = BufferGeometryUtils.mergeGeometries(geometries)
    geometries.forEach((geometry) => {
      geometry.dispose()
    })

    // Create Material
    const material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      opacity: 0,
      transparent: true,
    })

    // Create mesh
    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.name = 'edge'

    info.container.add(this.mesh)

    /**
     *  Dispose function: release resources
     */
    this.dispose = () => {
      // Dispose cannon bodies
      if (info.world) {
        this.cannonBodies.forEach((cannonBody) => {
          info.world!.removeBody(cannonBody)
        })
      }

      // Dispose mesh & material & geometry
      if (this.mesh.material instanceof Array) {
        this.mesh.material.forEach((material) => {
          material.dispose()
        })
      } else {
        this.mesh.material.dispose()
      }

      this.mesh.geometry.dispose()

      info.container.remove(this.mesh)
    }
  }
}
