import * as THREE from 'three'
import { Water } from 'three/examples/jsm/objects/Water.js'
import { IItem } from './Item'
import { ItemFactory } from './ItemFactory'
import waterNomals from '@/assets/textures/water/waternormals.jpg'
import { disposeObject } from '@/libs/three-custom/utils/disposeResources'

type OceanArgs = {
  textureLoader: THREE.TextureLoader
  width: number
  depth: number
  x?: number
  y?: number
  z?: number
  color?: THREE.ColorRepresentation | undefined
  distortionScale?: number | undefined
  isFog?: boolean
}

export class OceanItem implements IItem {
  object: Water
  texture: THREE.Texture | null = null

  constructor(info: OceanArgs) {
    // Create geometry
    const geometry = new THREE.PlaneGeometry(info.width, info.depth)

    // Load texture
    this.texture = info.textureLoader.load(waterNomals, function (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    })

    // Create object
    this.object = new Water(geometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: this.texture,
      alpha: 1,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: info.color || 0x000f0f,
      distortionScale: info.distortionScale || 1,
      fog: info.isFog || false,
    })

    // Set the object position
    this.object.position.set(info.x || 0, info.y || 0, info.z || 0)
    this.object.rotation.set(-Math.PI / 2, 0, 0)
  }

  update() {
    this.object.material.uniforms['time'].value += 1.0 / 60.0
  }

  dispose() {
    disposeObject(this.object)
    this.texture = null
  }

  /*eslint-disable */
  setSunDirection(sun: THREE.Vector3) {
    this.object.material.uniforms['sunDirection'].value.copy(sun).normalize()
  }
  /*eslint-enable */
}

export default class OceanFactory extends ItemFactory {
  static instance: OceanFactory | null = null

  constructor() {
    if (!OceanFactory.instance) {
      super()
      OceanFactory.instance = this
    }
    return OceanFactory.instance
  }

  createItem(args: OceanArgs) {
    return new OceanItem(args)
  }
}
