import { Body, SAPBroadphase, World } from 'cannon-es'
import {
  AmbientLight,
  Clock,
  CubeTextureLoader,
  DirectionalLight,
  MathUtils,
  Object3D,
  Scene,
  TextureLoader,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DefaultCamera } from '../three-custom/cameras/DefaultCamera'
import { CannonKeypadControls } from '../three-custom/controls/CannonKeypadControls'
import { Floor } from '../three-custom/meshes/Floor'
import { Frame } from '../three-custom/meshes/Frame'
import { PanelLighting } from '../three-custom/meshes/PanelLighting'
import { SimplePointLighting } from '../three-custom/meshes/SimplePointLighting'
import { SpotLighting } from '../three-custom/meshes/SpotLighting'
import { Wall } from '../three-custom/meshes/Wall'
import { DefaultRenderer } from '../three-custom/renderers/DefaultRenderer'
import nx from '@/assets/cubemaps/clear_sky/nx.png'
import ny from '@/assets/cubemaps/clear_sky/ny.png'
import nz from '@/assets/cubemaps/clear_sky/nz.png'
import px from '@/assets/cubemaps/clear_sky/px.png'
import py from '@/assets/cubemaps/clear_sky/py.png'
import pz from '@/assets/cubemaps/clear_sky/pz.png'
import floorAmbientImg from '@/assets/textures/wood_herringbone/Wood_Herringbone_Tiles_001_ambientOcclusion.jpg'
import floorBaseImg from '@/assets/textures/wood_herringbone/Wood_Herringbone_Tiles_001_basecolor.jpg'
import floorNormalImg from '@/assets/textures/wood_herringbone/Wood_Herringbone_Tiles_001_normal.jpg'

const WALL_INFO = {
  color: '#fffeef',
  depth: 0.2,
  height: 4.5,
}

const GLASS_WALL_INFO = {
  depth: 0.1,
  height: 4.5,
  transparent: true,
  opacity: 0.2,
}

const FRAME_INFO = {
  y: 2.5,
  width: 1.5,
  height: 1.5,
  depth: 0.05,
}

const SPOTLIGHT_INFO = {
  color: '#FFFFFF',
  intensity: 8,
  distance: 4,
  angle: Math.PI / 8,
  z: 3,
}

const PANELLIGHT_INFO = {
  color: '#FFFCE5',
  intensity: 0.6,
  y: WALL_INFO.height,
  width: 1,
  height: 0.01,
  depth: 1,
}

const POINTLIGHT_INFO = {
  color: '#FFFCE5',
  intensity: 0.1,
  distance: 5,
  y: WALL_INFO.height,
  width: 0.07,
  height: 0.02,
}

const HORIZONTAL_WALLS = [
  {
    x: 0,
    z: 0,
    width: 20,
    frames: [
      {
        order: 5,
        x: -8,
        isDownRight: true,
      },
    ],
  },
  {
    x: 3.8,
    z: 13.52,
    width: 6.54,
    frames: [
      {
        order: 3,
        x: 0,
        isDownRight: true,
      },
      {
        order: 7,
        x: 0,
        isDownRight: false,
      },
    ],
  },
  // { x: 10.34, z: 17.43, width: 0.77 },
  {
    x: 13.53,
    z: 17.43,
    width: 6.47,
    frames: [
      {
        order: 8,
        x: 0,
        isDownRight: false,
      },
    ],
  },
  // { x: 0, z: 20.78, width: 6.53 },
  // { x: 9.57, z: 20.78, width: 0.77 },
  {
    x: 10.34,
    z: 23.88,
    width: 6.56,
    frames: [
      {
        order: 9,
        x: 0,
        isDownRight: false,
      },
    ],
  },
  // { x: 19.22, z: 23.88, width: 0.77 },
  {
    x: 4.34,
    z: 25.96,
    width: 6,
    frames: [
      {
        order: 2,
        x: 0,
        isDownRight: false,
      },
    ],
  },
  // { x: 15.12, z: 26.98, width: 4.88 },
  { x: 0, z: 30, width: 20 },
]

