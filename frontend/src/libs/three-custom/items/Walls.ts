import { Body, Box, Quaternion, Vec3, World } from 'cannon-es'
import * as THREE from 'three'

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
  repeatFactor?: number
}

export class Walls {
  type: string = 'walls'
  meshes: THREE.Mesh[] = []
  cannonBodies: Body[] = []
  textureSource: Record<string, THREE.Texture> = {}

  dispose: () => void

  constructor(info: WallsArgs) {
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

    info.wallsData.forEach((wallData) => {
      // Geometry
      const geometry = new THREE.BoxGeometry(wallData.width, wallData.height, wallData.depth)

      for (const key in this.textureSource) {
        this.textureSource[key].wrapS = THREE.RepeatWrapping
        this.textureSource[key].wrapT = THREE.RepeatWrapping

        this.textureSource[key].repeat.x = wallData.width * (info.repeatFactor || 1)
        this.textureSource[key].repeat.y = wallData.height * (info.repeatFactor || 1)
      }

      // Texture
      const textures: Record<string, THREE.Texture> = {}

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

      //Adjust position
      const rotationX = wallData.rotationX || 0
      const rotationY = wallData.rotationY || 0
      const rotationZ = wallData.rotationZ || 0

      const x = wallData.x + (wallData.width * Math.cos(rotationY)) / 2
      const y = wallData.y + wallData.height / 2
      const z = wallData.z - (wallData.width * Math.sin(rotationY)) / 2

      // Mesh
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(x, y, z)
      mesh.rotation.set(rotationX, rotationY, rotationZ)
      mesh.castShadow = !info.transparent ? true : false
      mesh.receiveShadow = !info.transparent ? true : false
      mesh.name = 'wall'

      this.meshes.push(mesh)
      info.container.add(mesh)

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
      this.meshes.forEach((mesh) => {
        mesh.geometry
        if (mesh.material instanceof Array) {
          mesh.material.forEach((material) => {
            material.dispose()
          })
        } else {
          mesh.material.dispose()
        }

        mesh.geometry.dispose()

        info.container.remove(mesh)
      })

      // Dispose textures
      for (const key in this.textureSource) {
        const texture = this.textureSource[key]
        texture.dispose()
      }
    }
  }
}
