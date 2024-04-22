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
import { DuckFactory, SheepFactory } from '@/libs/three-custom/items/Animal'
import { IAnimal } from '@/libs/three-custom/items/Animal/Animal'
import { FoxFactory } from '@/libs/three-custom/items/Animal/species/Fox'
import PostFramesFactory from '@/libs/three-custom/items/PostFrames'
import { disposeObject } from '@/libs/three-custom/utils/disposeObject'

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
  animals: IAnimal[] = []

  // single-tone
  static instance: GreenaryStrategy | null = null

  constructor() {
    if (GreenaryStrategy.instance) {
      return GreenaryStrategy.instance
    }
    GreenaryStrategy.instance = this
  }

  async build(props: TGalleryStrategyProps) {
    // Reset the scene
    this.dispose()

    // Set the scene
    this.scene = props.scene

    // Create Loaders
    const textureLoader = new THREE.TextureLoader(props.loadingManager)
    const cubeTextureLoader = new THREE.CubeTextureLoader(props.loadingManager)
    const gltfLoader = new GLTFLoader(props.loadingManager)

    // Set control orientation
    props.controls.setPosition(29.1, 10, 29.1)
    props.controls.setQuaternion(0, degToRad(40), 0)

    // Set scene background cubemap
    props.scene.background = cubeTextureLoader.load([px, nx, py, ny, pz, nz])

    // Create Animals
    const fox = await new FoxFactory().addAnimal({
      scene: props.scene,
      gltfLoader,
      position: { x: FOX_DATA.x, y: FOX_DATA.y, z: FOX_DATA.z },
      rotation: { x: 0, y: degToRad(getRandom(0, 3)), z: 0 },
    })
    this.animals.push(fox)
    this.items.push(fox)

    const sheep = await new SheepFactory().addAnimal({
      scene: props.scene,
      gltfLoader,
      position: { x: SHEEP_DATA.x, y: SHEEP_DATA.y, z: SHEEP_DATA.z },
      rotation: { x: 0, y: degToRad(getRandom(0, 3)), z: 0 },
    })
    this.animals.push(sheep)
    this.items.push(sheep)

    const duck = await new DuckFactory().addAnimal({
      scene: props.scene,
      gltfLoader,
      position: { x: DUCK_DATA.x, y: DUCK_DATA.y, z: DUCK_DATA.z },
      rotation: { x: 0, y: degToRad(getRandom(0, 3)), z: 0 },
    })
    this.animals.push(duck)
    this.items.push(duck)

    // terrain
    const greenary = await Greenary.build(props.scene, gltfLoader)
    this.floors.push(greenary.objects.terrain)
    this.targets.push(greenary.objects.terrain)
    this.targets.push(greenary.objects.trees)
    this.obstacles.push(greenary.objects.edges)
    this.obstacles.push(greenary.objects.trees)
    this.animals.forEach((animal) => {
      animal.floors.push(greenary.objects.terrain)
      animal.obstacles.push(greenary.objects.edges)
      animal.obstacles.push(greenary.objects.trees)
    })
    this.items.push(greenary)

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
    directLight.target = greenary.objects.terrain
    props.scene.add(directLight)
    this.lights.push(directLight)

    // Create PostFrames
    const frames = new PostFramesFactory().addItem({
      container: props.scene,
      textureLoader: textureLoader,
      postList: props.postList,
      framesData: FRAMES_DATA,
      isAnimation: true,
    })
    this.items.push(frames)
    this.targets.push(...frames.objects)
  }

  update(delta: number) {
    this.items.forEach((item) => {
      item.update && item.update(delta)
    })
  }

  dispose() {
    this.lights.forEach((light) => {
      this.scene && this.scene.remove(light)
      disposeObject(light)
    })
    this.items.forEach((item) => {
      item.dispose && item.dispose()
    })
    this.targets = []
    this.obstacles = []
    this.floors = []
    this.items = []
    this.lights = []
    this.animals = []
  }
}
