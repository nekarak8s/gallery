import { Body, Box, Vec3 } from 'cannon-es'
import * as THREE from 'three'
import { degToRad } from 'three/src/math/MathUtils'
import wallBaseImg from '@/assets/textures/concrete/Concrete_011_COLOR.jpg'
import wallNormImg from '@/assets/textures/concrete/Concrete_011_NORM.jpg'
import wallAmbientImg from '@/assets/textures/concrete/Concrete_011_OCC.jpg'
import frameAmbientImg from '@/assets/textures/fabric/Fabric_polyester_001_ambientOcclusion.jpg'
import frameNormImg from '@/assets/textures/fabric/Fabric_polyester_001_normal.jpg'
import floorBaseImg from '@/assets/textures/granite/Granite_001_COLOR.jpg'
import floorNormImg from '@/assets/textures/granite/Granite_001_NORM.jpg'
import floorAmbientImg from '@/assets/textures/granite/Granite_001_OCC.jpg'
import { GalleryTypeProps } from '@/features/gallery/types'
import { getSunColor, getSunIntensity, getSunPosition } from '@/libs/sun'
import { Ceiling } from '@/libs/three-custom/items/Ceiling'
import { Floor } from '@/libs/three-custom/items/Floor'
import { Frame } from '@/libs/three-custom/items/Frame'
import { SkyItem } from '@/libs/three-custom/items/Sky'
import { Wall } from '@/libs/three-custom/items/Wall'
import { WaterItem } from '@/libs/three-custom/items/Water'

