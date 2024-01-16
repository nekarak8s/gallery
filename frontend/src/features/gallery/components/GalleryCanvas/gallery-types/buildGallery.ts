import { Body, Box, Vec3 } from 'cannon-es'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { degToRad } from 'three/src/math/MathUtils'
import wallBaseImg from '@/assets/textures/concrete/Concrete_011_COLOR.jpg'
import wallNormImg from '@/assets/textures/concrete/Concrete_011_NORM.jpg'
import frameNormImg from '@/assets/textures/fabric/Fabric_polyester_001_normal.jpg'
import floorBaseImg from '@/assets/textures/granite/Granite_001_COLOR.jpg'
import floorNormImg from '@/assets/textures/granite/Granite_001_NORM.jpg'
import floorAmbientImg from '@/assets/textures/granite/Granite_001_OCC.jpg'
import { GalleryTypeProps } from '@/features/gallery/types'
import { getSunColor, getSunIntensity, getSunPosition } from '@/libs/sun'
import { Ceiling } from '@/libs/three-custom/items/Ceiling'
import { Floor } from '@/libs/three-custom/items/Floor'
import { Frame } from '@/libs/three-custom/items/Frame'
import { PostFrames } from '@/libs/three-custom/items/PostFrames'
import { SkyItem } from '@/libs/three-custom/items/Sky'
import { Wall } from '@/libs/three-custom/items/Wall'
import { Walls } from '@/libs/three-custom/items/Walls'
import { WaterItem } from '@/libs/three-custom/items/Water'

const FLOORS_DATA = [
  {
    x: 20.4,
    y: 2,
    z: 6.09,
    width: 30,
    height: 5,
    depth: 50,
  },
  {
    x: 32.9,
    y: 2,
    z: 56.09,
    width: 5,
    height: 10,
    depth: 10,
  },
]

const GLASS_FLOORS_DATA = [
  {
    x: 50.4,
    y: 2,
    z: 6.09,
    width: 10,
    height: 0.5,
    depth: 35.4,
  },
]

const WALL_INFO = {
  depth: 0.3,
}

const WALLS_DATA = [
  // left top
  {
    x: 20.55,
    y: 2,
    z: 9.17,
    width: 6,
    height: 12,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-90),
  },
  {
    x: 20.55,
    y: 2,
    z: 16.18,
    width: 4,
    height: 8,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-90),
  },
  {
    x: 20.55,
    y: 11,
    z: 15.17,
    width: 5.01,
    height: 3,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-90),
  },
  // right top
  {
    x: 55.4,
    y: -1,
    z: 4.69,
    width: 5,
    height: 11,
    depth: WALL_INFO.depth,
  },
  {
    x: 31.47,
    y: 2,
    z: 11.14,
    width: 10,
    height: 5,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-25),
  },
  {
    x: 41.27,
    y: 2,
    z: 15.71,
    width: 10,
    height: 5,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-25),
  },
  {
    x: 31.47,
    y: 7.5,
    z: 11.14,
    width: 10,
    height: 4,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-25),
  },
  {
    x: 41.27,
    y: 7.5,
    z: 15.71,
    width: 10,
    height: 4,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-25),
  },
  {
    x: 50.25,
    y: 2,
    z: 19.8,
    width: 8,
    height: 9.5,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-90),
  },
  // Middle
  {
    x: 32.91,
    y: 2,
    z: 33.19,
    width: 5,
    height: 3,
    depth: WALL_INFO.depth,
  },
  {
    x: 32.4,
    y: 2,
    z: 43.88,
    width: 6,
    height: 5.5,
    depth: WALL_INFO.depth,
  },

  // Sea
  {
    x: 18.06,
    y: -1,
    z: 36.15,
    width: 7,
    height: 10,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-90),
  },
  {
    x: 62.98,
    y: -1,
    z: 27.4,
    width: 15.9,
    height: 9,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-90),
  },
  {
    x: 54.83,
    y: -1,
    z: 43.15,
    width: 8,
    height: 9,
    depth: WALL_INFO.depth,
  },
  // Entrance
  {
    x: 20.4,
    y: 2,
    z: 55.94,
    width: 12.5,
    height: 8,
    depth: WALL_INFO.depth,
  },
  {
    x: 37.9,
    y: 2,
    z: 55.94,
    width: 12.5,
    height: 8,
    depth: WALL_INFO.depth,
  },
]

