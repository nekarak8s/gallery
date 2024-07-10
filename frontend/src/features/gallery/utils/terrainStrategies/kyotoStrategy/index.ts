import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { acceleratedRaycast } from 'three-mesh-bvh'
import { FRAMES_DATA } from './kyotoData'
import { Kyoto } from './kyotoTerrain'
import { IGalleryStrategy, TGalleryStrategyProps } from '..'
import nx from '@/assets/cubemaps/sunset_sky/nx.png'
import ny from '@/assets/cubemaps/sunset_sky/ny.png'
import nz from '@/assets/cubemaps/sunset_sky/nz.png'
import px from '@/assets/cubemaps/sunset_sky/px.png'
import py from '@/assets/cubemaps/sunset_sky/py.png'
import pz from '@/assets/cubemaps/sunset_sky/pz.png'
import { DefaultCamera } from '@/libs/three-custom/cameras/DefaultCamera'
import { IControls } from '@/libs/three-custom/controls'
import KeypadControls from '@/libs/three-custom/controls/KeypadControls'
import OceanFactory from '@/libs/three-custom/items/Ocean'
import PostFramesFactory from '@/libs/three-custom/items/PostFrames'
import { disposeObject } from '@/libs/three-custom/utils/disposeObject'

THREE.Mesh.prototype.raycast = acceleratedRaycast

export default class KyotoStrategy implements IGalleryStrategy {
  targets: THREE.Object3D[] = []
  obstacles: THREE.Object3D[] = []
  floors: THREE.Object3D[] = []

  // props
  scene: THREE.Scene | null = null
  controls: IControls | null = null
  camera: DefaultCamera | null = null

  // interal arrays
  items: ThreeItem[] = []
  lights: THREE.Light[] = []

  // single-tone
  static instance: KyotoStrategy | null = null

  constructor() {
    if (KyotoStrategy.instance) {
      return KyotoStrategy.instance
    }
    KyotoStrategy.instance = this
  }

  async build(props: TGalleryStrategyProps) {
    // Reset the scene
    this.dispose()

    // Set the scene
    this.scene = props.scene
    this.controls = props.controls
    this.camera = props.camera

    // Set the camrea fov
    this.camera.fov = 40
    this.camera.updateMatrix()

    // Create Loaders
    const textureLoader = new THREE.TextureLoader(props.loadingManager)
    const cubeTextureLoader = new THREE.CubeTextureLoader(props.loadingManager)
    const gltfLoader = new GLTFLoader(props.loadingManager)

    // Enhance the controls raycaster's precision
    if (props.controls instanceof KeypadControls) {
      props.controls.numRaycasters = 4
    }

    // Set controls orientation
    props.controls.setPosition(34.44, 15, 27.61)
    props.controls.setQuaternion(0, 0.94, 0)

    // Set scene background cubemap
    props.scene.background = cubeTextureLoader.load([px, nx, py, ny, pz, nz])

    // terrain
    const kyoto = await Kyoto.build(props.scene, gltfLoader)
    this.floors.push(kyoto.objects.terrain)
    this.targets.push(kyoto.objects.terrain)
    this.obstacles.push(kyoto.objects.terrain)
    this.items.push(kyoto)

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x6d00da, 0.4)
    props.scene.add(ambientLight)
    this.lights.push(ambientLight)

    const ambientLight2 = new THREE.AmbientLight(0xffec3d, 0.6)
    props.scene.add(ambientLight2)
    this.lights.push(ambientLight2)

    // Directional Light
    const directLight = new THREE.DirectionalLight(0xda9000, 2.2)
    directLight.position.set(-50, 30, 20)
    directLight.shadow.bias = -0.0001
    directLight.castShadow = true
    directLight.target = kyoto.objects.terrain
    props.scene.add(directLight)
    this.lights.push(directLight)

    // Create ocean
    const ocean = new OceanFactory().addItem({
      container: props.scene,
      color: 0xaa1212,
      width: 1000,
      depth: 1000,
      y: 2,
      textureLoader: textureLoader,
    })
    this.items.push(ocean)
    this.floors.push(ocean.object)

    // Create PostFrames
    const frames = new PostFramesFactory().addItem({
      container: props.scene,
      textureLoader: textureLoader,
      postList: props.postList,
      framesData: FRAMES_DATA,
      isAnimation: false,
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
    this.camera && this.camera.resetFov()
    this.controls instanceof KeypadControls && this.controls.resetNumRaycasters()
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
  }
}

// Find frame position
// let idx = 0
// const gui = new GUI()
// frames.objects.forEach((frame) => {
//   idx++
//   // gui to move frame position
//   const params = {
//     x: frame.position.x,
//     y: frame.position.y,
//     z: frame.position.z,
//   }
//   const folder = gui.addFolder(`Frame ${idx}`)
//   folder.add(params, 'x', -100, 100, 0.05).onChange((value) => {
//     frame.position.x = value
//   })
//   folder.add(params, 'y', -100, 100, 0.05).onChange((value) => {
//     frame.position.y = value
//   })
//   folder.add(params, 'z', -100, 100, 0.05).onChange((value) => {
//     frame.position.z = value
//   })
//   folder.add(params, 'y', -3, 3, 0.05).onChange((value) => {
//     frame.rotation.y = value
//   })
// })
