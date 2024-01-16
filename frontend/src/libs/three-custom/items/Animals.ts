import { Body, World } from 'cannon-es'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { degToRad } from 'three/src/math/MathUtils'
import animalGlb from '@/assets/glbs/animals.glb'

type AnimalData = {
  type: number
  x: number
  y: number
  z: number
  rotation?: number
  scale?: number
}

export type AnimalsProps = {
  container: THREE.Mesh | THREE.Scene
  world?: World | undefined
  gltfLoader: GLTFLoader
  animalsData: AnimalData[]
}

export class Animals {
  type: string = 'trees'
  objects: THREE.Object3D[] = []
  cannonBodies: Body[] = []
  dispose: () => void

  constructor(info: AnimalsProps) {
    /**
     * Load GLTF
     */
    info.gltfLoader.load(animalGlb, (glb) => {
      // Create Animals
      info.animalsData.forEach((animal) => {
        // Get an object
        const object = new THREE.Object3D()
        object.copy(glb.scene.children[animal.type])
        object.name = this.type

        object.children[0].castShadow = true
        object.children[0].receiveShadow = true

        object.scale.multiplyScalar(0.01 * (animal.scale || 1))
        object.position.set(animal.x, animal.y, animal.z)
        object.rotation.set(degToRad(-90), 0, animal.rotation || 0)

        this.objects.push(object)
        info.container.add(object)

        const mixer = new THREE.AnimationMixer(object)
        const actions = []
        actions[0] = mixer.clipAction(object.animations[0])
      })
    })

    /**
     *  Dispose function: release resources
     */
    this.dispose = () => {
      // Dispose cannon bodies
      if (info.world) {
        this.cannonBodies.forEach((cannonBody) => {
          info.world!.removeBody(cannonBody)
        })
      }

      // Dispose objects
      this.objects.forEach((glb) => {
        info.container.remove(glb)
      })
    }
  }
}
