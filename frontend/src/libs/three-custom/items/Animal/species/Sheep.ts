import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Animal } from '../Animal'
import { AnimalFactory } from '../AnimalFactory'
import sheepGlb from '@/assets/glbs/sheep.glb'

class SheepBuilder {
  static async build(gltfLoader: GLTFLoader) {
    // Load GLTF
    const glb: GLTF = await new Promise((resolve, reject) => {
      gltfLoader.load(sheepGlb, (glb) => resolve(glb), undefined, reject)
    })

    // Extract mesh
    const object = glb.scene.children[0]
    object.scale.multiplyScalar(1.5)
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