const VERTICAL_WALLS = [
  {
    x: 0,
    z: 0,
    width: 30,
    frames: [
      {
        order: 1,
        x: -10,
        isDownRight: true,
      },
      {
        order: 4,
        x: -2,
        isDownRight: true,
      },
    ],
  },
  {
    x: 3.9,
    z: 2.69,
    width: 10.83,
    frames: [
      {
        order: 6,
        x: 1,
        isDownRight: true,
      },
    ],
  },
  { x: 20, z: 0, width: 1 },
  { x: 20, z: 16.63, width: 1.6 },
  { x: 20, z: 23, width: 7 },
]

const VERTICAL_GLASS_WALLS = [
  { x: 20, z: 0.95, width: 15.68 },
  { x: 20, z: 18.23, width: 4.77 },
]

const PANELLIGHTS: {
  x: number
  z: number
}[] = [
  // { x: 5, z: 16.7 },
  // { x: 5, z: 23.1 },
  // { x: 8.5, z: 3.5 },
  // { x: 8.5, z: 9.2 },
  // { x: 15.6, z: 3.5 },
  // { x: 15.6, z: 9.2 },
  // { x: 15.6, z: 14.6 },
  // { x: 15.6, z: 20.4 },
]

const POINTLIGHTS: {
  x: number
  z: number
}[] = [
  // { x: 1.8, z: 3.4 },
  // { x: 1.8, z: 7.2 },
  // { x: 1.8, z: 11 },
  // { x: 1.8, z: 25.9 },
  // { x: 7.2, z: 27.9 },
  // { x: 13.2, z: 25.5 },
  // { x: 13.2, z: 28.5 },
]

