import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { IPlayer } from '../Player'
import michelleGlb from '@/assets/glbs/players/michelle-meshopt.glb'
import { MeshoptDecoder } from '@/libs/three-custom/decoder/MeshoptDecoder'
import { toLambert } from '@/libs/three-custom/utils/changeMaterial'
import { disposeObject } from '@/libs/three-custom/utils/disposeResources'

const SCALE = 1.5

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

  constructor(props: Omit<IPlayer, 'dispose'>) {
    this.object = props.object
    this.mixer = props.mixer
    this.actions = props.actions
    this.size = props.size
  }

  dispose() {
    disposeObject(this.object)
  }
}

// Builder Pattern: Asynchronously construct an object
export class MichelleBuilder {
  static async build(gltfLoader: GLTFLoader): Promise<Michelle> {
    // Set MeshoptDecoder
    gltfLoader.setMeshoptDecoder(MeshoptDecoder)

    // Load GLTF
    const glb: GLTF = await new Promise((resolve, reject) => {
      gltfLoader.load(michelleGlb, (glb) => resolve(glb), undefined, reject)
    })

    // Extract mesh
    const object = glb.scene.children[0]
    object.scale.multiplyScalar(SCALE)
    object.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        // StandardMaterial -> MeshLambertMaterial
        toLambert(obj) // eslint-disable-line
        obj.castShadow = true
        obj.receiveShadow = true
      }
    })

    // Extract animations
    const mixer = new THREE.AnimationMixer(object)
    mixer.timeScale = 1.2
    const idle = mixer.clipAction(glb.animations[4])
    const run = mixer.clipAction(glb.animations[3])
    const runBackward = mixer.clipAction(glb.animations[2])
    const jump = mixer.clipAction(glb.animations[1])
    const fall = mixer.clipAction(glb.animations[0])

    return new Michelle({
      object,
      mixer,
      actions: { idle, run, runBackward, jump, fall },
      size: { width: 0.73, height: 1.67, depth: 0.21 },
    })
  }
}
