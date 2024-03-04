import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import duckGlb from '@/assets/glbs/duck.glb'

type DuckProps = {
  object: THREE.Object3D
  mixer: THREE.AnimationMixer
  idle: THREE.AnimationAction
  walk: THREE.AnimationAction
  swim: THREE.AnimationAction
  height: number
}

export class Duck {
  type: string = 'duck'
  object: THREE.Object3D
  mixer: THREE.AnimationMixer
  idle: THREE.AnimationAction
  walk: THREE.AnimationAction
  swim: THREE.AnimationAction
  height: number

  constructor(props: DuckProps) {
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
      gltfLoader.load(duckGlb, (glb) => resolve(glb), undefined, reject)
    })

    // Extract mesh
    const object = glb.scene.children[0]
    object.scale.multiplyScalar(1.6)
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

    return new Duck({ object, mixer, idle, walk, swim, height: 0.4 })
  }
}
