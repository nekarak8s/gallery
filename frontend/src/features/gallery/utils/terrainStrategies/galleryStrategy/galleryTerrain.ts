import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { MeshBVH } from 'three-mesh-bvh'
import galleryGlb from '@/assets/glbs/terrains/gallery.glb'
import { toLambert } from '@/libs/three-custom/utils/changeMaterial'
import { disposeObject } from '@/libs/three-custom/utils/disposeResources'

export const TERRAIN_WIDTH = 70

type GalleryProps = {
  scene: THREE.Scene
  objects: {
    floor: THREE.Object3D
    walls: THREE.Object3D
    glassWall: THREE.Object3D
    glassFloor: THREE.Object3D
    edges: THREE.Object3D
  }
}

export class Gallery {
  scene: THREE.Scene
  objects: {
    floor: THREE.Object3D
    walls: THREE.Object3D
    glassWall: THREE.Object3D
    glassFloor: THREE.Object3D
    edges: THREE.Object3D
  }

  constructor(props: GalleryProps) {
    if (!props) {
      throw new Error("Cannot be called directly. Uses static 'build' method")
    }

    this.scene = props.scene
    this.objects = props.objects

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
      gltfLoader.load(galleryGlb, (glb) => resolve(glb), undefined, reject)
    })

    glb.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        toLambert(obj) // eslint-disable-line
        obj.geometry.boundsTree = new MeshBVH(obj.geometry) // eslint-disable-line
      }
    })

    // Extract glbs
    const floor = glb.scene.children[4]
    floor.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        // obj.castShadow = true
        obj.receiveShadow = true
      }
    })
    const edges = glb.scene.children[3]
    const glassWall = glb.scene.children[2]
    const glassFloor = glb.scene.children[1]
    const walls = glb.scene.children[0]
    walls.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true
        obj.receiveShadow = true
      }
    })

    return new Gallery({ scene, objects: { floor, edges, glassWall, glassFloor, walls } })
  }
}
