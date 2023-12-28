import { World } from 'cannon-es'
import * as THREE from 'three'

type TextureProps = {
  textureLoader: THREE.TextureLoader
  baseImg: string
  normalImg?: string
  ambientImg?: string
  roughImg?: string
}

type FloorData = {
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

export type FloorsArgs = {
  container: THREE.Mesh | THREE.Scene
  world?: World
  floorsData: FloorData[]
  texture?: TextureProps
  color?: THREE.ColorRepresentation
  opacity?: number
  transparent?: boolean
  repeatFactor?: number
}

export class Floors {
  type: string = 'floors'
  meshes: THREE.Mesh[] = []
  textureSource: Record<string, THREE.Texture> = {}
  textures: THREE.Texture[] = []

  dispose: () => void

  constructor(info: FloorsArgs) {
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

    info.floorsData.forEach((floorData) => {
      // Geometry
      const geometry = new THREE.BoxGeometry(floorData.width, floorData.height, floorData.depth)

      // Texture
      const textures: Record<string, THREE.Texture> = {}

      for (const key in this.textureSource) {
        this.textureSource[key].wrapS = THREE.RepeatWrapping
        this.textureSource[key].wrapT = THREE.RepeatWrapping

        this.textureSource[key].repeat.x = floorData.width * (info.repeatFactor || 1)
        this.textureSource[key].repeat.y = floorData.depth * (info.repeatFactor || 1)

        textures[key] = this.textureSource[key].clone()
        this.textures.push(textures[key])
      }

      // Material
      const material = info.texture?.roughImg
        ? new THREE.MeshStandardMaterial({
            color: info.color,
            transparent: info.transparent || false,
            opacity: info.opacity,
            map: textures['baseTex'] || undefined,
            normalMap: textures['normalTex'] || undefined,
            aoMap: textures['ambientTex'] || undefined,
            roughnessMap: textures['roughTex'] || undefined,
          })
        : new THREE.MeshLambertMaterial({
            color: info.color,
            transparent: info.transparent || false,
            opacity: info.opacity,
            map: textures['baseTex'] || undefined,
            normalMap: textures['normalTex'] || undefined,
            aoMap: textures['ambientTex'] || undefined,
          })

      // Adjust position (pivot : left top)
      const rotationX = floorData.rotationX || 0
      const rotationY = floorData.rotationY || 0
      const rotationZ = floorData.rotationZ || 0

      let x = floorData.x
      let y = floorData.y - floorData.height / 2
      let z = floorData.z

      z -= (floorData.depth * (1 - Math.cos(rotationX))) / 2
      y += (floorData.depth * Math.sin(rotationX)) / 2

      x += (floorData.width * Math.cos(rotationY)) / 2
      z += (floorData.depth * Math.cos(rotationY)) / 2

      x -= (floorData.width * (1 - Math.cos(rotationZ))) / 2
      y += (floorData.width * Math.sin(rotationZ)) / 2

      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(x, y, z)
      mesh.rotation.set(rotationX, rotationY, rotationZ)
      mesh.castShadow = !info.transparent ? true : false
      mesh.receiveShadow = !info.transparent ? true : false
      mesh.name = 'floor'

      this.meshes.push(mesh)
      info.container.add(mesh)
    })

    /**
     *  Dispose function: release resources
     */
    this.dispose = () => {
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

      this.textures.forEach((texture) => {
        texture.dispose()
      })
    }
  }
}
