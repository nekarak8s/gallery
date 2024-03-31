import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Animal } from '../Animal'
import { AnimalFactory } from '../AnimalFactory'
import foxGlb from '@/assets/glbs/fox.glb'

class FoxBuilder {
  static async build(gltfLoader: GLTFLoader) {
    // Load GLTF
    const glb: GLTF = await new Promise((resolve, reject) => {
      gltfLoader.load(foxGlb, (glb) => resolve(glb), undefined, reject)
    })

    // Extract mesh
    const object = glb.scene.children[0]
    object.scale.multiplyScalar(1.7)
    object.traverse((obj) => {
      obj.castShadow = true
      obj.receiveShadow = true
    })

    // Extract animations
    const mixer = new THREE.AnimationMixer(object)
    mixer.timeScale = 1 / 2
    const idle = mixer.clipAction(glb.animations[8])
    const walk = mixer.clipAction(glb.animations[17])
    const swim = mixer.clipAction(glb.animations[16])

    // Extract size
    const box = new THREE.Box3().setFromObject(object)
    const { x: width, y: height, z: depth } = box.getSize(new THREE.Vector3())

    return new Animal({
      object,
      mixer,
      actions: { idle, walk, swim },
      size: { width, height, depth },
    })
  }
}

export class FoxFactory extends AnimalFactory {
  static instance: FoxFactory | null = null

  constructor() {
    if (!FoxFactory.instance) {
      super()
      FoxFactory.instance = this
    }
    return FoxFactory.instance
  }

  createAnimal(gltfLoader: GLTFLoader) {
    return FoxBuilder.build(gltfLoader)
  }
}
