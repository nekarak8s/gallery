import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import sheepGlb from '@/assets/glbs/sheep.glb'

type SheepProps = {
  object: THREE.Object3D
  mixer: THREE.AnimationMixer
  idle: THREE.AnimationAction
  walk: THREE.AnimationAction
  swim: THREE.AnimationAction
  height: number
}

export class Sheep {
  type: string = 'sheep'
  object: THREE.Object3D
  mixer: THREE.AnimationMixer
  idle: THREE.AnimationAction
  walk: THREE.AnimationAction
  swim: THREE.AnimationAction
  height: number

  constructor(props: SheepProps) {
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
      gltfLoader.load(sheepGlb, (glb) => resolve(glb), undefined, reject)
    })

    // Extract mesh
    const object = glb.scene.children[0]
    object.scale.multiplyScalar(2)
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

    return new Sheep({ object, mixer, idle, walk, swim, height: 0.6 })
  }
}
