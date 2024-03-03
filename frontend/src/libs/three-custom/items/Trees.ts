import { Body, Cylinder, Vec3, World } from 'cannon-es'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { degToRad } from 'three/src/math/MathUtils'
import treesGlb from '@/assets/glbs/trees.glb'

type TreeData = {
  type: number
  x: number
  y: number
  z: number
  rotation?: number
  scale?: number
}

export type TreesProps = {
  container: THREE.Mesh | THREE.Scene
  world?: World | undefined
  gltfLoader: GLTFLoader
  treesData: TreeData[]
  onLoad?: (tree: THREE.Object3D) => void
}

export class Trees {
  type: string = 'trees'
  objects: THREE.Object3D[] = []
  cannonBodies: Body[] = []
  dispose: () => void

  constructor(info: TreesProps) {
    /**
     * Load GLTF
     */
    info.gltfLoader.load(treesGlb, (glb) => {
      // Create Trees
      info.treesData.forEach((tree) => {
        // Get an object
        const object = new THREE.Object3D()
        object.copy(glb.scene.children[tree.type])
        object.name = this.type

        object.children[0].castShadow = true
        object.children[0].receiveShadow = true

        object.scale.multiplyScalar(0.01 * (tree.scale || 1))
        object.position.set(tree.x, tree.y, tree.z)
        object.rotation.set(degToRad(-90), 0, tree.rotation || 0)

        this.objects.push(object)
        info.container.add(object)

        info.onLoad && info.onLoad(object)

        // Create cannon body
        if (info.world) {
          const box = new THREE.Box3().setFromObject(object)
          const { x: width, y: height, z: depth } = box.getSize(new THREE.Vector3())

          const cannonBody = new Body({
            mass: 0,
            position: new Vec3(tree.x, tree.y + height / 2, tree.z),
            shape: new Cylinder(width / 6, width / 6, height),
          })

          this.cannonBodies.push(cannonBody)

          info.world.addBody(cannonBody)
        }
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
