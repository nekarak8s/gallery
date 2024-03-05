import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {
  CEILING_DATA,
  EDGES_DATA,
  FLOORS_DATA,
  FRAMES_DATA,
  GLASS_FLOORS_DATA,
  GLASS_WALL,
  WALLS_DATA,
} from './galleryData'
import wallBaseImg from '@/assets/textures/concrete/Concrete_019_BaseColor.jpg'
import floorBaseImg from '@/assets/textures/granite/Granite_001_COLOR.jpg'
import { GalleryTypeProps } from '@/features/gallery/types'
import { getSunColor, getSunIntensity, getSunPosition } from '@/libs/sun'
import { Ceiling } from '@/libs/three-custom/items/Ceiling'
import { Edges } from '@/libs/three-custom/items/Edges'
import { Floor } from '@/libs/three-custom/items/Floor'
import { Frame } from '@/libs/three-custom/items/Frame'
import { PostFrames } from '@/libs/three-custom/items/PostFrames'
import { SkyItem } from '@/libs/three-custom/items/Sky'
import { Wall } from '@/libs/three-custom/items/Wall'
import { Walls } from '@/libs/three-custom/items/Walls'
import { WaterItem } from '@/libs/three-custom/items/Water'

const buildGallery = (props: GalleryTypeProps) => {
  // Create Loaders
  const textureLoader = new THREE.TextureLoader(props.loadingManager)
  const gltfLoader = new GLTFLoader(props.loadingManager)

  // Array for managing resources in dispose function
  const lights: THREE.Light[] = []
  const items: ThreeItem[] = []

  // Sun information
  const date = new Date()
  const sunLightIntensity = getSunIntensity(date)
  const sunLightColor = new THREE.Color(getSunColor(date))

  /**
   * Meshes
   */
  // Create sky
  const sky = new SkyItem({
    scene: props.scene,
    size: 2000,
  })
  items.push(sky)

  // Create water
  const water = new WaterItem({
    container: props.scene,
    textureLoader,
    width: 1000,
    depth: 1000,
    distortionScale: 3,
  })
  items.push(water)

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
    items.push(floor)
    props.controls.floors.push(floor.mesh)
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
    items.push(glassFloor)
    props.controls.floors.push(glassFloor.mesh)
  })

  // Set camera position
  props.controls.setPosition(35, 15, 62)

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
  items.push(ceiling)
  props.rayControls.rayItems.push(ceiling.mesh)
  props.controls.obstacles.push(ceiling.mesh)

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
  items.push(walls)
  props.rayControls.rayItems.push(walls.mesh)
  props.controls.obstacles.push(walls.mesh)

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
  items.push(glassWall)
  props.rayControls.rayItems.push(glassWall.mesh)
  props.controls.obstacles.push(glassWall.mesh)

  // // Create Plants
  // const plants = new Plants({
  //   container: props.scene,
  //   gltfLoader,
  //   plantsData: PLANT_DATA,
  // })
  // items.push(plants)
  // props.rayControls.rayItems = [...props.rayControls.rayItems, ...plants.objects]

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
  items.push(frames)
  props.rayControls.rayItems = [...props.rayControls.rayItems, ...frames.meshes]

  /**
   * Light
   */
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
  props.scene.add(ambientLight)
  lights.push(ambientLight)

  // Direct Light
  const directLight = new THREE.DirectionalLight(sunLightColor, sunLightIntensity * 1.8)
  directLight.position.set(Math.sin(theta) * 100, Math.sin(phiEle) * 500, Math.cos(theta) * 100)
  directLight.shadow.camera.left = -60
  directLight.shadow.camera.right = 60
  directLight.shadow.camera.top = 60
  directLight.shadow.camera.bottom = -100
  directLight.castShadow = true
  props.scene.add(directLight)
  lights.push(directLight)

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
    items.forEach((item) => {
      if (item instanceof Frame && item.spotLight) {
        item.spotLight.intensity = 3 * (1 - sunLightIntensity) + 5
      }
    })
  }, 60 * 1000)

  // Light Helper : Development
  if (process.env.NODE_ENV !== 'production') {
    import('three').then(({ CameraHelper }) => {
      props.scene.add(new CameraHelper(directLight.shadow.camera))
    })
  }

  // Create edges
  const edges = new Edges({
    container: props.scene,
    edgesData: EDGES_DATA,
  })
  items.push(edges)
  props.controls.obstacles.push(edges.mesh)

  /**
   * Update function: Render canvas
   */
  const update = function renderCanvas() {
    water.update()
  }

  /**
   * Dispose function: Release all the resources
   */
  const dispose = function () {
    lightInterval && clearInterval(lightInterval)
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

export default buildGallery
