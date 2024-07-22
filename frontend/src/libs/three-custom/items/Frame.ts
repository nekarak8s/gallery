import * as THREE from 'three'
import { IItem } from './Item'
import { ItemFactory } from './ItemFactory'
import { disposeObject } from '../utils/disposeResources'

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

type FrameArgs = {
  texture?: TextureProps
  color?: THREE.ColorRepresentation
  spotLight?: SpotLightProps
  x?: number
  y?: number
  z?: number
  width?: number
  height?: number
  depth?: number
  rotationX?: number
  rotationY?: number
  rotationZ?: number
}

export class Frame implements IItem {
  object: THREE.Mesh
  spotLight: THREE.SpotLight | null = null
  textures: Record<string, THREE.Texture> = {}

  constructor(info: FrameArgs) {
    // Create Geometry
    const geometry = new THREE.BoxGeometry(info.width, info.height, info.depth)

    // Load Textures
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

    // Select material based on the texture sources
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

    // Create mesh
    this.object = new THREE.Mesh(geometry, material)
    this.object.position.set(info.x || 0, info.y || 0, info.z || 0)
    this.object.rotation.set(info.rotationX || 0, info.rotationY || 0, info.rotationZ || 0)
    this.object.receiveShadow = true
    this.object.castShadow = true

    // Add spot light
    if (info.spotLight && info.width) {
      this.spotLight = new THREE.SpotLight(
        info.spotLight.color || 0xffffe6,
        info.spotLight.intensity || info.width * 4,
        info.spotLight.distance || info.width * 2,
        info.spotLight.angle || Math.PI / 5.2,
        info.spotLight.penumbra,
        info.spotLight.decay || 2
      )
      this.spotLight.position.set(
        info.spotLight.lightOffsetX || 0,
        info.spotLight.lightOffsetY || info.width,
        info.spotLight.lightOffsetZ || info.width
      )
      this.spotLight.target = this.object
      this.spotLight.castShadow = true
      this.spotLight.shadow.camera.far = info.spotLight.distance || info.width * 2

      this.object.add(this.spotLight)
    }
  }
  dispose() {
    disposeObject(this.object)
    this.spotLight && disposeObject(this.spotLight)
    this.textures = {}
  }
}

export default class FrameFactory extends ItemFactory {
  static instance: FrameFactory | null = null

  constructor() {
    if (!FrameFactory.instance) {
      super()
      FrameFactory.instance = this
    }
    return FrameFactory.instance
  }

  createItem(args: FrameArgs) {
    return new Frame(args)
  }
}
