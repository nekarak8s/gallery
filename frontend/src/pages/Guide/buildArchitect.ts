import * as THREE from 'three'
import { degToRad } from 'three/src/math/MathUtils'
import createGalleryImg from '@/assets/images/guide/create-gallery.png'
import loginImg from '@/assets/images/guide/login.png'
import playImg from '@/assets/images/guide/play.png'
import updateGalleryImg from '@/assets/images/guide/update-gallery.png'
import wallBaseImg from '@/assets/textures/concrete/Concrete_011_COLOR.jpg'
import wallNormImg from '@/assets/textures/concrete/Concrete_011_NORM.jpg'
import wallAmbientImg from '@/assets/textures/concrete/Concrete_011_OCC.jpg'
import wallRoughImg from '@/assets/textures/concrete/Concrete_011_ROUGH.jpg'
import frameAmbientImg from '@/assets/textures/fabric/Fabric_polyester_001_ambientOcclusion.jpg'
import frameNormImg from '@/assets/textures/fabric/Fabric_polyester_001_normal.jpg'
import floorBaseImg from '@/assets/textures/granite/Granite_001_COLOR.jpg'
import floorNormImg from '@/assets/textures/granite/Granite_001_NORM.jpg'
import floorAmbientImg from '@/assets/textures/granite/Granite_001_OCC.jpg'
import floorRoughImg from '@/assets/textures/granite/Granite_001_ROUGH.jpg'
import { getSunColor, getSunIntensity, getSunPosition } from '@/libs/sun'
import { Floor } from '@/libs/three-custom/items/Floor'
import { Frame } from '@/libs/three-custom/items/Frame'
import { SkyItem } from '@/libs/three-custom/items/Sky'
import { Walls } from '@/libs/three-custom/items/Walls'
import { WaterItem } from '@/libs/three-custom/items/Water'

const FLOOR_DATA = {
  x: 0,
  y: 2,
  z: 0,
  width: 20,
  height: 40,
  depth: 40,
}

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
    width: 38,
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
  const sky = new SkyItem({
    scene: props.scene,
    size: 20000,
  })
  items.push(sky)

  // Create water
  const water = new WaterItem({
    container: props.scene,
    textureLoader,
    width: 10000,
    depth: 10000,
  })
  items.push(water)

  // Create Floor
  const floor = new Floor({
    container: props.scene,
    color: 0x686868,
    x: FLOOR_DATA.x,
    y: FLOOR_DATA.y,
    z: FLOOR_DATA.z,
    width: FLOOR_DATA.width,
    height: FLOOR_DATA.height,
    depth: FLOOR_DATA.depth,
    texture: {
      textureLoader,
      baseImg: floorBaseImg,
      ambientImg: floorAmbientImg,
      normalImg: floorNormImg,
      roughImg: floorRoughImg,
      repeatX: FLOOR_DATA.width / 3,
      repeatY: FLOOR_DATA.height / 3,
    },
  })
  items.push(floor)

  // Create Walls
  const walls = new Walls({
    container: props.scene,
    wallsData: WALLS_DATA,
    repeatFactor: 1 / 10,
    texture: {
      textureLoader,
      baseImg: wallBaseImg,
      ambientImg: wallAmbientImg,
      normalImg: wallNormImg,
      roughImg: wallRoughImg,
    },
  })
  items.push(walls)

  // Create Frames
  FRAMES_DATA.forEach((frame_data, index) => {
    const frame = new Frame({
      order: index,
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
        ambientImg: frameAmbientImg,
        normalImg: frameNormImg,
        repeatX: frame_data.width * 1.5,
        repeatY: frame_data.height * 1.5,
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

  // Light Helper : Development
  if (process.env.NODE_ENV !== 'production') {
    import('three').then(({ CameraHelper }) => {
      props.scene.add(new CameraHelper(directLight.shadow.camera))
    })
  }

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
      light.dispose()
    })
    items.forEach((item) => {
      item.dispose && item.dispose()
    })
  }

  return { dispose, update }
}
