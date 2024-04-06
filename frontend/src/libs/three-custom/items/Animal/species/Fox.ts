import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Animal } from '../Animal'
import { AnimalFactory } from '../AnimalFactory'
import foxGlb from '@/assets/glbs/animals/fox-meshopt.glb'

const DUCK_SCALE = 1.5

class FoxBuilder {
  static async build(gltfLoader: GLTFLoader) {
    // Load GLTF
    const glb: GLTF = await new Promise((resolve, reject) => {
      gltfLoader.load(foxGlb, (glb) => resolve(glb), undefined, reject)
    })

    // Extract mesh
    const object = glb.scene.children[0]
    object.scale.multiplyScalar(DUCK_SCALE)
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

    return new Animal({
      object,
      mixer,
      actions: { idle, walk, swim },
      size: { width: 0.3 & DUCK_SCALE, height: 0.8 * DUCK_SCALE, depth: 1.2 * DUCK_SCALE },
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
