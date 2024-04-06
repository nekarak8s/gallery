import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Animal } from '../Animal'
import { AnimalFactory } from '../AnimalFactory'
import sheepGlb from '@/assets/glbs/animals/sheep-meshopt.glb'

const SHEEP_SCALE = 1.5

class SheepBuilder {
  static async build(gltfLoader: GLTFLoader) {
    // Load GLTF
    const glb: GLTF = await new Promise((resolve, reject) => {
      gltfLoader.load(sheepGlb, (glb) => resolve(glb), undefined, reject)
    })

    // Extract mesh
    const object = glb.scene.children[0]
    object.scale.multiplyScalar(SHEEP_SCALE)
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
      size: { width: 0.2 * SHEEP_SCALE, height: 0.2 * SHEEP_SCALE, depth: 0.3 * SHEEP_SCALE },
    })
  }
}

export class SheepFactory extends AnimalFactory {
  static instance: SheepFactory | null = null

  constructor() {
    if (!SheepFactory.instance) {
      super()
      SheepFactory.instance = this
    }
    return SheepFactory.instance
  }

  createAnimal(gltfLoader: GLTFLoader) {
    return SheepBuilder.build(gltfLoader)
  }
}
