import { Box3, Vector3, Object3D } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { degToRad } from 'three/src/math/MathUtils'
import spotLightGlb from '@/assets/glbs/flowers.glb'

type FlowerData = {
  type: number
  x: number
  y: number
  z: number
  rotation?: number
  scale: number
}

export type FlowersProps = {
  container: THREE.Mesh | THREE.Scene
  gltfLoader: GLTFLoader
  flowerData: FlowerData[]
}

export class Flowers {
  type: string = 'flower'
  meshes: THREE.Object3D[] = []
  dispose: () => void

  constructor(info: FlowersProps) {
    /**
     * Load GLTF
     */
    info.gltfLoader.load(spotLightGlb, (glb) => {
      // Create Flowers
      info.flowerData.forEach((flower) => {
        // Get an object
        const object = new Object3D()
        object.copy(glb.scene.children[flower.type])
        object.name = this.type
        object.scale.multiplyScalar(0.001 * flower.scale)
        object.children[0].castShadow = true
        object.children[0].receiveShadow = true

        // Add to the mesh array
        this.meshes.push(object)

        // Set the mesh size
        const box = new Box3().setFromObject(object)
        const { x: width, y: height, z: depth } = box.getSize(new Vector3())

        // Set position
        object.position.set(flower.x, flower.y, flower.z)
        object.rotation.set(degToRad(-90), 0, flower.rotation || 0)

        // Add to the container
        info.container.add(object)
      })
    })

    // Set the dispose function
    this.dispose = () => {
      this.meshes.forEach((glb) => {
        info.container.remove(glb)
      })
    }
  }
}
