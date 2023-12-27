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

type SpotLightProps = {
  lightOffsetX?: number
  lightOffsetY?: number
  lightOffsetZ?: number
  distance?: number
  color?: THREE.ColorRepresentation
  intensity?: number
  angle?: number
  penumbra?: number
  decay?: number
}

type FrameArgs = StuffArgs & {
  container: THREE.Scene | THREE.Mesh
  order: number
  texture?: TextureProps | undefined
  color?: THREE.ColorRepresentation
  spotLight?: SpotLightProps | undefined
  isUpdate?: boolean
}

export class Frame extends Stuff {
  type: string = 'frame'
  mesh: THREE.Mesh
  spotLight?: THREE.SpotLight
  textures: Record<string, THREE.Texture> = {}
  dispose: () => void
  update: (delta: number) => void
  isUpdate = true

  constructor(info: FrameArgs) {
    super(info)

    // Whether enable update function
    this.isUpdate = info.isUpdate ? true : false

    // Geometry
    const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth)

    // Textures
    if (info.texture) {
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
      this.textures['baseTex'] = info.texture.textureLoader.load(info.texture.baseImg)
    }

    // Material
    const material = info.texture?.roughImg
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

    // Mesh
    this.mesh = new FrameMesh(geometry, material, info.order)
    this.mesh.position.set(this.x, this.y, this.z)
    this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ)
    this.mesh.receiveShadow = true
    this.mesh.castShadow = true
    this.mesh.name = this.name || this.type

    info.container.add(this.mesh)

    // Light
    if (info.spotLight) {
      this.spotLight = new THREE.SpotLight(
        info.spotLight.color || 0xfeffdb,
        info.spotLight.intensity || 8,
        info.spotLight.distance || 5,
        info.spotLight.angle || Math.PI / 5,
        info.spotLight.penumbra,
        info.spotLight.decay || 2
      )
      this.spotLight.position.set(
        info.spotLight.lightOffsetX || 0,
        info.spotLight.lightOffsetY || 1.5,
        info.spotLight.lightOffsetZ || 2.5
      )
      this.spotLight.target = this.mesh
      this.spotLight.castShadow = true

      console.log(this.spotLight)
      this.mesh.add(this.spotLight)
    }

    /**
     *  Dispose function: release resources
     */
    this.dispose = () => {
      // Dispose light
      if (this.spotLight) {
        this.mesh.remove(this.spotLight)
        this.spotLight.dispose()
      }

      // Dispose mesh
      info.container.remove(this.mesh)

      // Dispose geometry
      this.mesh.geometry.dispose()

      // Dispose material
      if (this.mesh.material instanceof Array) {
        this.mesh.material.forEach((material) => {
          material.dispose()
        })
      } else {
        this.mesh.material.dispose()
      }

      // Dispose textures
      for (const key in this.textures) {
        const texture = this.textures[key]
        texture.dispose()
      }
    }

    /**
     *  Update function: animation
     */
    this.update = (delta: number) => {
      if (!this.isUpdate) return

      this.mesh.rotation.y += delta
    }
  }
}
