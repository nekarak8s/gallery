import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { degToRad } from 'three/src/math/MathUtils'
import { acceleratedRaycast } from 'three-mesh-bvh'
import { CEILING_DATA, EDGES_DATA, FLOORS_DATA, FRAMES_DATA, GLASS_FLOORS_DATA, GLASS_WALL, WALLS_DATA } from './galleryData'
import { IGalleryStrategy, TGalleryStrategyProps } from '..'
import wallBaseImg from '@/assets/textures/concrete/Concrete_019_BaseColor.jpg'
import floorBaseImg from '@/assets/textures/granite/Granite_001_COLOR.jpg'
import { getSunColor, getSunIntensity, getSunPosition } from '@/libs/sun'
import CeilingsFactory from '@/libs/three-custom/items/Ceilings'
import EdgesFactory from '@/libs/three-custom/items/Edges'
import FloorsFactory from '@/libs/three-custom/items/Floors'
import OceanFactory, { OceanItem } from '@/libs/three-custom/items/Ocean'
import PostFramesFactory, { PostFrames } from '@/libs/three-custom/items/PostFrames'
import SkyFactory, { SkyItem } from '@/libs/three-custom/items/Sky'
import WallsFactory from '@/libs/three-custom/items/Walls'
import { disposeObject } from '@/libs/three-custom/utils/disposeObject'

THREE.Mesh.prototype.raycast = acceleratedRaycast

export default class GalleryStrategy implements IGalleryStrategy {
  targets: THREE.Object3D[] = []
  obstacles: THREE.Object3D[] = []
  floors: THREE.Object3D[] = []

  // props
  scene: THREE.Scene | null = null

  // interal arrays
  items: ThreeItem[] = []
  lights: THREE.Light[] = []
  lightInterval: NodeJS.Timeout | null = null

  // single-tone
  static instance: GalleryStrategy | null = null

  constructor() {
    if (GalleryStrategy.instance) {
      return GalleryStrategy.instance
    }
    GalleryStrategy.instance = this
  }

  build(props: TGalleryStrategyProps) {
    // Reset the scene
    this.dispose()

    // Set the scene
    this.scene = props.scene

    // Create Loaders
    const gltfLoader = new GLTFLoader(props.loadingManager)
    const textureLoader = new THREE.TextureLoader(props.loadingManager)

    // Set control orientation
    props.controls.setPosition(35, 12, 62)
    props.controls.setQuaternion(0, degToRad(180), 0)

    /**
     * Meshes
     */

    // Create sky
    const sky = new SkyFactory().addItem({
      container: props.scene,
      size: 2000,
    }) as SkyItem
    this.items.push(sky)

    // Create ocean
    const ocean = new OceanFactory().addItem({
      container: props.scene,
      textureLoader,
      width: 1000,
      depth: 1000,
      distortionScale: 1,
    }) as OceanItem
    this.items.push(ocean)

    // Create Floors
    const floors = new FloorsFactory().addItem({
      color: 0x686868,
      container: props.scene,
      floorsData: FLOORS_DATA,
      textureLoader,
      floorBaseImg,
      texture: {
        textureLoader,
        baseImg: floorBaseImg,
        repeatX: FLOORS_DATA[0].width / 3,
        repeatY: FLOORS_DATA[0].depth / 3,
      },
    })
    this.items.push(floors)
    this.floors.push(floors.object)

    const glassFloors = new FloorsFactory().addItem({
      container: props.scene,
      color: 0xffffff,
      floorsData: GLASS_FLOORS_DATA,
      transparent: true,
      opacity: 0.4,
    })
    this.items.push(glassFloors)
    this.floors.push(glassFloors.object)

    // Create ceiling
    const ceiling = new CeilingsFactory().addItem({
      container: props.scene,
      color: 0xffffff,
      ceilingsData: CEILING_DATA,
      texture: {
        textureLoader,
        baseImg: wallBaseImg,
        // normalImg: wallNormImg,
        repeatX: CEILING_DATA[0].width / 10,
        repeatY: CEILING_DATA[0].depth / 10,
      },
    })
    this.items.push(ceiling)

    // Create walls
    const walls = new WallsFactory().addItem({
      container: props.scene,
      wallsData: WALLS_DATA,
      repeatX: 10 / 10,
      repeatY: 8 / 10,
      texture: {
        textureLoader,
        baseImg: wallBaseImg,
        // normalImg: wallNormImg,
      },
    })
    this.items.push(walls)
    this.targets.push(walls.object)
    this.obstacles.push(walls.object)

    const glassWall = new WallsFactory().addItem({
      container: props.scene,
      color: 0xffffff,
      wallsData: GLASS_WALL,
      transparent: true,
      opacity: 0.2,
    })
    this.items.push(glassWall)
    this.targets.push(glassWall.object)
    this.obstacles.push(glassWall.object)

    // Create edges
    const edges = new EdgesFactory().addItem({
      container: props.scene,
      edgesData: EDGES_DATA,
    })
    this.items.push(edges)
    this.obstacles.push(edges.object)

    // Create Mango Tree
    // const mangoTree = await new MangoTreeFactory().addItem({
    //   gltfLoader,
    //   container: props.scene,
    //   x: 29,
    //   y: 2,
    //   z: 18,
    //   scale: 2,
    // })
    // this.items.push(mangoTree)
    // this.obstacles.push(mangoTree.object)
    // console.log('glb', mangoTree.object)

    /**
     * Lights
     */

    // Sun information
    const date = new Date()
    const sunLightIntensity = getSunIntensity(date)
    const sunLightColor = new THREE.Color(getSunColor(date))

    // Create sun
    const sun = new THREE.Vector3()

    // Get sun position
    const { elevation, azimuth } = getSunPosition(date)
    const phi = THREE.MathUtils.degToRad(90 - elevation)
    const phiEle = THREE.MathUtils.degToRad(elevation * 3)
    const theta = THREE.MathUtils.degToRad(azimuth - 25)

    // Set on the sky & ocean
    sun.setFromSphericalCoords(1, phi, theta)
    sky.setSunPosition(sun)
    ocean.setSunDirection(sun)

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, sunLightIntensity * 0.8)
    this.scene.add(ambientLight)
    this.lights.push(ambientLight)

