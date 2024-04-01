import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { degToRad } from 'three/src/math/MathUtils'
import { acceleratedRaycast } from 'three-mesh-bvh'
import { DUCK_DATA, FOX_DATA, FRAMES_DATA, SHEEP_DATA } from './greenaryData'
import { Greenary } from './greenaryTerrain'
import { IGalleryStrategy, TGalleryStrategyProps } from '..'
import nx from '@/assets/cubemaps/clear_sky/nx.png'
import ny from '@/assets/cubemaps/clear_sky/ny.png'
import nz from '@/assets/cubemaps/clear_sky/nz.png'
import px from '@/assets/cubemaps/clear_sky/px.png'
import py from '@/assets/cubemaps/clear_sky/py.png'
import pz from '@/assets/cubemaps/clear_sky/pz.png'
import { getRandom } from '@/libs/math'
import { IAnimal } from '@/libs/three-custom/items/Animal/Animal'
import { DuckFactory } from '@/libs/three-custom/items/Animal/species/Duck'
import { FoxFactory } from '@/libs/three-custom/items/Animal/species/Fox'
import { SheepFactory } from '@/libs/three-custom/items/Animal/species/Sheep'
import { PostFrames } from '@/libs/three-custom/items/PostFrames'

THREE.Mesh.prototype.raycast = acceleratedRaycast

export default class GreenaryStrategy implements IGalleryStrategy {
  targets: THREE.Object3D[] = []
  obstacles: THREE.Object3D[] = []
  floors: THREE.Object3D[] = []

  // props
  scene: THREE.Scene | null = null

  // interal arrays
  items: ThreeItem[] = []
  lights: THREE.Light[] = []
  animals: Promise<IAnimal>[] = []

  // single-tone
  static instance: GreenaryStrategy | null = null

  constructor() {
    if (GreenaryStrategy.instance) {
      return GreenaryStrategy.instance
    }
    GreenaryStrategy.instance = this
  }

  build(props: TGalleryStrategyProps) {
    // Reset the scene
    this.dispose()

    // Set the scene
    this.scene = props.scene

    // Create Loaders
    const textureLoader = new THREE.TextureLoader(props.loadingManager)
    const cubeTextureLoader = new THREE.CubeTextureLoader(props.loadingManager)
    const gltfLoader = new GLTFLoader(props.loadingManager)

    // Set control orientation
    props.controls.setPosition(27.1, 10, 27.1)
    props.controls.setQuaternion(0, degToRad(40), 0)

    // Set scene background cubemap
    props.scene.background = cubeTextureLoader.load([px, nx, py, ny, pz, nz])

    // terrain
    const greenary = Greenary.build(props.scene, gltfLoader).then((greenary) => {
      this.floors.push(greenary.objects.terrain)
      this.targets.push(greenary.objects.terrain)
      this.targets.push(greenary.objects.trees)
      this.obstacles.push(greenary.objects.edges)
      this.obstacles.push(greenary.objects.trees)

      directLight.target = greenary.objects.terrain

      this.animals.forEach((animal) => {
        animal
          .then((animal) => {
            animal.floors.push(greenary.objects.terrain)
            animal.obstacles.push(greenary.objects.edges)
            animal.obstacles.push(greenary.objects.trees)
          })
          .catch((err) => console.error(err))
      })

      this.items.push(greenary)
      return greenary
    })

    // Ambient light
    const ambientLight = new THREE.AmbientLight('white', 0.8)
    props.scene.add(ambientLight)
    this.lights.push(ambientLight)

    // Directional Light
    const directLight = new THREE.DirectionalLight('white', 1.8)
    directLight.position.set(0, 110, 110)
    directLight.shadow.camera.left = -60
    directLight.shadow.camera.right = 60
    directLight.shadow.camera.top = 60
    directLight.shadow.camera.bottom = -100
    directLight.castShadow = true
    props.scene.add(directLight)
    this.lights.push(directLight)

    // Create Animals
    FOX_DATA.forEach((foxData) => {
      const fox = new FoxFactory().addAnimal({
        scene: props.scene,
        gltfLoader,
        position: { x: foxData.x, y: foxData.y, z: foxData.z },
        rotation: { x: 0, y: degToRad(getRandom(0, 3)), z: 0 },
      })
      this.animals.push(fox)
      fox
        .then((fox) => {
          this.items.push(fox)
        })
        .catch((err) => console.error(err))
    })

    SHEEP_DATA.forEach((sheepData) => {
      const sheep = new SheepFactory().addAnimal({
        scene: props.scene,
        gltfLoader,
        position: { x: sheepData.x, y: sheepData.y, z: sheepData.z },
        rotation: { x: 0, y: degToRad(getRandom(0, 3)), z: 0 },
      })
      this.animals.push(sheep)
      sheep
        .then((sheep) => {
          this.items.push(sheep)
        })
        .catch((err) => console.error(err))
    })

    DUCK_DATA.forEach((duckData) => {
      const duck = new DuckFactory().addAnimal({
        scene: props.scene,
        gltfLoader,
        position: { x: duckData.x, y: duckData.y, z: duckData.z },
        rotation: { x: 0, y: degToRad(getRandom(0, 3)), z: 0 },
      })
      this.animals.push(duck)
      duck
        .then((duck) => {
          this.items.push(duck)
        })
        .catch((err) => console.error(err))
    })

    // Create PostFrames
    const frames = new PostFrames({
      container: props.scene,
      textureLoader,
      postList: props.postList,
      framesData: FRAMES_DATA,
    })
    this.items.push(frames)
    this.targets.push(...frames.meshes)
  }

  update(delta: number) {
    this.items.forEach((item) => {
      item.update && item.update(delta)
    })
  }

  dispose() {
    this.lights.forEach((light) => {
      this.scene && this.scene.remove(light)
      light.dispose()
    })
    this.items.forEach((item) => {
      item.dispose && item.dispose()
    })
  }
}
