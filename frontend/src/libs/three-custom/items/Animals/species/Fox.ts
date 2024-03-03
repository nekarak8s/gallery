import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import foxGlb from '@/assets/glbs/fox.glb'

type FoxProps = {
  object: THREE.Object3D
  mixer: THREE.AnimationMixer
  walk: THREE.AnimationAction
  idle: THREE.AnimationAction
}

export class Fox {
  type: string = 'fox'
  object: THREE.Object3D
  mixer: THREE.AnimationMixer
  walk: THREE.AnimationAction
  idle: THREE.AnimationAction

  constructor(props: FoxProps) {
    if (!props) {
      throw new Error("Cannot be called directly. Uses static 'build' method")
    }

    this.object = props.object
    this.mixer = props.mixer
    this.walk = props.walk
    this.idle = props.idle
  }

  // Construct asynchronously
  static async build(gltfLoader: GLTFLoader) {
    // Load GLTF
    const glb: GLTF = await new Promise((resolve, reject) => {
      gltfLoader.load(foxGlb, (glb) => resolve(glb), undefined, reject)
    })

    // Extract mesh
    const object = glb.scene.children[0]
    object.traverse((obj) => {
      obj.castShadow = true
      obj.receiveShadow = true
    })

    // Extract animations
    const mixer = new THREE.AnimationMixer(object)
    mixer.timeScale = 1 / 3
    const idle = mixer.clipAction(glb.animations[8])
    const walk = mixer.clipAction(glb.animations[17])

    return new Fox({ object, mixer, walk, idle })
  }
}