    // Direct Light
    const directLight = new THREE.DirectionalLight(sunLightColor, sunLightIntensity * 1.8)
    directLight.position.set(Math.sin(theta) * 100, Math.sin(phiEle) * 500, Math.cos(theta) * 100)
    directLight.shadow.camera.left = -60
    directLight.shadow.camera.right = 60
    directLight.shadow.camera.top = 60
    directLight.shadow.camera.bottom = -100
    directLight.castShadow = true
    this.scene.add(directLight)
    this.lights.push(directLight)

    const lightInterval = setInterval(() => {
      const date = new Date()

      // Update sun position
      const { elevation, azimuth } = getSunPosition(date)

      const phi = THREE.MathUtils.degToRad(90 - elevation)
      const phiEle = THREE.MathUtils.degToRad(elevation * 3)
      const theta = THREE.MathUtils.degToRad(azimuth - 25)

      sun.setFromSphericalCoords(1, phi, theta)
      sky.setSunPosition(sun)
      ocean.setSunDirection(sun)

      const sunLightIntensity = getSunIntensity(date)
      const sunLightColor = new THREE.Color(getSunColor(date))

      ambientLight.intensity = sunLightIntensity * 0.8

      directLight.color = sunLightColor
      directLight.intensity = sunLightIntensity * 1.8
      directLight.position.set(Math.sin(theta) * 100, Math.sin(phiEle) * 500, Math.cos(theta) * 100)

      // update light of frame
      this.items.forEach((item) => {
        if (item instanceof PostFrames) {
          item.lights.forEach((light) => {
            light.intensity = 3 * (1 - sunLightIntensity) + 5
          })
        }
      })
    }, 60 * 1000)
    this.lightInterval = lightInterval

    // Create PostFrames
    const frames = new PostFramesFactory().addItem({
      container: props.scene,
      textureLoader: textureLoader,
      postList: props.postList,
      framesData: FRAMES_DATA,
      spotLight: {
        intensity: 3 * (1 - sunLightIntensity) + 5,
      },
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
    this.lightInterval && clearInterval(this.lightInterval)
    this.lights.forEach((light) => {
      this.scene && this.scene.remove(light)
      disposeObject(light)
    })
    this.items.forEach((item) => {
      item.dispose && item.dispose()
    })
    this.lightInterval = null
    this.targets = []
    this.obstacles = []
    this.floors = []
    this.items = []
    this.lights = []
  }
}
