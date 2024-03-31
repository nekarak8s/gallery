import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { IPlayer } from '../Player'
import michelleGlb from '@/assets/glbs/players/michelle-not.glb'

class Michelle implements IPlayer {
  object: THREE.Object3D
  mixer: THREE.AnimationMixer
  actions: {
    idle: THREE.AnimationAction
    run: THREE.AnimationAction
    runBackward: THREE.AnimationAction
    jump: THREE.AnimationAction
    fall: THREE.AnimationAction
  }
  size: {
    width: number
    height: number
    depth: number
  }

  constructor(props: IPlayer) {
    this.object = props.object
    this.mixer = props.mixer
    this.actions = props.actions
    this.size = props.size
  }
}

// Builder Pattern: Asynchronously construct an object
export class MichelleBuilder {
  static async build(gltfLoader: GLTFLoader): Promise<Michelle> {
    // Load GLTF

    const glb: GLTF = await new Promise((resolve, reject) => {
      gltfLoader.load(michelleGlb, (glb) => resolve(glb), undefined, reject)
    })

    // Extract mesh
    const object = glb.scene.children[0]
    object.scale.set(0.015, 0.015, 0.015)
    object.rotateX(-Math.PI / 2)
    object.traverse((obj) => {
      obj.castShadow = true
      obj.receiveShadow = true
    })

    // Extract animations
    const mixer = new THREE.AnimationMixer(object)
    const runBackward = mixer.clipAction(glb.animations[4])
    const run = mixer.clipAction(glb.animations[3])
    const jump = mixer.clipAction(glb.animations[2])
    const idle = mixer.clipAction(glb.animations[1])
    const fall = mixer.clipAction(glb.animations[0])

    // Extract size
    const box = new THREE.Box3().setFromObject(object)
    const { x: width, y: height, z: depth } = box.getSize(new THREE.Vector3())

    return new Michelle({
      object,
      mixer,
      actions: { idle, run, runBackward, jump, fall },
      size: { width, height, depth },
    })
  }
}
