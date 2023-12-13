import { Body, Box, SAPBroadphase, Vec3, World } from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'
import {
  AmbientLight,
  Box3,
  BoxGeometry,
  Clock,
  CubeTextureLoader,
  CylinderGeometry,
  DoubleSide,
  DirectionalLight,
  Scene,
  TextureLoader,
  Vector3,
  Mesh,
  MeshLambertMaterial,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { degToRad } from 'three/src/math/MathUtils'
import { DefaultCamera } from '../three-custom/cameras/DefaultCamera'
import { CannonKeypadControls } from '../three-custom/controls/CannonKeypadControls'
import { RaycasterControls } from '../three-custom/controls/RaycasterControls.ts'
import { Frame } from '../three-custom/meshes/Frame'
import { Trees } from '../three-custom/meshes/Trees'
import { DefaultRenderer } from '../three-custom/renderers/DefaultRenderer'
import nx from '@/assets/cubemaps/clear_sky/nx.png'
import ny from '@/assets/cubemaps/clear_sky/ny.png'
import nz from '@/assets/cubemaps/clear_sky/nz.png'
import px from '@/assets/cubemaps/clear_sky/px.png'
import py from '@/assets/cubemaps/clear_sky/py.png'
import pz from '@/assets/cubemaps/clear_sky/pz.png'
import greenaryGlb from '@/assets/glbs/greenary.glb'
import toastManager from '@/utils/toastManager'

const WALL_INFO = {
  color: '#fffeef',
  depth: 0.2,
  height: 4.5,
}

const FRAME_INFO = {
  width: 2,
  height: 2,
  depth: 0.05,
}

const FRAME_DATA = [
  {
    // 1
    x: 55,
    y: 4,
    z: 55,
  },
]

const FOREST_TREE = [
  {
    // 1
    type: 0,
    x: 61,
    y: 0,
    z: 19,
    scale: 1.5,
  },
  {
    // 2
    type: 0,
    x: 68,
    y: 0,
    z: 17,
    scale: 2,
  },
  {
    // 3
    type: 0,
    x: 76,
    y: 0,
    z: 17,
    scale: 1.7,
  },
  {
    // 4
    type: 0,
    x: 59,
    y: 0.5,
    z: 24,
    scale: 1.8,
  },
  {
    // 5
    type: 0,
    x: 66,
    y: 0.5,
    z: 23,
    scale: 2,
  },
  {
    // 6
    type: 0,
    x: 72,
    y: 0.5,
    z: 21,
    scale: 2.1,
  },
  {
    // 7
    type: 0,
    x: 80,
    y: 0,
    z: 22,
    scale: 1.9,
  },
  {
    // 8
    type: 0,
    x: 63,
    y: 1,
    z: 27,
    scale: 1.75,
  },
  {
    // 9
    type: 0,
    x: 81,
    y: 0.5,
    z: 26,
    scale: 1.95,
  },
  {
    // 10
    type: 0,
    x: 64,
    y: 1.3,
    z: 33,
    scale: 1.75,
  },
  {
    // 11
    type: 0,
    x: 70,
    y: 1.3,
    z: 31,
    scale: 1.8,
  },
  {
    // 12
    type: 0,
    x: 75,
    y: 1.3,
    z: 32,
    scale: 1.82,
  },
  {
    // 13
    type: 0,
    x: 80,
    y: 1.3,
    z: 31,
    scale: 2,
  },
]

const MOUNTAIN_TREE = [
  {
    // 1
    type: 6, // 6, 14, 17
    x: 81,
    y: 10,
    z: 73,
    scale: 2,
  },
  {
    // 2
    type: 17,
    x: 82,
    y: 6.7,
    z: 65,
    scale: 1.8,
  },
  {
    // 3
    type: 14,
    x: 76,
    y: 6.7,
    z: 82,
    scale: 1.7,
  },
  {
    // 4
    type: 7, // 7, 23, 26
    x: 59,
    y: 8,
    z: 72,
    scale: 1.9,
  },
  {
    // 5
    type: 26,
    x: 51,
    y: 8,
    z: 80,
    scale: 1.6,
  },
  {
    // 6
    type: 23,
    x: 65,
    y: 6,
    z: 89,
    scale: 1.4,
  },
]

const BEACH_TREE = [
  {
    // 1
    type: 28,
    x: 91,
    y: 0,
    z: 28,
    scale: 2,
  },
  {
    // 2
    type: 28,
    x: 96,
    y: 0,
    z: 37,
    scale: 1.8,
  },
  {
    // 3
    type: 28,
    x: 98,
    y: 0,
    z: 45,
    scale: 1.9,
  },
  {
    // 4
    type: 28,
    x: 96,
    y: 0,
    z: 53,
    scale: 2,
  },
  {
    // 5
    type: 28,
    x: 97,
    y: 0,
    z: 61,
    scale: 1.85,
  },
  {
    // 5
    type: 28,
    x: 38,
    y: 0,
    z: 88,
    scale: 1.85,
  },
]

const LAKE_TREE = [
  {
    type: 18,
    x: 30,
    y: 1.5,
    z: 28,
    scale: 2.1,
  },
  {
    type: 2,
    x: 40,
    y: 0.3,
    z: 25,
    scale: 1.7,
  },
  {
    type: 2,
    x: 47,
    y: 0,
    z: 24,
    scale: 1.8,
  },
  {
    type: 1,
    x: 23,
    y: 0.5,
    z: 43,
    scale: 1.8,
  },
  {
    type: 1,
    x: 24,
    y: 0.5,
    z: 51,
    scale: 1.9,
  },
  {
    type: 1,
    x: 28,
    y: 0.5,
    z: 48,
    scale: 1.85,
  },
]

const PLAIN_TREE = [
  {
    type: 24,
    x: 63.2,
    y: 0,
    z: 43.3,
    scale: 1.8,
  },
  {
    type: 19,
    x: 70,
    y: 0,
    z: 45,
    scale: 1.7,
  },
  {
    type: 24,
    x: 31,
    y: 1,
    z: 60,
    scale: 1.85,
  },
]

const TREE_DATA = [...FOREST_TREE, ...MOUNTAIN_TREE, ...BEACH_TREE, ...LAKE_TREE, ...PLAIN_TREE]

const greenary = ({ canvas, loadingManager, gallery, frameList }: GalleryTypeProps) => {
  console.log(gallery, frameList)
  /**
   * Loaders
   */
  const textureLoader = new TextureLoader(loadingManager)
  const cubeTextureLoader = new CubeTextureLoader(loadingManager)
  const gltfLoader = new GLTFLoader(loadingManager)

  /**
   * Renderer
   */
  const renderer = new DefaultRenderer({ canvas, antialias: true })

  /**
   * Scene
   */
  const scene = new Scene()
  scene.background = cubeTextureLoader.load([px, nx, py, ny, pz, nz])

  /**
   * Cannon world
   */
  const world = new World()
  world.broadphase = new SAPBroadphase(world)
  // world.gravity.set(0, -100, 0)

  // Cannon Helper : Development
  let cannonDebugger: {
    update: () => void
  } | null = null
  if (process.env.NODE_ENV !== 'production') {
    cannonDebugger = CannonDebugger(scene, world, {})
  }

  /**
   * Camera
   */
  const camera = new DefaultCamera({ canvas })
  camera.position.set(25.1, 5, 25.1)
  camera.rotation.set(0, degToRad(-135), 0)
  scene.add(camera)

  /**
   * Controls
   */
  const controls = new CannonKeypadControls(canvas, camera, world, 1.6)
  // const controls = new OrbitControls(camera, canvas)
  // const controls = new FirstPersonControls(camera, canvas)
  const rayControls = new RaycasterControls(canvas, camera)
  rayControls.raycast = (item) => {
    if (item.object.name.slice(0, 5) !== 'frame') return
    if (item.distance > 10) {
      toastManager.addToast('error', '너무 멂')
    } else {
      toastManager.addToast('success', item.object.name)
    }
  }

  /**
   * Light
   */
  const lights: THREE.Light[] = []

  // Ambient light
  const ambientLight = new AmbientLight('white', 0.5)
  scene.add(ambientLight)
  lights.push(ambientLight)

  // Direct Light
  const directionalLight = new DirectionalLight('white', 1.8)
  directionalLight.position.set(110, 220, 110)
  directionalLight.shadow.camera.left = -60
  directionalLight.shadow.camera.right = 60
  directionalLight.shadow.camera.top = 60
  directionalLight.shadow.camera.bottom = -100
  directionalLight.castShadow = true
  scene.add(directionalLight)
  lights.push(directionalLight)

  // Light Helper : Development
  if (process.env.NODE_ENV !== 'production') {
    import('three').then(({ CameraHelper }) => {
      scene.add(new CameraHelper(directionalLight.shadow.camera))
    })
  }

  /**
   * Meshes
   */

  // Array for meshes that affected by physics engine
  const objects: {
    dispose?: () => void
    update?: (delta: number) => void
  }[] = []

  // greeneary floor
  gltfLoader.load(greenaryGlb, (glb) => {
    const mesh = glb.scene.children[0]
    mesh.receiveShadow = true

    const box = new Box3().setFromObject(mesh)
    const { x: width, y: height, z: depth } = box.getSize(new Vector3())

    mesh.position.x += width / 2
    mesh.position.z += depth / 2

    // Add to the container
    scene.add(mesh)

    // Add to data structure
    objects.push({ dispose: () => scene.remove(mesh) })
    controls.floors.push(mesh)
    rayControls.rayItems.push(mesh)
  })

  // ocean: ocean mesh
  const oceanGeometry = new BoxGeometry(530, 5, 530)
  const oceanMaterial = new MeshLambertMaterial({
    color: 0x008cf1,
    side: DoubleSide,
  })
  const ocean = new Mesh(oceanGeometry, oceanMaterial)
  ocean.position.set(55, -3.5, 55)
  scene.add(ocean)
  rayControls.rayItems.push(ocean)
  objects.push({
    dispose: () => {
      oceanGeometry.dispose()
      oceanMaterial.dispose()
      scene.remove(ocean)
    },
  })

  // ocean: ocean cannon body
  const oceanShape1 = new Box(new Vec3(55, 50, 1))
  const oceanBody1 = new Body({
    mass: 0,
    position: new Vec3(55, 0, -1),
    shape: oceanShape1,
  })
  world.addBody(oceanBody1)
  const oceanShape2 = new Box(new Vec3(55, 50, 1))
  const oceanBody2 = new Body({
    mass: 0,
    position: new Vec3(55, 0, 109),
    shape: oceanShape2,
  })
  world.addBody(oceanBody2)
  const oceanShape3 = new Box(new Vec3(1, 50, 55))
  const oceanBody3 = new Body({
    mass: 0,
    position: new Vec3(-1, 0, 55),
    shape: oceanShape3,
  })
  world.addBody(oceanBody3)
  const oceanShape4 = new Box(new Vec3(1, 50, 55))
  const oceanBody4 = new Body({
    mass: 0,
    position: new Vec3(109, 0, 55),
    shape: oceanShape4,
  })
  world.addBody(oceanBody4)
  objects.push({
    dispose: () => {
      world.removeBody(oceanBody1)
      world.removeBody(oceanBody2)
      world.removeBody(oceanBody3)
      world.removeBody(oceanBody4)
    },
  })

  // lake
  const lakeGeometry = new CylinderGeometry(17, 17, 5)
  const lakeMaterial = new MeshLambertMaterial({
    color: 0x0bd3ff,
    side: DoubleSide,
  })
  const lake = new Mesh(lakeGeometry, lakeMaterial)
  lake.position.set(45, -3, 43)
  scene.add(lake)
  rayControls.rayItems.push(lake)
  objects.push({
    dispose: () => {
      lakeGeometry.dispose()
      lakeMaterial.dispose()
      scene.remove(lake)
    },
  })

  // trees
  const trees = new Trees({ container: scene, world, gltfLoader, treeData: TREE_DATA })
  objects.push(trees)
  rayControls.rayItems = [...rayControls.rayItems, ...trees.meshes]

  // frame
  FRAME_DATA.forEach((frameData, idx) => {
    const frame = new Frame({
      name: `frame-${frameList[idx].frameId}`,
      x: frameData.x,
      y: frameData.y,
      z: frameData.z,
      width: FRAME_INFO.width,
      height: FRAME_INFO.height,
      depth: FRAME_INFO.depth,
      container: scene,
      textureLoader,
      baseImg: frameList[idx].framePictureUrl,
    })
    objects.push(frame)
    rayControls.rayItems.push(frame.mesh)
  })

  /**
   * Render canvas
   */
  const clock = new Clock()

  const draw = function renderCanvas() {
    const delta = clock.getDelta()

    // update cannon world
    let step = 1 / 60
    if (delta < 0.01) step = 1 / 120
    world.step(step, delta, 3)

    if (process.env.NODE_ENV !== 'production') {
      cannonDebugger && cannonDebugger.update()
    }

    // update controls
    controls.update(delta)

    // update meshes
    objects.forEach((object) => {
      object.update && object.update(delta)
    })

    // update renderer
    renderer.render(scene, camera)
    renderer.setAnimationLoop(draw)
  }

  draw()

  /**
   * Resize Listener
   */

  const handleSize = function resizeCameraRenderer() {
    // camera resize
    camera.setDefaultAspect()
    camera.updateProjectionMatrix()

    // renderer resize
    renderer.setDefaultSize()
    renderer.render(scene, camera)
  }

  window.addEventListener('resize', handleSize)

  /**
   * Dispose function: Release all the resources
   */
  const dispose = function () {
    lights.forEach((light) => {
      scene.remove(light)
      light.dispose()
    })
    objects.forEach((object) => {
      object.dispose && object.dispose()
    })
    scene.remove(camera)
    renderer.setAnimationLoop(null)
    renderer.dispose()
    controls.dispose()
    window.removeEventListener('resize', handleSize)
  }

  return { dispose }
}

export default greenary

// mesh?: THREE.Mesh
// glb?: THREE.Object3D<THREE.Object3DEventMap>
// material?: THREE.Material
// geometry?: THREE.BufferGeometry
// light?: THREE.Light
// textures?: Record<string, THREE.Texture>
// cannonBody?: Body

//   object.mesh && scene.remove(object.mesh)
//   object.glb && scene.remove(object.glb)
//   object.light && scene.remove(object.light)
//   object.light && object.light.dispose()
//   object.geometry && object.geometry.dispose()
//   object.material && object.material.dispose()
//   if (object.textures) {
//     for (const key in object.textures) {
//       const texture = object.textures[key]
//       texture.dispose()
//     }
//   }
//   object.cannonBody && world.removeBody(object.cannonBody)
