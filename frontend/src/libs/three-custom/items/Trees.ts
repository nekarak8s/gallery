import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { degToRad } from 'three/src/math/MathUtils'
import { IItems } from './Item'
import { ItemsFactory } from './ItemFactory'
import { disposeObject } from '../utils/disposeObject'
import treesGlb from '@/assets/glbs/trees.glb'

type TreeData = {
  type: number
  x: number
  y: number
  z: number
  rotation?: number
  scale?: number
}

type TreesArgs = {
  gltfLoader: GLTFLoader
  treesData: TreeData[]
  onLoad?: (tree: THREE.Object3D) => void
}

export class Trees implements IItems {
  objects: THREE.Object3D[] = []

  constructor(info: TreesArgs) {
    /**
     * Load GLTF
     */
    info.gltfLoader.load(treesGlb, (glb) => {
      // Create Trees
      info.treesData.forEach((tree) => {
        // Get an object
        const object = new THREE.Object3D()
        object.copy(glb.scene.children[tree.type])

        object.children[0].castShadow = true
        object.children[0].receiveShadow = true

        object.scale.multiplyScalar(0.01 * (tree.scale || 1))
        object.position.set(tree.x, tree.y, tree.z)
        object.rotation.set(degToRad(-90), 0, tree.rotation || 0)

        this.objects.push(object)

        info.onLoad && info.onLoad(object)
      })
    })
  }

  dispose = () => {
    this.objects.forEach((object) => {
      disposeObject(object)
    })
    this.objects = []
  }
}

export default class TreesFactory extends ItemsFactory {
  static instance: TreesFactory | null = null

  constructor() {
    if (!TreesFactory.instance) {
      super()
      TreesFactory.instance = this
    }
    return TreesFactory.instance
  }

  createItem(args: TreesArgs) {
    return new Trees(args)
  }
}
