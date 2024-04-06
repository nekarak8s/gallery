import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Animal } from '../Animal'
import { AnimalFactory } from '../AnimalFactory'
import duckGlb from '@/assets/glbs/animals/duck-meshopt.glb'

const DUCK_SCALE = 1.5

class DuckBuilder {
  static async build(gltfLoader: GLTFLoader) {
    // Load GLTF
    const glb: GLTF = await new Promise((resolve, reject) => {
      gltfLoader.load(duckGlb, (glb) => resolve(glb), undefined, reject)
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
    mixer.timeScale = 1 / 2.5
    const idle = mixer.clipAction(glb.animations[8])
    const walk = mixer.clipAction(glb.animations[17])
    const swim = mixer.clipAction(glb.animations[16])

    return new Animal({
      object,
      mixer,
      actions: { idle, walk, swim },
      size: { width: 0.8 * DUCK_SCALE, height: 0.7 * DUCK_SCALE, depth: 0.7 * DUCK_SCALE },
    })
  }
}

export class DuckFactory extends AnimalFactory {
  static instance: DuckFactory | null = null

  constructor() {
    if (!DuckFactory.instance) {
      super()
      DuckFactory.instance = this
    }
    return DuckFactory.instance
  }

  createAnimal(gltfLoader: GLTFLoader) {
    return DuckBuilder.build(gltfLoader)
  }
}