const FLOORS_DATA = [
  {
    x: 20.4,
    y: 2,
    z: 6.09,
    width: 30,
    height: 50,
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

const GLASS_FLOOR = {
  x: 50.4,
  y: 2,
  z: 6.09,
  width: 10,
  height: 0.5,
  depth: 35.4,
}

const WALL_INFO = {
  depth: 0.3,
}

const WALLS_DATA = [
  // left top
  {
    x: 20.55,
    y: 2,
    z: 7.22,
    width: 8,
    height: 10,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-90),
  },
  {
    x: 20.55,
    y: 2,
    z: 16.73,
    width: 5,
    height: 5,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-90),
  },
  {
    x: 20.55,
    y: 8,
    z: 15.22,
    width: 6.5,
    height: 4,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-90),
  },
  // right top
  {
    x: 36.85,
    y: 2,
    z: 13.67,
    width: 6,
    height: 4,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-25),
  },
  {
    x: 43.085,
    y: 2,
    z: 16.555,
    width: 8,
    height: 4,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-25),
  },
  {
    x: 36.85,
    y: 6.5,
    z: 13.67,
    width: 6,
    height: 3,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-25),
  },
  {
    x: 43.085,
    y: 6.5,
    z: 16.555,
    width: 8,
    height: 3,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-25),
  },
  {
    x: 50.25,
    y: 2,
    z: 19.8,
    width: 8,
    height: 7.5,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-90),
  },
  // Middle
  {
    x: 32.56,
    y: 2,
    z: 29.97,
    width: 15,
    height: 5,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-90),
  },
  {
    x: 38.36,
    y: 2,
    z: 29.97,
    width: 15,
    height: 5,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-90),
  },
  {
    x: 32.41,
    y: 2,
    z: 45.12,
    width: 6,
    height: 5,
    depth: WALL_INFO.depth,
  },

  // Sea
  {
    x: 18.06,
    y: -1,
    z: 33.15,
    width: 7,
    height: 15,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-90),
  },
  {
    x: 62.98,
    y: -1,
    z: 29.39,
    width: 10,
    height: 11,
    depth: WALL_INFO.depth,
    rotationY: degToRad(-90),
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

const CEILING_DATA = {
  x: 32.41,
  y: 7,
  z: 29.97,
  width: 6.04,
  height: WALL_INFO.depth,
  depth: 15.3,
}

const FRAME_INFO = {
  depth: 0.2,
}

const FRAMES_DATA = [
  {
    // 1
    x: 35.4,
    y: 5,
    z: 45.3,
    width: 3,
    height: 3,
    depth: FRAME_INFO.depth,
  },
  {
    // 2
    x: 18.16,
    y: 5,
    z: 36.64,
    width: 3,
    height: 3,
    depth: FRAME_INFO.depth,
    rotationY: degToRad(90),
  },
  {
    // 3
    x: 20.65,
    y: 4.5,
    z: 19.06,
    width: 2.5,
    height: 2.5,
    depth: FRAME_INFO.depth,
    rotationY: degToRad(90),
  },
  {
    // 4
    x: 20.65,
    y: 4,
    z: 11.21,
    width: 2,
    height: 2,
    depth: FRAME_INFO.depth,
    rotationY: degToRad(90),
  },
  {
    // 5
    x: 46.64,
    y: 4,
    z: 18.31,
    width: 2,
    height: 2,
    depth: FRAME_INFO.depth,
    rotationY: degToRad(-25),
  },
  {
    // 6
    x: 62.88,
    y: 5,
    z: 36.52,
    width: 3,
    height: 3,
    depth: FRAME_INFO.depth,
    rotationY: degToRad(90),
  },
  {
    // 7
    x: 50.35,
    y: 4.5,
    z: 23.78,
    width: 2.5,
    height: 2.5,
    depth: FRAME_INFO.depth,
    rotationY: degToRad(90),
  },
  {
    // 8
    x: 46.71,
    y: 4,
    z: 18.15,
    width: 2,
    height: 2,
    depth: FRAME_INFO.depth,
    rotationY: degToRad(155),
  },
  {
    // 9
    x: 39.5,
    y: 4,
    z: 14.79,
    width: 2,
    height: 2,
    depth: FRAME_INFO.depth,
    rotationY: degToRad(155),
  },
  {
    // 10
    x: 35.4,
    y: 5,
    z: 45,
    width: 3,
    height: 3,
    depth: FRAME_INFO.depth,
    rotationY: degToRad(180),
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

  // Array for managing resources in dispose function
  const lights: THREE.Light[] = []
  const items: ThreeItem[] = []

  // Sun information
  const date = new Date()
  const { elevation, azimuth } = getSunPosition(date)
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
        repeatY: floorData.height / 3,
      },
    })
    items.push(floor)
    props.controls.floors.push(floor.mesh)
  })

  const glassFloor = new Floor({
    container: props.scene,
    color: 0xffffff,
    x: GLASS_FLOOR.x,
    y: GLASS_FLOOR.y,
    z: GLASS_FLOOR.z,
    width: GLASS_FLOOR.width,
    height: GLASS_FLOOR.height,
    depth: GLASS_FLOOR.depth,
    transparent: true,
    opacity: 0.4,
  })
  items.push(glassFloor)

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
      ambientImg: wallAmbientImg,
      normalImg: wallNormImg,
      repeatX: CEILING_DATA.width / 8,
      repeatY: CEILING_DATA.depth / 8,
    },
  })
  items.push(ceiling)

  // Create walls
  WALLS_DATA.forEach((wallData) => {
    const wall = new Wall({
      world: props.world,
      container: props.scene,
      x: wallData.x,
      y: wallData.y,
      z: wallData.z,
      width: wallData.width,
      height: wallData.height,
      depth: wallData.depth,
      rotationY: wallData.rotationY,
      texture: {
        textureLoader,
        baseImg: wallBaseImg,
        ambientImg: wallAmbientImg,
        normalImg: wallNormImg,
        repeatX: wallData.width / 8,
        repeatY: wallData.height / 8,
      },
    })
    items.push(wall)
  })

  // Create Frames
  FRAMES_DATA.forEach((frameData, idx) => {
    // Only if the post isActive
    if (props.postList[idx].isActive) {
      const frame = new Frame({
        order: idx,
        container: props.scene,
        x: frameData.x,
        y: frameData.y,
        z: frameData.z,
        width: frameData.width,
        height: frameData.height,
        depth: frameData.depth,
        rotationY: frameData.rotationY,
        isUpdate: false,
        texture: {
          textureLoader,
          baseImg: props.postList[idx].imageURL,
          ambientImg: frameAmbientImg,
          normalImg: frameNormImg,
          repeatX: frameData.width * 1.5,
          repeatY: frameData.height * 1.5,
        },
        spotLight: {
          intensity: 3 * (1 - sunLightIntensity) + 5,
        },
      })
      items.push(frame)
      props.rayControls.rayItems.push(frame.mesh)
    }
  })

  /**
   * Light
   */
  // Create sun
  const sun = new THREE.Vector3()

  // Get sun position
  const phi = THREE.MathUtils.degToRad(90 - elevation)
  const phiEle = THREE.MathUtils.degToRad(elevation * 3)
  const theta = THREE.MathUtils.degToRad(azimuth)

  // Set on the sky & water
  sun.setFromSphericalCoords(1, phi, theta)
  sky.setSunPosition(sun)
  water.setSunDirection(sun)

  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, sunLightIntensity)
  props.scene.add(ambientLight)
  lights.push(ambientLight)

  // Direct Light
  const directLight = new THREE.DirectionalLight(sunLightColor, sunLightIntensity)
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
    const theta = THREE.MathUtils.degToRad(azimuth)

    sun.setFromSphericalCoords(1, phi, theta)
    sky.setSunPosition(sun)
    water.setSunDirection(sun)

    const sunLightIntensity = getSunIntensity(date)
    const sunLightColor = new THREE.Color(getSunColor(date))

    ambientLight.intensity = sunLightIntensity

    directLight.color = sunLightColor
    directLight.intensity = sunLightIntensity
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
  const update = function renderCanvas(delta: number) {
    items.forEach((object) => {
      object.update && object.update(delta)
    })
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
