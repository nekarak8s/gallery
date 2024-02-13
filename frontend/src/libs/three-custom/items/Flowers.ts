import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { degToRad } from 'three/src/math/MathUtils'
import spotLightGlb from '@/assets/glbs/flowers.glb'

type FlowerData = {
  type: number
  x: number
  y: number
  z: number
  rotation?: number
  scale?: number
}

export type FlowersProps = {
  container: THREE.Mesh | THREE.Scene
  gltfLoader: GLTFLoader
  flowersData: FlowerData[]
}

export class Flowers {
  type: string = 'flower'
  objects: THREE.Object3D[] = []
  dispose: () => void

  constructor(info: FlowersProps) {
    /**
     * Load GLTF
     */
    info.gltfLoader.load(spotLightGlb, (glb) => {
      // Create Flowers
      info.flowersData.forEach((flower) => {
        // Get an object
        const object = new THREE.Object3D()
        object.copy(glb.scene.children[flower.type])
        object.name = this.type

        object.children[0].castShadow = true
        object.children[0].receiveShadow = true

        object.scale.multiplyScalar(0.001 * (flower.scale || 1))
        object.position.set(flower.x, flower.y, flower.z)
        object.rotation.set(degToRad(-90), 0, flower.rotation || 0)

        this.objects.push(object)
        info.container.add(object)
      })
    })

    /**
     *  Dispose function: release resources
     */
    this.dispose = () => {
      // Dispose objects
      this.objects.forEach((glb) => {
        info.container.remove(glb)
      })
    }
  }
}
