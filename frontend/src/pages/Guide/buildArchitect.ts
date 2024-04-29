import * as THREE from 'three'
import { degToRad } from 'three/src/math/MathUtils'
import createGalleryImg from '@/assets/images/guide/create-gallery.png'
import loginImg from '@/assets/images/guide/login.png'
import playImg from '@/assets/images/guide/play.png'
import updateGalleryImg from '@/assets/images/guide/update-gallery.png'
import wallAmbientImg from '@/assets/textures/concrete/Concrete_019_AmbientOcclusion.jpg'
import wallBaseImg from '@/assets/textures/concrete/Concrete_019_BaseColor.jpg'
import wallNormImg from '@/assets/textures/concrete/Concrete_019_Normal.jpg'
import floorBaseImg from '@/assets/textures/granite/Granite_001_COLOR.jpg'
import floorNormImg from '@/assets/textures/granite/Granite_001_NORM.jpg'
import floorAmbientImg from '@/assets/textures/granite/Granite_001_OCC.jpg'
import { getSunColor, getSunIntensity, getSunPosition } from '@/libs/sun'
import FloorsFactory from '@/libs/three-custom/items/Floors'
import FrameFactory, { Frame } from '@/libs/three-custom/items/Frame'
import OceanFactory, { OceanItem } from '@/libs/three-custom/items/Ocean'
import SkyFactory, { SkyItem } from '@/libs/three-custom/items/Sky'
import WallsFactory from '@/libs/three-custom/items/Walls'
import { disposeObject } from '@/libs/three-custom/utils/disposeObject'

const FLOOR_DATA = [
  {
    x: 0,
    y: 2,
    z: 0,
    width: 20,
    height: 40,
    depth: 40,
  },
]

const WALLS_DATA = [
  {
    x: 1,
    y: 1,
    z: 35,
    width: 10,
    height: 8,
    depth: 0.3,
  },
  {
    x: 18,
    y: 1,
    z: 1,
    width: 19,
    height: 8,
    depth: 0.3,
    rotationY: degToRad(-90),
  },
  {
    x: 18,
    y: 1,
    z: 20,
    width: 19,
    height: 8,
    depth: 0.3,
    rotationY: degToRad(-90),
  },
  {
    x: 1,
    y: 1,
    z: 1,
    width: 15,
    height: 8,
    depth: 0.3,
    rotationY: degToRad(-90),
  },
]

const FRAMES_DATA = [
  {
    x: 3,
    y: 6,
    z: 35.1,
    width: 2,
    height: 2,
    depth: 0.2,
    baseImg: loginImg,
  },
  {
    x: 17.9,
    y: 6,
    z: 37,
    width: 2,
    height: 2,
    depth: 0.2,
    rotationY: degToRad(-90),
    baseImg: createGalleryImg,
  },
  {
    x: 17.9,
    y: 6,
    z: 3,
    width: 2,
    height: 2,
    depth: 0.2,
    rotationY: degToRad(-90),
    baseImg: updateGalleryImg,
  },
  {
    x: 1.1,
    y: 6,
    z: 3,
    width: 2,
    height: 2,
    depth: 0.2,
    rotationY: degToRad(90),
    baseImg: playImg,
  },
]

type buildArchitectProps = {
  scene: THREE.Scene
  loadingManager: THREE.LoadingManager
}

export function buildArchitect(props: buildArchitectProps): ThreeItem {
  // Loaders
  const textureLoader = new THREE.TextureLoader(props.loadingManager)

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
  const sky = new SkyFactory().addItem({
    container: props.scene,
    size: 20000,
  }) as SkyItem
  items.push(sky)

  // Create water
  const water = new OceanFactory().addItem({
    container: props.scene,
    textureLoader,
    width: 10000,
    depth: 10000,
  }) as OceanItem
  items.push(water)

  // Create Floor
  const floor = new FloorsFactory().addItem({
    container: props.scene,
    color: 0x686868,
    floorsData: FLOOR_DATA,
    texture: {
      textureLoader,
      baseImg: floorBaseImg,
      ambientImg: floorAmbientImg,
      normalImg: floorNormImg,
      repeatX: FLOOR_DATA[0].width / 3,
      repeatY: FLOOR_DATA[0].depth / 3,
    },
  })
  items.push(floor)

  // Create Walls
  const walls = new WallsFactory().addItem({
    container: props.scene,
    wallsData: WALLS_DATA,
    repeatX: 15 / 6,
    repeatY: 8 / 6,
    texture: {
      textureLoader,
      baseImg: wallBaseImg,
      ambientImg: wallAmbientImg,
      normalImg: wallNormImg,
    },
  })
  items.push(walls)

  // Create Frames
  FRAMES_DATA.forEach((frame_data, index) => {
    const frame = new FrameFactory().addItem({
      container: props.scene,
      x: frame_data.x,
      y: frame_data.y,
      z: frame_data.z,
      width: frame_data.width,
      height: frame_data.height,
      depth: frame_data.depth,
      rotationY: frame_data.rotationY,
      isUpdate: false,
      texture: {
        textureLoader,
        baseImg: frame_data.baseImg,
      },
      spotLight: {
        intensity: 3 * (1 - sunLightIntensity) + 5,
      },
    })
    items.push(frame)
  })

  /**
   * Light
   */
  // Create sun
  const sun = new THREE.Vector3()

  // Get sun position
  const { elevation, azimuth } = getSunPosition(date)

  const phi = THREE.MathUtils.degToRad(90 - elevation)
  const phiEle = THREE.MathUtils.degToRad(elevation * 3 + 1)
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
    const phiEle = THREE.MathUtils.degToRad(elevation * 3 + 1)
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

  /**
   * Update function: Flow water
   */
  const update = () => {
    water.update()
  }

  /**
   * Dispose function: Release all the resources
   */
  const dispose = () => {
    lightInterval && clearInterval(lightInterval)
    lights.forEach((light) => {
      props.scene.remove(light)
      disposeObject(light)
    })
    items.forEach((item) => {
      item.dispose && item.dispose()
    })
  }

  return { dispose, update }
}
