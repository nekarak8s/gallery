import { Body, Cylinder, Vec3, World } from 'cannon-es'
import { Box3, Vector3, Object3D } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { degToRad } from 'three/src/math/MathUtils'
import spotLightGlb from '@/assets/glbs/trees.glb'

type TreesData = {
  type: number
  x: number
  y: number
  z: number
  scale: number
}

export type TreesProps = {
  container: THREE.Mesh | THREE.Scene
  world: World
  gltfLoader: GLTFLoader
  treesData: TreesData[]
}

export class Trees {
  type: string = 'tree'
  meshes: THREE.Object3D[] = []
  cannonBodies: Body[] = []
  dispose: () => void

  constructor(info: TreesProps) {
    /**
     * Load GLTF
     */
    info.gltfLoader.load(spotLightGlb, (glb) => {
      // Create Trees
      info.treesData.forEach((tree) => {
        // Get an object
        const object = new Object3D()
        object.copy(glb.scene.children[tree.type])
        object.name = this.type
        object.scale.multiplyScalar(0.01 * tree.scale)
        object.children[0].castShadow = true
        object.children[0].receiveShadow = true

        // Add to the mesh array
        this.meshes.push(object)

        // Set the mesh size
        const box = new Box3().setFromObject(object)
        const { x: width, y: height, z: depth } = box.getSize(new Vector3())

        // Set position
        object.position.set(tree.x, tree.y, tree.z)
        object.rotation.set(degToRad(-90), 0, 0)

        // Add to the container
        info.container.add(object)

        // create shape
        const shape = new Cylinder(width / 6, width / 6, height)

        // create cannon body
        const cannonBody = new Body({
          mass: 0,
          position: new Vec3(tree.x, tree.y + height / 2, tree.z),
          shape,
        })

        // Add to the mesh array
        this.cannonBodies.push(cannonBody)

        // add to the world
        info.world.addBody(cannonBody)
      })
    })

    // Set the dispose function
    this.dispose = () => {
      this.cannonBodies.forEach((cannonBody) => {
        info.world.removeBody(cannonBody)
      })
      this.meshes.forEach((glb) => {
        info.container.remove(glb)
      })
    }
  }
}
