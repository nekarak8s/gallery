import * as THREE from 'three'
import { degToRad } from 'three/src/math/MathUtils'
import { acceleratedRaycast } from 'three-mesh-bvh'
import { CEILING_DATA, EDGES_DATA, FLOORS_DATA, FRAMES_DATA, GLASS_FLOORS_DATA, GLASS_WALL, WALLS_DATA } from './galleryData'
import { IGalleryStrategy, TGalleryStrategyProps } from '..'
import wallBaseImg from '@/assets/textures/concrete/Concrete_019_BaseColor.jpg'
import floorBaseImg from '@/assets/textures/granite/Granite_001_COLOR.jpg'
import { getSunColor, getSunIntensity, getSunPosition } from '@/libs/sun'
import { Ceiling } from '@/libs/three-custom/items/Ceiling'
import { Edges } from '@/libs/three-custom/items/Edges'
import { Floor } from '@/libs/three-custom/items/Floor'
import { PostFrames } from '@/libs/three-custom/items/PostFrames'
import { SkyItem } from '@/libs/three-custom/items/Sky'
import { Wall } from '@/libs/three-custom/items/Wall'
import { Walls } from '@/libs/three-custom/items/Walls'
import { WaterItem } from '@/libs/three-custom/items/Water'

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
  water: WaterItem | null = null
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
    const textureLoader = new THREE.TextureLoader(props.loadingManager)

    // Set control orientation
    props.controls.setPosition(35, 12, 62)
    props.controls.setQuaternion(0, degToRad(180), 0)

    /**
     * Meshes
     */

    // Create sky
    const sky = new SkyItem({
      scene: props.scene,
      size: 2000,
    })
    this.items.push(sky)

    // Create water
    const water = new WaterItem({
      container: props.scene,
      textureLoader,
      width: 1000,
      depth: 1000,
      distortionScale: 3,
    })
    this.items.push(water)
    this.water = water

    // Create Floors
    FLOORS_DATA.forEach((floorData) => {
      const floor = new Floor({
        container: props.scene,
        color: 0x686868,
        x: floorData.x,
        y: floorData.y,
        z: floorData.z,
        width: floorData.width,
        height: floorData.height,
        depth: floorData.depth,
        texture: {
          textureLoader,
          baseImg: floorBaseImg,
          // normalImg: floorNormImg,
          repeatX: floorData.width / 3,
          repeatY: floorData.depth / 3,
        },
      })
      this.items.push(floor)
      this.floors.push(floor.mesh)
    })

    GLASS_FLOORS_DATA.forEach((glassFloorData) => {
      const glassFloor = new Floor({
        container: props.scene,
        color: 0xffffff,
        x: glassFloorData.x,
        y: glassFloorData.y,
        z: glassFloorData.z,
        width: glassFloorData.width,
        height: glassFloorData.height,
        depth: glassFloorData.depth,
        transparent: true,
        opacity: 0.4,
      })
      this.items.push(glassFloor)
      this.floors.push(glassFloor.mesh)
    })

    // Create ceiling
    const ceiling = new Ceiling({
      container: props.scene,
      color: 0xffffff,
      x: CEILING_DATA.x,
      y: CEILING_DATA.y,
      z: CEILING_DATA.z,
      width: CEILING_DATA.width,
      height: CEILING_DATA.height,
      depth: CEILING_DATA.depth,
      texture: {
        textureLoader,
        baseImg: wallBaseImg,
        // normalImg: wallNormImg,
        repeatX: CEILING_DATA.width / 10,
        repeatY: CEILING_DATA.depth / 10,
      },
    })
    this.items.push(ceiling)

    // Create walls
    const walls = new Walls({
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
    this.targets.push(walls.mesh)
    this.obstacles.push(walls.mesh)

    const glassWall = new Wall({
      container: props.scene,
      color: 0xffffff,
      x: GLASS_WALL.x,
      y: GLASS_WALL.y,
      z: GLASS_WALL.z,
      width: GLASS_WALL.width,
      height: GLASS_WALL.height,
      depth: GLASS_WALL.depth,
      rotationY: GLASS_WALL.rotationY,
      transparent: true,
      opacity: 0.2,
    })
    this.items.push(glassWall)
    this.targets.push(glassWall.mesh)
    this.obstacles.push(glassWall.mesh)

    // Create edges
    const edges = new Edges({
      container: props.scene,
      edgesData: EDGES_DATA,
    })
    this.items.push(edges)
    this.obstacles.push(edges.mesh)

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

    // Set on the sky & water
    sun.setFromSphericalCoords(1, phi, theta)
    sky.setSunPosition(sun)
    water.setSunDirection(sun)

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
      water.setSunDirection(sun)

      const sunLightIntensity = getSunIntensity(date)
      const sunLightColor = new THREE.Color(getSunColor(date))

      ambientLight.intensity = sunLightIntensity * 0.8

      directLight.color = sunLightColor
      directLight.intensity = sunLightIntensity * 1.8
      directLight.position.set(Math.sin(theta) * 100, Math.sin(phiEle) * 500, Math.cos(theta) * 100)

      // update light of frame
      this.items.forEach((item) => {
        if (item instanceof PostFrames) {
          item.spotLights.forEach((spotLight) => {
            spotLight.intensity = 3 * (1 - sunLightIntensity) + 5
          })
        }
      })
    }, 60 * 1000)

    // Create PostFrames
    const frames = new PostFrames({
      container: props.scene,
      textureLoader,
      postList: props.postList,
      framesData: FRAMES_DATA,
      spotLight: {
        intensity: 3 * (1 - sunLightIntensity) + 5,
      },
    })
    this.items.push(frames)
    this.targets.push(...frames.meshes)
  }

  update(delta: number) {
    this.water?.update()
  }

  dispose() {
    this.lightInterval && clearInterval(this.lightInterval)
    this.lights.forEach((light) => {
      this.scene && this.scene.remove(light)
      light.dispose()
    })
    this.items.forEach((item) => {
      item.dispose && item.dispose()
    })
  }
}
