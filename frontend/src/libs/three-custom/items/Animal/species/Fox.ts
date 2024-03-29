import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import foxGlb from '@/assets/glbs/fox.glb'

type FoxProps = {
  object: THREE.Object3D
  mixer: THREE.AnimationMixer
  idle: THREE.AnimationAction
  walk: THREE.AnimationAction
  swim: THREE.AnimationAction
  height: number
}

export class Fox {
  type: string = 'fox'
  object: THREE.Object3D
  mixer: THREE.AnimationMixer
  idle: THREE.AnimationAction
  walk: THREE.AnimationAction
  swim: THREE.AnimationAction
  height: number

  constructor(props: FoxProps) {
    if (!props) {
      throw new Error("Cannot be called directly. Uses static 'build' method")
    }

    this.object = props.object
    this.mixer = props.mixer
    this.idle = props.idle
    this.walk = props.walk
    this.swim = props.swim
    this.height = props.height
  }

  // Construct asynchronously
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

    return new Fox({ object, mixer, idle, walk, swim, height: 0.6 })
  }
}
