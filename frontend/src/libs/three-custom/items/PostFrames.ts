import * as THREE from 'three'
import { IItems } from './Item'
import { ItemsFactory } from './ItemFactory'
import { disposeObject } from '../utils/disposeResources'
import { PostData } from '@/features/post/types'

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

type FrameData = {
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

export type PostFramesArgs = {
  postList: PostData[]
  framesData: FrameData[]
  textureLoader: THREE.TextureLoader
  color?: THREE.ColorRepresentation
  normalImg?: string
  ambientImg?: string
  roughImg?: string
  repeatX?: number
  repeatY?: number
  spotLight?: SpotLightProps
  isAnimation?: boolean
}

export class PostFrames implements IItems {
  objects: THREE.Mesh[] = []
  lights: THREE.SpotLight[] = []
  textures: Record<string, THREE.Texture> = {}
  isAnimation: boolean

  #sumDelta: number = 0

  constructor(info: PostFramesArgs) {
    this.isAnimation = info.isAnimation || false

    // Load Textures
    if (info.normalImg) {
      this.textures['normalTex'] = info.textureLoader.load(info.normalImg)
    }
    if (info.roughImg) {
      this.textures['roughTex'] = info.textureLoader.load(info.roughImg)
    }
    if (info.ambientImg) {
      this.textures['ambientTex'] = info.textureLoader.load(info.ambientImg)
    }

    for (const key in this.textures) {
      this.textures[key].wrapS = THREE.RepeatWrapping
      this.textures[key].wrapT = THREE.RepeatWrapping
      this.textures[key].repeat.x = info.repeatX || 1
      this.textures[key].repeat.y = info.repeatY || 1
    }

    info.framesData.forEach((frameData, idx) => {
      if (!info.postList[idx].isActive) return

      // Geometry
      const geometry = new THREE.BoxGeometry(frameData.width, frameData.height, frameData.depth)

      // Base image texture
      const baseTex = info.textureLoader.load(info.postList[idx].imageURL)

      // Select Material based on the texture sources
      const material = info.roughImg
        ? new THREE.MeshStandardMaterial({
            color: info.color,
            map: baseTex,
            normalMap: this.textures['normalTex'] || undefined,
            aoMap: this.textures['ambientTex'] || undefined,
            roughnessMap: this.textures['roughTex'] || undefined,
          })
        : new THREE.MeshLambertMaterial({
            color: info.color,
            map: baseTex,
            normalMap: this.textures['normalTex'] || undefined,
            aoMap: this.textures['ambientTex'] || undefined,
          })

      // Create Object
      const object = new THREE.Mesh(geometry, material)
      object.position.set(frameData.x, frameData.y, frameData.z)
      object.rotation.set(frameData.rotationX || 0, frameData.rotationY || 0, frameData.rotationZ || 0)
      object.castShadow = true
      object.receiveShadow = true
      object.name = 'frame'

      // Post data -> raycaster controls
      object.userData.isPost = true
      object.userData.idx = idx
      object.userData.width = frameData.width
      object.userData.height = frameData.height
      this.objects.push(object)

      // Add SpotLight
      if (info.spotLight && frameData.width) {
        const spotLight = new THREE.SpotLight(
          info.spotLight.color || 0xffffe6,
          info.spotLight.intensity || frameData.width * 4,
          info.spotLight.distance || frameData.width * 2,
          info.spotLight.angle || Math.PI / 5.2,
          info.spotLight.penumbra,
          info.spotLight.decay || 2
        )
        spotLight.position.set(
          info.spotLight.lightOffsetX || 0,
          info.spotLight.lightOffsetY || frameData.width,
          info.spotLight.lightOffsetZ || frameData.width
        )
        spotLight.target = object
        spotLight.castShadow = true
        spotLight.shadow.camera.far = info.spotLight.distance || frameData.width * 2

        object.add(spotLight)
        this.lights.push(spotLight)
      }
    })
  }

  update = (delta: number) => {
    if (!this.isAnimation) return
    this.#sumDelta += delta
    this.objects.forEach((object) => {
      object.position.y = Math.sin(this.#sumDelta) * 0.001 + object.position.y
    })
  }

  dispose = () => {
    this.lights.forEach((light) => {
      disposeObject(light)
    })

    this.objects.forEach((object) => {
      disposeObject(object)
    })

    this.objects = []
    this.lights = []
    this.textures = {}
  }
}

export default class PostFramesFactory extends ItemsFactory {
  static instance: PostFramesFactory | null = null

  constructor() {
    if (!PostFramesFactory.instance) {
      super()
      PostFramesFactory.instance = this
    }
    return PostFramesFactory.instance
  }

  createItem(args: PostFramesArgs) {
    return new PostFrames(args)
  }
}
