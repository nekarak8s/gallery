import { SAPBroadphase, World } from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'
import {
  AmbientLight,
  Clock,
  CubeTextureLoader,
  DirectionalLight,
  Object3D,
  Scene,
  TextureLoader,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DefaultCamera } from '../three-custom/cameras/DefaultCamera'
import { CannonKeypadControls } from '../three-custom/controls/CannonKeypadControls'
import { Tree } from '../three-custom/meshes/Tree'
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

const TREE_DATA = [
  {
    type: 0,
    x: 1,
    y: 0,
    z: -10,
    scale: 2,
  },
  {
    type: 1,
    x: 5,
    y: 0,
    z: -10,
    scale: 1.5,
  },
  {
    type: 2,
    x: 8,
    y: 0,
    z: -10,
    scale: 1,
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
  world.gravity.set(0, -70, 0)

  // Cannon Helper : Development
  const cannonDebugger = CannonDebugger(scene, world, {})

  /**
   * Camera
   */
  const camera = new DefaultCamera({ canvas })
  camera.position.set(3, 1.6, 29)
  scene.add(camera)

  /**
   * Controls
   */
  const floors: THREE.Object3D<THREE.Object3DEventMap>[] = []
  const controls = new CannonKeypadControls(camera, world, 1.6, floors)
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
  directionalLight.position.set(0, 40, 60)
  directionalLight.target = new Object3D()
  directionalLight.target.position.set(40, -30, -10)
  directionalLight.shadow.camera.left = -50
  directionalLight.shadow.camera.right = 20
  directionalLight.shadow.camera.top = 25
  directionalLight.shadow.camera.bottom = -40
  directionalLight.castShadow = true
  scene.add(directionalLight)
  scene.add(directionalLight.target)
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
    // mesh?: THREE.Mesh
    // glb?: THREE.Object3D<THREE.Object3DEventMap>
    // material?: THREE.Material
    // geometry?: THREE.BufferGeometry
    // light?: THREE.Light
    // textures?: Record<string, THREE.Texture>
    // cannonBody?: Body
  }[] = []

  // greeneary floor
  gltfLoader.load(greenaryGlb, (glb) => {
    const mesh = glb.scene.children[0]
    mesh.receiveShadow = true

    /**
     * Get size
     */
    // const box = new Box3().setFromObject(glb.scene)
    // const size = box.getSize(new Vector3())
    // console.log(size.x, size.y, size.z)

    /**
     * Add to the container
     */
    scene.add(mesh)

    /**
     * Add to data structure
     */
    objects.push({ dispose: () => scene.remove(mesh) })
    floors.push(mesh)
  })

  const tree = new Tree({ container: scene, world, gltfLoader, treeInfo: TREE_DATA })
  objects.push(tree)

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
    cannonDebugger.update() // Update the CannonDebugger meshes

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
