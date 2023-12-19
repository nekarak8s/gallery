import * as THREE from 'three'
import { Stuff, StuffArgs } from './Stuff'
import { FrameMesh } from '../meshes/FrameMesh'

type TextureProps = {
  textureLoader: THREE.TextureLoader
  baseImg: string
  normalImg?: string
  ambientImg?: string
  roughImg?: string
  repeatX?: number
  repeatY?: number
}

type FrameArgs = StuffArgs & {
  container: THREE.Scene | THREE.Mesh
  order: number
  texture?: TextureProps | undefined
  color?: THREE.ColorRepresentation
  isBasicMaterial?: boolean
}

export class Frame extends Stuff {
  type: string = 'frame'
  mesh: THREE.Mesh
  textures: Record<string, THREE.Texture> = {}
  dispose: () => void
  update: (delta: number) => void

  constructor(info: FrameArgs) {
    super(info)

    // Geometry
    const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth)

    // Textures
    if (info.texture) {
      this.textures['baseTex'] = info.texture.textureLoader.load(info.texture.baseImg)
      if (info.texture.normalImg) {
        this.textures['normalTex'] = info.texture.textureLoader.load(info.texture.normalImg)
      }
      if (info.texture.roughImg) {
        this.textures['roughTex'] = info.texture.textureLoader.load(info.texture.roughImg)
      }
      if (info.texture.ambientImg) {
        this.textures['ambientTex'] = info.texture.textureLoader.load(info.texture.ambientImg)
      }
      if (info.texture.repeatX || info.texture.repeatY) {
        for (const key in this.textures) {
          const texture = this.textures[key]

          texture.wrapS = THREE.RepeatWrapping
          texture.wrapT = THREE.RepeatWrapping

          texture.repeat.x = info.texture.repeatX || 1
          texture.repeat.y = info.texture.repeatY || 1
        }
      }
    }

    // Material
    let material = null

    if (info.isBasicMaterial) {
      material = new THREE.MeshBasicMaterial({
        color: info.color,
        map: this.textures['baseTex'] || undefined,
        aoMap: this.textures['ambientTex'] || undefined,
      })
    } else {
      material = info.texture?.roughImg
        ? new THREE.MeshStandardMaterial({
            color: info.color,
            map: this.textures['baseTex'] || undefined,
            normalMap: this.textures['normalTex'] || undefined,
            aoMap: this.textures['ambientTex'] || undefined,
            roughnessMap: this.textures['roughTex'] || undefined,
          })
        : new THREE.MeshLambertMaterial({
            color: info.color,
            map: this.textures['baseTex'] || undefined,
            normalMap: this.textures['normalTex'] || undefined,
            aoMap: this.textures['ambientTex'] || undefined,
          })
    }

    // Mesh
    this.mesh = new FrameMesh(geometry, material, info.order)
    this.mesh.position.set(this.x, this.y, this.z)
    this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ)
    this.mesh.receiveShadow = true
    this.mesh.castShadow = true
    this.mesh.name = this.name || this.type

    // Add to the scene
    info.container.add(this.mesh)

    /**
     *  Dispose function: release resources
     */
    this.dispose = () => {
      // Dispose textures
      for (const key in this.textures) {
        const texture = this.textures[key]
        texture.dispose()
      }

      // Dispose material
      if (this.mesh.material instanceof Array) {
        this.mesh.material.forEach((material) => {
          material.dispose()
        })
      } else {
        this.mesh.material.dispose()
      }

      // Dispose geometry
      this.mesh.geometry.dispose()

      // Dispose mesh
      info.container.remove(this.mesh)
    }

    /**
     *  Update function: animation
     */
    this.update = (delta: number) => {
      this.mesh.rotation.y += delta
    }
  }
}