const GLASS_WALL = {
  x: 31.52,
  y: 2,
  z: 11.15,
  width: 20.66,
  height: 9.5,
  depth: 0.2,
  rotationY: degToRad(-25),
}

const CEILING_DATA = {
  x: 32.4,
  y: 7.5,
  z: 33.03,
  width: 6,
  height: 0.2,
  depth: 11,
}

const PLANT_DATA = [
  // lef top
  {
    type: 2,
    x: 21.12,
    y: 2,
    z: 9.07,
    rotation: 1,
    scale: 2,
  },
  {
    type: 1,
    x: 21.12,
    y: 2,
    z: 10.41,
    rotation: 0.8,
    scale: 2.1,
  },
  {
    type: 1,
    x: 22,
    y: 2,
    z: 9.97,
    rotation: 2.1,
    scale: 2,
  },
  {
    type: 1,
    x: 21.12,
    y: 2,
    z: 13.65,
    rotation: 1.5,
    scale: 2.1,
  },
  {
    type: 2,
    x: 21.12,
    y: 2,
    z: 14.77,
    rotation: 1.4,
    scale: 2.2,
  },
  {
    type: 2,
    x: 21.12,
    y: 2,
    z: 15.92,
    rotation: 2,
    scale: 2.05,
  },
  {
    type: 1,
    x: 21.12,
    y: 2,
    z: 17.07,
    rotation: 2.5,
    scale: 2.15,
  },
  {
    type: 0,
    x: 22.24,
    y: 2,
    z: 14.37,
    rotation: 2.3,
    scale: 1.7,
  },
  {
    type: 2,
    x: 22.24,
    y: 2,
    z: 15.57,
    rotation: 2,
    scale: 1.8,
  },
  {
    type: 0,
    x: 22.24,
    y: 2,
    z: 16.58,
    rotation: 0.3,
    scale: 1.73,
  },
  // right top
  {
    type: 1,
    x: 48.89,
    y: 2,
    z: 20.2,
    scale: 2,
    rotation: 0.8,
  },

  {
    type: 1,
    x: 48.89,
    y: 2,
    z: 21.16,
    scale: 2.2,
    rotation: 1,
  },
  {
    type: 0,
    x: 48.89,
    y: 2,
    z: 22.36,
    scale: 1.7,
    rotation: 1,
  },
  {
    type: 1,
    x: 48.1,
    y: 2,
    z: 20.76,
    scale: 1.7,
    rotation: 2,
  },

  {
    type: 0,
    x: 48.1,
    y: 2,
    z: 21.96,
    scale: 2,
    rotation: 2,
  },
  {
    type: 0,
    x: 48.89,
    y: 2,
    z: 25,
    scale: 1.7,
    rotation: 1,
  },
  {
    type: 1,
    x: 48.89,
    y: 2,
    z: 26.23,
    scale: 2.1,
    rotation: 1.8,
  },

  {
    type: 1,
    x: 48.89,
    y: 2,
    z: 27.4,
    scale: 2.05,
    rotation: 0.6,
  },
  {
    type: 0,
    x: 48.1,
    y: 2,
    z: 25.8,
    scale: 2,
    rotation: 2,
  },
  {
    type: 1,
    x: 48.1,
    y: 2,
    z: 27,
    scale: 1.7,
    rotation: 2.9,
  },
  // middle
  {
    type: 2,
    x: 33.4,
    y: 2,
    z: 44.7,
    scale: 3,
    rotation: 3,
  },
  {
    type: 2,
    x: 37,
    y: 2,
    z: 44.7,
    scale: 3.1,
    rotation: 2,
  },
]

const FRAME_INFO = {
  depth: 0.2,
}

