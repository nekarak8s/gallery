import * as THREE from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky.js'
import { IItem } from './Item'
import { ItemFactory } from './ItemFactory'
import { disposeObject } from '../utils/disposeResources'

type SkyArgs = {
  size: number
}
export class SkyItem implements IItem {
  object: Sky

  constructor(info: SkyArgs) {
    this.object = new Sky()
    this.object.scale.setScalar(info.size)
    this.object.name = 'sky'
  }

  dispose() {
    disposeObject(this.object)
  }

  /*eslint-disable */
  setSunPosition(sun: THREE.Vector3) {
    this.object.material.uniforms['sunPosition'].value.copy(sun)
  }
  /*eslint-enable */
}

export default class SkyFactory extends ItemFactory {
  static instance: SkyFactory | null = null

  constructor() {
    if (!SkyFactory.instance) {
      super()
      SkyFactory.instance = this
    }
    return SkyFactory.instance
  }

  createItem(args: SkyArgs) {
    return new SkyItem(args)
  }
}
