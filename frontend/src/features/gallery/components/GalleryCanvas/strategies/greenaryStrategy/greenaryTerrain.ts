import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { MeshBVH } from 'three-mesh-bvh'
import greenaryGlb from '@/assets/glbs/greenary-set-done.glb'
import { disposeObject } from '@/libs/three-custom/utils/disposeObject'

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

    // Set the position of the objects
    this.objects.terrain.position.set(55, 0, 55)
    this.objects.lake.position.set(55, 0, 55)
    this.objects.ocean.position.set(55, 0, 55)
    this.objects.edges.position.set(55, 0, 55)
    this.objects.trees.position.set(55, 0, 55)

    // Add all the objects to the scene
    Object.values(this.objects).forEach((object) => {
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
    // Load GLTF
    const glb: GLTF = await new Promise((resolve, reject) => {
      gltfLoader.load(greenaryGlb, (glb) => resolve(glb), undefined, reject)
    })

    // Extract glbs
    const trees = glb.scene.children[4]
    trees.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true
        obj.receiveShadow = true
        obj.geometry.boundsTree = new MeshBVH(obj.geometry) // eslint-disable-line
      }
    })
    const edges = glb.scene.children[3]
    const ocean = glb.scene.children[2]
    const lake = glb.scene.children[1]
    const terrain = glb.scene.children[0]
    terrain.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.boundsTree = new MeshBVH(obj.geometry) // eslint-disable-line
        obj.receiveShadow = true
      }
    })

    return new Greenary({ scene, objects: { terrain, lake, ocean, edges, trees } })
  }
}
