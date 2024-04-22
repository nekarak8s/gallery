import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { MeshBVH } from 'three-mesh-bvh'
import kyogoGlb from '@/assets/glbs/terrains/kyoto-meshopt.glb'
import { MeshoptDecoder } from '@/libs/three-custom/decoder/MeshoptDecoder'
import { toLambert } from '@/libs/three-custom/utils/changeMaterial'
import { disposeObject } from '@/libs/three-custom/utils/disposeObject'

type KyotoProps = {
  scene: THREE.Scene
  objects: {
    terrain: THREE.Object3D
  }
}

export class Kyoto {
  scene: THREE.Scene
  objects: {
    terrain: THREE.Object3D
  }

  constructor(props: KyotoProps) {
    if (!props) {
      throw new Error("Cannot be called directly. Uses static 'build' method")
    }

    this.scene = props.scene
    this.objects = props.objects

    // Add all the objects to the scene
    Object.values(this.objects).forEach((object) => {
      object.position.set(-60, -50, -60)
      this.scene.add(object)
    })
  }

  dispose() {
    Object.values(this.objects).forEach((object) => {
      this.scene.remove(object)
      disposeObject(object)
    })
  }

  // Construct asynchronously
  static async build(scene: THREE.Scene, gltfLoader: GLTFLoader) {
    // Set meshopt decoder
    gltfLoader.setMeshoptDecoder(MeshoptDecoder)

    // Load GLTF
    const glb: GLTF = await new Promise((resolve, reject) => {
      gltfLoader.load(kyogoGlb, (glb) => resolve(glb), undefined, reject)
    })

    // Extract mesh
    const terrain = glb.scene.children[0]
    terrain.scale.multiplyScalar(4)
    terrain.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        toLambert(obj) // eslint-disable-line
        obj.castShadow = true
        obj.receiveShadow = true

        // three-mesh-bvh
        obj.geometry.boundsTree = new MeshBVH(obj.geometry) // eslint-disable-line
      }
    })

    return new Kyoto({
      scene,
      objects: { terrain },
    })
  }
}
