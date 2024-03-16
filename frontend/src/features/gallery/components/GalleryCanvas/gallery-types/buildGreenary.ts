import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { degToRad } from 'three/src/math/MathUtils'
import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh'
import { DUCK_DATA, FOX_DATA, FRAMES_DATA, SHEEP_DATA } from './greenaryData'
import nx from '@/assets/cubemaps/clear_sky/nx.png'
import ny from '@/assets/cubemaps/clear_sky/ny.png'
import nz from '@/assets/cubemaps/clear_sky/nz.png'
import px from '@/assets/cubemaps/clear_sky/px.png'
import py from '@/assets/cubemaps/clear_sky/py.png'
import pz from '@/assets/cubemaps/clear_sky/pz.png'
import greenaryGlb from '@/assets/glbs/greenary-set-done.glb'
import { GalleryTypeProps } from '@/features/gallery/types'
import { getRandom } from '@/libs/math'
import Animal from '@/libs/three-custom/items/Animal'
import { Duck } from '@/libs/three-custom/items/Animal/species/Duck'
import { Fox } from '@/libs/three-custom/items/Animal/species/Fox'
import { Sheep } from '@/libs/three-custom/items/Animal/species/Sheep'
import { PostFrames } from '@/libs/three-custom/items/PostFrames'

THREE.Mesh.prototype.raycast = acceleratedRaycast

const buildGreenary = (props: GalleryTypeProps) => {
  // Create Loaders
  const textureLoader = new THREE.TextureLoader(props.loadingManager)
  const cubeTextureLoader = new THREE.CubeTextureLoader(props.loadingManager)
  const gltfLoader = new GLTFLoader(props.loadingManager)

  // Set scene background cubemap
  props.scene.background = cubeTextureLoader.load([px, nx, py, ny, pz, nz])

  /**
   * Light
   */
  const lights: THREE.Light[] = []

  // Ambient light
  const ambientLight = new THREE.AmbientLight('white', 0.8)
  props.scene.add(ambientLight)
  lights.push(ambientLight)

  // Direct Light
  const directLight = new THREE.DirectionalLight('white', 1.8)
  directLight.position.set(0, 110, 110)
  directLight.shadow.camera.left = -60
  directLight.shadow.camera.right = 60
  directLight.shadow.camera.top = 60
  directLight.shadow.camera.bottom = -100
  directLight.castShadow = true
  props.scene.add(directLight)
  lights.push(directLight)

  // Light Helper : Development
  if (process.env.NODE_ENV !== 'production') {
    import('three').then(({ CameraHelper }) => {
      props.scene.add(new CameraHelper(directLight.shadow.camera))
    })
  }

  /**
   * Meshes
   */
  const items: ThreeItem[] = []
  const animals: Promise<Animal>[] = []

  // fox
  FOX_DATA.forEach((foxData) => {
    const fox = Fox.build(gltfLoader).then((fox) => {
      const animal = new Animal({
        species: fox,
        container: props.scene,
        x: foxData.x,
        y: foxData.y,
        z: foxData.z,
        rotationY: getRandom(0, 3),
      })
      items.push(animal)
      return animal
    })
    animals.push(fox)
  })

  SHEEP_DATA.forEach((sheepData) => {
    const sheep = Sheep.build(gltfLoader).then((sheep) => {
      const animal = new Animal({
        species: sheep,
        container: props.scene,
        x: sheepData.x,
        y: sheepData.y,
        z: sheepData.z,
        rotationY: getRandom(0, 3),
      })
      items.push(animal)
      return animal
    })
    animals.push(sheep)
  })

  DUCK_DATA.forEach((duckData) => {
    const duck = Duck.build(gltfLoader).then((duck) => {
      const animal = new Animal({
        species: duck,
        container: props.scene,
        x: duckData.x,
        y: duckData.y,
        z: duckData.z,
        rotationY: getRandom(0, 3),
      })
      items.push(animal)
      return animal
    })
    animals.push(duck)
  })

  // Greeneary floor
  const greenary = Greenary.build(props.scene, gltfLoader).then((greenary) => {
    props.controls.floors.push(greenary.terrain)
    props.controls.obstacles.push(greenary.edges)
    props.controls.obstacles.push(greenary.trees)

    props.rayControls.rayItems.push(greenary.terrain)
    props.rayControls.rayItems.push(greenary.trees)

    // Set camera position & rotation by controls
    props.controls.setPosition(25.1, 5, 25.1)
    props.controls.setQuaternion(0, degToRad(-135), 0)

    directLight.target = greenary.terrain

    animals.forEach((animal) => {
      animal.then((ani) => ani.floors.push(greenary.terrain))
      animal.then((ani) => ani.obstacles.push(greenary.edges))
      animal.then((ani) => ani.obstacles.push(greenary.trees))
    })

    items.push(greenary)
    return greenary
  })

  // Create Trees
  // const trees = new Trees({
  //   container: props.scene,
  //   gltfLoader,
  //   treesData: TREE_DATA,
  //   onLoad: (tree: THREE.Object3D) => {
  //     props.rayControls.rayItems.push(tree)
  //     props.controls.obstacles.push(tree)

  //     animals.forEach((animal) => {
  //       animal.then((ani) => ani.obstacles.push(tree))
  //     })
  //   },
  // })
  // items.push(trees)

  // Create PostFrames
  const frames = new PostFrames({
    container: props.scene,
    textureLoader,
    postList: props.postList,
    framesData: FRAMES_DATA,
  })
  items.push(frames)
  frames.meshes.forEach((mesh) => {
    props.rayControls.rayItems.push(mesh)
  })

  /**
   * Update function: Render canvas
   */
  const update = function renderCanvas(delta: number) {
    items.forEach((object) => {
      object.update && object.update(delta)
    })
  }

  /**
   * Dispose function: Release all the resources
   */
  const dispose = function () {
    lights.forEach((light) => {
      props.scene.remove(light)
      light.dispose()
    })
    items.forEach((object) => {
      object.dispose && object.dispose()
    })
  }

  return { update, dispose }
}