const greenary = ({ canvas, loadingManager, gallery, frameList }: GalleryTypeProps) => {
  console.log(gallery)
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
  // world.gravity.set(0, -10, 0)

  /**
   * Camera
   */
  const camera = new DefaultCamera({ canvas })
  camera.position.set(3, 1.6, 29)
  scene.add(camera)

  /**
   * Controls
   */
  // const controls = new OrbitControls(camera, canvas)
  // const controls = new FirstPersonControls(camera, canvas)
  const controls = new CannonKeypadControls(camera, world, 1.6)

  /**
   * Light
   */
  const lights: THREE.Light[] = []

  // Ambient light
  const ambientLight = new AmbientLight('white', 0.5)
  scene.add(ambientLight)
  lights.push(ambientLight)

  // Direct Light
  const directionalLight = new DirectionalLight('white', 2)
  directionalLight.position.set(0, 40, 60)
  directionalLight.target = new Object3D()
  directionalLight.target.position.set(40, -30, -10)
  directionalLight.shadow.camera.left = -30
  directionalLight.shadow.camera.right = 0
  directionalLight.shadow.camera.top = 5
  directionalLight.shadow.camera.bottom = -20
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
    mesh?: THREE.Mesh
    glb?: THREE.Group<THREE.Object3DEventMap>
    material?: THREE.Material
    geometry?: THREE.BufferGeometry
    light?: THREE.Light
    textures?: Record<string, THREE.Texture>
    cannonBody?: Body
  }[] = []

  // Floor mesh
  const floor = new Floor({
    container: scene,
    world,
    name: 'floor',
    width: 20,
    depth: 30,
    texture: {
      textureLoader,
      baseImg: floorBaseImg,
      normalImg: floorNormalImg,
      ambientImg: floorAmbientImg,
      // roughImg: floorRoughImg,
      repeatX: 4,
      repeatY: 6,
    },
  })
  objects.push(floor)

  // Ceiling mesh
  // const ceiling = new Ceiling({
  //   container: scene,
  //   world,
  //   name: 'ceiling',
  //   width: 20,
  //   depth: 30,
  //   y: WALL_INFO.height,
  // })
  // objects.push(ceiling)

  // Horizontal Wall & Frame & SpotLighting mesh
  HORIZONTAL_WALLS.forEach((wallInfo, idx) => {
    const wall = new Wall({
      ...WALL_INFO,
      container: scene,
      world,
      name: `horizontal-wall-${idx + 1}`,
      x: wallInfo.x,
      z: wallInfo.z,
      width: wallInfo.width,
    })
    objects.push(wall)
    wallInfo.frames &&
      wallInfo.frames.forEach((frameInfo) => {
        const frame = new Frame({
          ...FRAME_INFO,
          container: wall.mesh,
          name: `frame_${frameInfo.order}`,
          baseImg: frameList[frameInfo.order - 1].framePictureUrl,
          textureLoader,
          x: frameInfo.x,
          y: FRAME_INFO.y - WALL_INFO.height / 2,
          z: frameInfo.isDownRight ? WALL_INFO.depth / 2 : -WALL_INFO.depth / 2,
          rotationY: frameInfo.isDownRight ? 0 : MathUtils.degToRad(180),
        })
        objects.push(frame)
        const spotLight = new SpotLighting({
          ...SPOTLIGHT_INFO,
          container: frame.mesh,
          name: 'spotlight',
          gltfLoader,
          targetMesh: frame.mesh,
          y: WALL_INFO.height - FRAME_INFO.y,
        })
        objects.push(spotLight)
      })
  })

  // Vertical Wall & Frame & SpotLighting mesh
  VERTICAL_WALLS.forEach((wallInfo, idx) => {
    const wall = new Wall({
      ...WALL_INFO,
      container: scene,
      name: `vertical-wall-${idx + 1}`,
      world,
      x: wallInfo.x,
      z: wallInfo.z,
      width: wallInfo.width,
      rotationY: MathUtils.degToRad(90),
    })
    objects.push(wall)
    wallInfo.frames &&
      wallInfo.frames.forEach((frameInfo) => {
        const frame = new Frame({
          ...FRAME_INFO,
          container: wall.mesh,
          name: `frame_${frameInfo.order}`,
          baseImg: frameList[frameInfo.order - 1].framePictureUrl,
          textureLoader,
          x: frameInfo.x,
          y: FRAME_INFO.y - WALL_INFO.height / 2,
          z: frameInfo.isDownRight ? WALL_INFO.depth / 2 : -WALL_INFO.depth / 2,
          rotationY: frameInfo.isDownRight ? 0 : MathUtils.degToRad(180),
        })
        objects.push(frame)
        const spotLight = new SpotLighting({
          ...SPOTLIGHT_INFO,
          container: frame.mesh,
          name: 'spotlight',
          gltfLoader,
          targetMesh: frame.mesh,
          y: WALL_INFO.height - FRAME_INFO.y,
        })
        objects.push(spotLight)
      })
  })

  // Glass Wall & Frame & SpotLighting mesh
  VERTICAL_GLASS_WALLS.forEach((wallInfo, idx) => {
    const wall = new Wall({
      ...GLASS_WALL_INFO,
      container: scene,
      name: `vertical-glass-wall-${idx + 1}`,
      world,
      x: wallInfo.x,
      z: wallInfo.z,
      width: wallInfo.width,
      rotationY: MathUtils.degToRad(90),
    })
    objects.push(wall)
  })

  // PanelLighting mesh
  PANELLIGHTS.forEach((panelLightInfo, idx) => {
    const panelLight = new PanelLighting({
      ...PANELLIGHT_INFO,
      container: scene,
      name: `panellight-${idx + 1}`,
      x: panelLightInfo.x,
      z: panelLightInfo.z,
    })
    objects.push(panelLight)
  })

  // PointLighting mesh
  POINTLIGHTS.forEach((pointLightInfo, idx) => {
    const pointLight = new SimplePointLighting({
      ...POINTLIGHT_INFO,
      container: scene,
      name: `pointlight-${idx + 1}`,
      x: pointLightInfo.x,
      z: pointLightInfo.z,
    })
    objects.push(pointLight)
  })

  /**
   * dat.gui : Development
   */
  if (process.env.NODE_ENV !== 'production') {
    import('dat.gui').then((dat) => {
      const gui = new dat.GUI()
    })
  }

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
      object.mesh && scene.remove(object.mesh)
      object.glb && scene.remove(object.glb)
      object.light && scene.remove(object.light)
      object.light && object.light.dispose()
      object.geometry && object.geometry.dispose()
      object.material && object.material.dispose()
      if (object.textures) {
        for (const key in object.textures) {
          const texture = object.textures[key]
          texture.dispose()
        }
      }
      object.cannonBody && world.removeBody(object.cannonBody)
    })
    scene.remove(camera)
    renderer.dispose()
    controls.dispose()
    window.removeEventListener('resize', handleSize)
  }

  return { dispose }
}

export default greenary