const FRAMES_DATA = [
  {
    // 1
    x: 35.4,
    y: 4.5,
    z: 43.98,
    width: 2,
    height: 2,
    depth: FRAME_INFO.depth,
  },
  {
    // 2
    x: 18.16,
    y: 5,
    z: 39.64,
    width: 3,
    height: 3,
    depth: FRAME_INFO.depth,
    rotationY: degToRad(90),
  },
  {
    // 3
    x: 20.65,
    y: 4,
    z: 18.18,
    width: 1.8,
    height: 1.8,
    depth: FRAME_INFO.depth,
    rotationY: degToRad(90),
  },
  {
    // 4
    x: 20.65,
    y: 4.25,
    z: 12.16,
    width: 2.5,
    height: 2.5,
    depth: FRAME_INFO.depth,
    rotationY: degToRad(90),
  },
  {
    // 5
    x: 50.15,
    y: 5,
    z: 23.78,
    width: 4,
    height: 4,
    depth: FRAME_INFO.depth,
    rotationY: degToRad(-90),
  },
  {
    // 6
    x: 35.4,
    y: 3.6,
    z: 33.29,
    width: 1.5,
    height: 1.5,
    depth: FRAME_INFO.depth,
  },
  {
    // 7
    x: 35.4,
    y: 4.5,
    z: 43.78,
    width: 3,
    height: 3,
    depth: FRAME_INFO.depth,
    rotationY: degToRad(180),
  },
  {
    // 8
    x: 58.83,
    y: 5,
    z: 43.05,
    width: 3,
    height: 3,
    depth: FRAME_INFO.depth,
    rotationY: degToRad(180),
  },
  {
    // 9
    x: 62.88,
    y: 5,
    z: 36.52,
    width: 3,
    height: 3,
    depth: FRAME_INFO.depth,
    rotationY: degToRad(-90),
  },

  {
    // 10
    x: 57.9,
    y: 4,
    z: 4.79,
    width: 2,
    height: 2,
    depth: FRAME_INFO.depth,
  },
]

const EDGES_DATA = [
  {
    width: 0.1,
    height: 10,
    depth: 50,
    x: 20.4,
    y: 5,
    z: 31.09,
  },
  {
    width: 40,
    height: 10,
    depth: 0.1,
    x: 40.4,
    y: 5,
    z: 6.09,
  },
  {
    width: 0.1,
    height: 10,
    depth: 35.4,
    x: 60.4,
    y: 5,
    z: 23.79,
  },
  {
    width: 10,
    height: 10,
    depth: 0.1,
    x: 55.4,
    y: 5,
    z: 41.49,
  },
  {
    width: 0.1,
    height: 10,
    depth: 14.6,
    x: 50.4,
    y: 5,
    z: 48.79,
  },
  {
    width: 0.1,
    height: 10,
    depth: 10,
    x: 37.9,
    y: 5,
    z: 61.09,
  },
  {
    width: 5,
    height: 10,
    depth: 0.1,
    x: 35.4,
    y: 5,
    z: 66.1,
  },
  {
    width: 0.1,
    height: 10,
    depth: 10,
    x: 32.9,
    y: 5,
    z: 61.09,
  },
]

const buildGallery = (props: GalleryTypeProps) => {
  // Set camera position
  props.controls.setPosition(35, 5, 62)

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
        ambientImg: floorAmbientImg,
        normalImg: floorNormImg,
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
      // ambientImg: wallAmbientImg,
      normalImg: wallNormImg,
      repeatX: CEILING_DATA.width / 6,
      repeatY: CEILING_DATA.depth / 6,
    },
  })
  items.push(ceiling)
  props.rayControls.rayItems.push(ceiling.mesh)

  // Create walls
  const walls = new Walls({
    world: props.world,
    container: props.scene,
    wallsData: WALLS_DATA,
    repeatX: 10 / 6,
    repeatY: 8 / 6,
    texture: {
      textureLoader,
      baseImg: wallBaseImg,
      // ambientImg: wallAmbientImg,
      normalImg: wallNormImg,
    },
  })
  items.push(walls)
  props.rayControls.rayItems.push(walls.mesh)

  const glassWall = new Wall({
    world: props.world,
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
    normalImg: frameNormImg,
    // ambientImg: frameAmbientImg,
    framesData: FRAMES_DATA,
    repeatX: 3,
    repeatY: 3,
    spotLight: {
      intensity: 3 * (1 - sunLightIntensity) + 5,
    },
  })
  items.push(frames)
  frames.meshes.forEach((mesh) => {
    props.rayControls.rayItems.push(mesh)
  })

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

  /**
   * Cannon.js Edges
   */
  EDGES_DATA.forEach((edgeData) => {
    const shape = new Box(new Vec3(edgeData.width / 2, edgeData.height / 2, edgeData.depth / 2))
    const body = new Body({
      mass: 0,
      position: new Vec3(edgeData.x, edgeData.y, edgeData.z),
      shape,
    })
    props.world.addBody(body)

    items.push({
      dispose: () => {
        props.world.removeBody(body)
      },
    })
  })

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
