import { SAPBroadphase, World } from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'
import {
  AmbientLight,
  Box3,
  BoxGeometry,
  Clock,
  CubeTextureLoader,
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
import { Flowers } from '../three-custom/meshes/Flowers'
import { Trees } from '../three-custom/meshes/Trees'
import { DefaultRenderer } from '../three-custom/renderers/DefaultRenderer'
import nx from '@/assets/cubemaps/clear_sky/nx.png'
import ny from '@/assets/cubemaps/clear_sky/ny.png'
import nz from '@/assets/cubemaps/clear_sky/nz.png'
import px from '@/assets/cubemaps/clear_sky/px.png'
import py from '@/assets/cubemaps/clear_sky/py.png'
import pz from '@/assets/cubemaps/clear_sky/pz.png'
import greenaryGlb from '@/assets/glbs/greenary.glb'

const WALL_INFO = {
  color: '#fffeef',
  depth: 0.2,
  height: 4.5,
}

const FRAME_INFO = {
  y: 2.5,
  width: 1.5,
  height: 1.5,
  depth: 0.05,
}

const LEFT_FOREST_TREE = [
  {
    type: 0,
    x: 66.7,
    y: 0,
    z: 17.6,
    scale: 1.5,
  },
  {
    type: 0,
    x: 76.5,
    y: 0,
    z: 17.1,
    scale: 2,
  },
  {
    type: 0,
    x: 61.2,
    y: 0,
    z: 18.6,
    scale: 1.5,
  },
  {
    type: 0,
    x: 58.2,
    y: 1,
    z: 23.7,
    scale: 1,
  },
  {
    type: 0,
    x: 63.2,
    y: 0,
    z: 27.3,
    scale: 2,
  },

  {
    type: 0,
    x: 60.7,
    y: 0,
    z: 27.3,
    scale: 2,
  },
  {
    type: 0,
    x: 63.2,
    y: 0,
    z: 43.3,
    scale: 2,
  },
]

const MOUNTAIN_TREE = [
  {
    type: 1,
    x: 62.7,
    y: 2,
    z: 57,
    scale: 2,
  },
  {
    type: 2,
    x: 54,
    y: 3,
    z: 60,
    scale: 2,
  },
]

const TREE_DATA = [...LEFT_FOREST_TREE, ...MOUNTAIN_TREE]

const FLOWER_DATA = [
  {
    type: 3,
    x: 50.4,
    y: 4.2,
    z: 64.2,
    scale: 2,
  },
  {
    type: 1,
    x: 30.4,
    y: 1.2,
    z: 34.2,
    scale: 2,
  },
  {
    type: 2,
    x: 40.4,
    y: 1,
    z: 54.2,
    scale: 2,
  },
]

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
  camera.position.set(23.1, 5, 23.1)
  camera.rotation.set(0, degToRad(-135), 0)
  scene.add(camera)

  /**
   * Controls
   */
  const controls = new CannonKeypadControls(camera, world, 1.6)
  // const controls = new OrbitControls(camera, canvas)
  // const controls = new FirstPersonControls(camera, canvas)

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
  })

  // ocean
  const oceanGeometry = new BoxGeometry(130, 5, 130)
  const oceanMaterial = new MeshLambertMaterial({
    color: 0x00000ff,
    transparent: true,
    opacity: 0.5,
    side: DoubleSide,
  })
  const ocean = new Mesh(oceanGeometry, oceanMaterial)
  ocean.position.set(65, -3, 65)
  scene.add(ocean)
  objects.push({
    dispose: () => {
      oceanGeometry.dispose()
      oceanMaterial.dispose()
      scene.remove(ocean)
    },
  })

  // trees
  const trees = new Trees({ container: scene, world, gltfLoader, treeData: TREE_DATA })
  objects.push(trees)

  // flowers
  const flowers = new Flowers({ container: scene, gltfLoader, flowerData: FLOWER_DATA })
  objects.push(flowers)

  // lake
  // const lakeGeometry = new CylinderGeometry(17, 17, 5)
  // const lakeMaterial = new MeshLambertMaterial({
  //   color: 0x0bd3ff,
  //   transparent: true,
  //   opacity: 0.5,
  //   side: DoubleSide,
  // })
  // const lake = new Mesh(lakeGeometry, lakeMaterial)
  // lake.position.set(45, -3, 43)
  // scene.add(lake)
  // objects.push({
  //   dispose: () => {
  //     lakeGeometry.dispose()
  //     lakeMaterial.dispose()
  //     scene.remove(lake)
  //   },
  // })

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
