import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { degToRad } from 'three/src/math/MathUtils'
import plantGlb from '@/assets/glbs/plants.glb'

type PlantData = {
  type: number
  x: number
  y: number
  z: number
  rotation?: number
  scale?: number
}

export type PlantsProps = {
  container: THREE.Mesh | THREE.Scene
  gltfLoader: GLTFLoader
  plantsData: PlantData[]
}

export class Plants {
  type: string = 'plants'
  objects: THREE.Object3D[] = []
  dispose: () => void

  constructor(info: PlantsProps) {
    /**
     * Load GLTF
     */
    info.gltfLoader.load(plantGlb, (glb) => {
      console.log(glb)
      // Create Plants
      info.plantsData.forEach((plant) => {
        // Get an object
        const object = new THREE.Object3D()
        object.copy(glb.scene.children[plant.type])
        object.name = this.type

        object.children[0].castShadow = true
        object.children[0].receiveShadow = true

        object.scale.multiplyScalar(0.001 * (plant.scale || 1))
        object.position.set(plant.x, plant.y, plant.z)
        object.rotation.set(degToRad(-90), 0, plant.rotation || 0)

        console.log(object)

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