export default buildGreenary

type GreenaryProps = {
  container: THREE.Mesh | THREE.Scene
  terrain: THREE.Object3D
  lake: THREE.Object3D
  ocean: THREE.Object3D
  edges: THREE.Object3D
  trees: THREE.Object3D
}

export class Greenary {
  type: string = 'greenary'
  terrain: THREE.Object3D
  lake: THREE.Object3D
  ocean: THREE.Object3D
  trees: THREE.Object3D
  edges: THREE.Object3D
  dispose: () => void

  constructor(props: GreenaryProps) {
    if (!props) {
      throw new Error("Cannot be called directly. Uses static 'build' method")
    }

    this.terrain = props.terrain
    this.terrain.position.set(55, 0, 55)
    props.container.add(this.terrain)

    this.lake = props.lake
    this.lake.position.set(55, 0, 55)
    props.container.add(this.lake)

    this.ocean = props.ocean
    this.ocean.position.set(55, 0, 55)
    props.container.add(this.ocean)

    this.edges = props.edges
    this.edges.position.set(55, 0, 55)
    props.container.add(this.edges)

    this.trees = props.trees
    this.trees.position.set(55, 0, 55)
    props.container.add(this.trees)

    this.dispose = () => {
      props.container.remove(this.terrain)
      props.container.remove(this.lake)
      props.container.remove(this.ocean)
      props.container.remove(this.edges)
      props.container.remove(this.trees)
    }
  }

  // Construct asynchronously
  static async build(container: THREE.Mesh | THREE.Scene, gltfLoader: GLTFLoader) {
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
    if (terrain instanceof THREE.Mesh) {
      terrain.geometry.boundsTree = new MeshBVH(terrain.geometry) // eslint-disable-line
    }
    terrain.receiveShadow = true

    return new Greenary({ container, terrain, lake, ocean, edges, trees })
  }
}
