import { Body, Box, Quaternion, Vec3, World } from 'cannon-es'
import * as THREE from 'three'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

type TextureProps = {
  textureLoader: THREE.TextureLoader
  baseImg: string
  normalImg?: string
  ambientImg?: string
  roughImg?: string
}

type WallData = {
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

export type WallsArgs = {
  container: THREE.Mesh | THREE.Scene
  world?: World
  wallsData: WallData[]
  texture?: TextureProps
  color?: THREE.ColorRepresentation
  opacity?: number
  transparent?: boolean
  repeatX?: number
  repeatY?: number
}

export class Walls {
  type: string = 'walls'
  mesh: THREE.Mesh
  cannonBodies: Body[] = []
  textureSource: Record<string, THREE.Texture> = {}

  dispose: () => void

  constructor(info: WallsArgs) {
    const geometries: THREE.BoxGeometry[] = []

    info.wallsData.forEach((wallData) => {
      // Geometry
      const geometry = new THREE.BoxGeometry(wallData.width, wallData.height, wallData.depth)

      // Adjust position
      const rotationX = wallData.rotationX || 0
      const rotationY = wallData.rotationY || 0
      const rotationZ = wallData.rotationZ || 0

      const x = wallData.x + (wallData.width * Math.cos(rotationY)) / 2
      const y = wallData.y + wallData.height / 2
      const z = wallData.z - (wallData.width * Math.sin(rotationY)) / 2

      geometry.rotateX(rotationX)
      geometry.rotateY(rotationY)
      geometry.rotateZ(rotationZ)
      geometry.translate(x, y, z)

      geometries.push(geometry)

      // Cannon body
      if (info.world) {
        const cannonBody = new Body({
          mass: 0,
          position: new Vec3(x, y, z),
          shape: new Box(new Vec3(wallData.width / 2, wallData.height / 2, wallData.depth / 2)),
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

    // Load Textures
    if (info.texture) {
      this.textureSource['baseTex'] = info.texture.textureLoader.load(info.texture.baseImg)
      if (info.texture.normalImg) {
        this.textureSource['normalTex'] = info.texture.textureLoader.load(info.texture.normalImg)
      }
      if (info.texture.roughImg) {
        this.textureSource['roughTex'] = info.texture.textureLoader.load(info.texture.roughImg)
      }
      if (info.texture.ambientImg) {
        this.textureSource['ambientTex'] = info.texture.textureLoader.load(info.texture.ambientImg)
      }
    }

    for (const key in this.textureSource) {
      this.textureSource[key].wrapS = THREE.RepeatWrapping
      this.textureSource[key].wrapT = THREE.RepeatWrapping

      this.textureSource[key].repeat.x = info.repeatX || 1
      this.textureSource[key].repeat.y = info.repeatY || 1
    }

    // Create Material
    const material = info.texture?.roughImg
      ? new THREE.MeshStandardMaterial({
          color: info.color,
          transparent: info.transparent || false,
          opacity: info.opacity,
          map: this.textureSource['baseTex'] || undefined,
          normalMap: this.textureSource['normalTex'] || undefined,
          aoMap: this.textureSource['ambientTex'] || undefined,
          roughnessMap: this.textureSource['roughTex'] || undefined,
        })
      : new THREE.MeshLambertMaterial({
          color: info.color,
          transparent: info.transparent || false,
          opacity: info.opacity,
          map: this.textureSource['baseTex'] || undefined,
          normalMap: this.textureSource['normalTex'] || undefined,
          aoMap: this.textureSource['ambientTex'] || undefined,
        })

    // Create mesh
    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.castShadow = !info.transparent ? true : false
    this.mesh.receiveShadow = !info.transparent ? true : false
    this.mesh.name = 'wall'

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

      // Dispose textures
      for (const key in this.textureSource) {
        const texture = this.textureSource[key]
        texture.dispose()
      }
    }
  }
}
