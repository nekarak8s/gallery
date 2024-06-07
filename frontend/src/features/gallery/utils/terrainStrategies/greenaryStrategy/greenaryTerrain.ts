import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { MeshBVH } from 'three-mesh-bvh'
import greenaryGlb from '@/assets/glbs/terrains/greenary-draco.glb'
import { toLambert } from '@/libs/three-custom/utils/changeMaterial'
import { disposeObject } from '@/libs/three-custom/utils/disposeObject'

export const TERRAIN_WIDTH = 112

type GreenaryProps = {
  scene: THREE.Scene
  objects: {
    terrain: THREE.Object3D
    lake: THREE.Object3D
    ocean: THREE.Object3D
    edges: THREE.Object3D
    trees: THREE.Object3D
  }
}

export class Greenary {
  scene: THREE.Scene
  objects: {
    terrain: THREE.Object3D
    lake: THREE.Object3D
    ocean: THREE.Object3D
    edges: THREE.Object3D
    trees: THREE.Object3D
  }

  constructor(props: GreenaryProps) {
    if (!props) {
      throw new Error("Cannot be called directly. Uses static 'build' method")
    }

    this.scene = props.scene
    this.objects = props.objects

    // Add all the objects to the scene
    Object.values(this.objects).forEach((object) => {
      object.position.set(55, 0, 55)
      this.scene.add(object)
    })
  }

  dispose = () => {
    Object.values(this.objects).forEach((object) => {
      this.scene.remove(object)
      disposeObject(object)
    })
  }

  // Construct asynchronously
  static async build(scene: THREE.Scene, gltfLoader: GLTFLoader) {
    // Set draco loader
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    gltfLoader.setDRACOLoader(dracoLoader)

    // Load GLTF
    const glb: GLTF = await new Promise((resolve, reject) => {
      gltfLoader.load(greenaryGlb, (glb) => resolve(glb), undefined, reject)
    })

    glb.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        // StandardMaterial -> MeshLambertMaterial
        toLambert(obj) // eslint-disable-line

        // three-mesh-bvh
        obj.geometry.boundsTree = new MeshBVH(obj.geometry) // eslint-disable-line
      }
    })

    // Extract glbs
    const trees = glb.scene.children[4]
    trees.traverse((obj) => {
      obj.castShadow = true
      obj.receiveShadow = true
    })
    const edges = glb.scene.children[3]
    const ocean = glb.scene.children[2]
    const lake = glb.scene.children[1]
    const terrain = glb.scene.children[0]
    terrain.traverse((obj) => {
      obj.receiveShadow = true
    })

    dracoLoader.dispose()

    return new Greenary({ scene, objects: { terrain, lake, ocean, edges, trees } })
  }
}
