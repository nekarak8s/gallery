import * as THREE from 'three'
import { Water } from 'three/examples/jsm/objects/Water2.js'
import { IItem } from './Item'
import { ItemFactory } from './ItemFactory'
import { disposeObject } from '@/libs/three-custom/utils/disposeObject'

type WaterArgs = {
  textureLoader: THREE.TextureLoader
  width: number
  depth: number
  x?: number
  y?: number
  z?: number
  color?: THREE.ColorRepresentation
  scale?: number
  flowX: number
  flowY: number
  isFog?: boolean
}

export class WaterItem implements IItem {
  object: Water
  texture: THREE.Texture | null = null

  constructor(info: WaterArgs) {
    // Create geometry
    const geometry = new THREE.PlaneGeometry(info.width, info.depth)

    // Create object
    this.object = new Water(geometry, {
      textureWidth: 512,
      textureHeight: 512,
      color: info.color || 0xffffff,
      flowDirection: new THREE.Vector2(info.flowX || 1, info.flowY || 1),
      scale: info.scale || 1,
    })

    // Set the object position
    this.object.position.set(info.x || 0, info.y || 0, info.z || 0)
    this.object.rotation.set(-Math.PI / 2, 0, 0)
  }

  update() {
    // this.object.material.uniforms['time'].value += 1.0 / 60.0
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

export default class WaterFactory extends ItemFactory {
  static instance: WaterFactory | null = null

  constructor() {
    if (!WaterFactory.instance) {
      super()
      WaterFactory.instance = this
    }
    return WaterFactory.instance
  }

  createItem(args: WaterArgs) {
    return new WaterItem(args)
  }
}
