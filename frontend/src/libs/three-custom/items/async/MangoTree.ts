import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { AsyncItemFactory } from './AsyncItemFactory'
import treeGlb from '@/assets/glbs/items/mango-tree-meshopt.glb'
import { disposeObject } from '@/libs/three-custom/utils/disposeObject'

type MangoTreeArgs = {
  gltfLoader: GLTFLoader
  x?: number
  y?: number
  z?: number
  rotation?: number
  scale?: number
  onLoad?: (tree: THREE.Object3D) => void
}

type MangoTreeProps = {
  object: THREE.Object3D
}

export class MangoTree {
  object: THREE.Object3D

  static async build(args: MangoTreeArgs) {
    // Load GLTF
    const glb: GLTF = await new Promise((resolve, reject) => {
      args.gltfLoader.load(treeGlb, (glb) => resolve(glb), undefined, reject)
    })

    // Extract mesh
    const object = glb.scene.children[0]
    object.scale.multiplyScalar(args.scale || 1)
    object.position.set(args.x || 0, args.y || 0, args.z || 0)
    object.rotation.y = args.rotation || 0
    object.traverse((obj) => {
      obj.castShadow = true
      obj.receiveShadow = true
    })

    return new MangoTree({
      object,
    })
  }

  constructor(info: MangoTreeProps) {
    this.object = info.object
  }

  dispose() {
    disposeObject(this.object)
  }
}

export default class MangoTreeFactory extends AsyncItemFactory {
  static instance: MangoTreeFactory | null = null

  constructor() {
    if (!MangoTreeFactory.instance) {
      super()
      MangoTreeFactory.instance = this
    }
    return MangoTreeFactory.instance
  }

  async createItem(args: MangoTreeArgs) {
    const mangoTree = await MangoTree.build(args)
    return mangoTree
  }
}
