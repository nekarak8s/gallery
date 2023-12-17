import { Body, Box, Vec3 } from 'cannon-es'
import {
  AmbientLight,
  Box3,
  BoxGeometry,
  CubeTextureLoader,
  CylinderGeometry,
  DoubleSide,
  DirectionalLight,
  TextureLoader,
  Vector3,
  Mesh,
  MeshLambertMaterial,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { degToRad } from 'three/src/math/MathUtils'
import { Frame } from '../three-custom/items/Frame'
import { Trees } from '../three-custom/items/Trees'
import nx from '@/assets/cubemaps/clear_sky/nx.png'
import ny from '@/assets/cubemaps/clear_sky/ny.png'
import nz from '@/assets/cubemaps/clear_sky/nz.png'
import px from '@/assets/cubemaps/clear_sky/px.png'
import py from '@/assets/cubemaps/clear_sky/py.png'
import pz from '@/assets/cubemaps/clear_sky/pz.png'
import greenaryGlb from '@/assets/glbs/greenary.glb'
import { GalleryTypeProps } from '@/features/gallery/types'

const FRAME_INFO = {
  width: 2,
  height: 2,
  depth: 0.05,
}

const FRAME_DATA = [
  {
    // 1
    x: 40,
    y: 1,
    z: 39,
  },
  {
    // 2
    x: 63,
    y: 4,
    z: 53,
  },
  {
    // 3
    x: 75,
    y: 3,
    z: 27,
  },
  {
    // 4
    x: 100,
    y: 1.7,
    z: 40,
  },
  {
    // 5
    x: 28,
    y: 4,
    z: 66,
  },
  {
    // 6
    x: 64,
    y: 14.6,
    z: 78,
  },
  {
    // 7
    x: 83,
    y: 10,
    z: 80,
  },
  {
    // 8
    x: 37,
    y: 2.4,
    z: 93,
  },
  {
    // 9
    x: 104,
    y: -2.6,
    z: 104,
  },
  {
    // 10
    x: 17,
    y: 1.5,
    z: 28,
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
    // 6
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

const greenary = (props: GalleryTypeProps) => {
  // Loaders
  const textureLoader = new TextureLoader(props.loadingManager)
  const cubeTextureLoader = new CubeTextureLoader(props.loadingManager)
  const gltfLoader = new GLTFLoader(props.loadingManager)

  // set camera position & rotation
  props.controls.setPosition(25.1, 5, 25.1)
  props.controls.setQuaternion(0, degToRad(-135), 0)

  // Set scene background cubemap
  props.scene.background = cubeTextureLoader.load([px, nx, py, ny, pz, nz])

  /**
   * Light
   */
  const lights: THREE.Light[] = []

  // Ambient light
  const ambientLight = new AmbientLight('white', 0.5)
  props.scene.add(ambientLight)
  lights.push(ambientLight)

  // Direct Light
  const directionalLight = new DirectionalLight('white', 1.8)
  directionalLight.position.set(110, 220, 110)
  directionalLight.shadow.camera.left = -60
  directionalLight.shadow.camera.right = 60
  directionalLight.shadow.camera.top = 60
  directionalLight.shadow.camera.bottom = -100
  directionalLight.castShadow = true
  props.scene.add(directionalLight)
  lights.push(directionalLight)

  // Light Helper : Development
  if (process.env.NODE_ENV !== 'production') {
    import('three').then(({ CameraHelper }) => {
      props.scene.add(new CameraHelper(directionalLight.shadow.camera))
    })
  }

  /**
   * Meshes
   */
  const objects: {
    dispose?: () => void
    update?: (delta: number) => void
  }[] = []

  // Greeneary floor
  gltfLoader.load(greenaryGlb, (glb) => {
    const mesh = glb.scene.children[0]
    mesh.receiveShadow = true

    const box = new Box3().setFromObject(mesh)
    const { x: width, y: height, z: depth } = box.getSize(new Vector3())

    mesh.position.x += width / 2
    mesh.position.z += depth / 2

    props.scene.add(mesh)

    objects.push({ dispose: () => props.scene.remove(mesh) })
    props.controls.floors.push(mesh)
    props.rayControls.rayItems.push(mesh)
  })

  // Ocean mesh
  const oceanGeometry = new BoxGeometry(530, 5, 530)
  const oceanMaterial = new MeshLambertMaterial({
    color: 0x008cf1,
    side: DoubleSide,
    opacity: 0.8,
    transparent: true,
  })
  const ocean = new Mesh(oceanGeometry, oceanMaterial)

  ocean.position.set(55, -3.8, 55)
  props.scene.add(ocean)
  props.rayControls.rayItems.push(ocean)

  objects.push({
    dispose: () => {
      oceanGeometry.dispose()
      oceanMaterial.dispose()
      props.scene.remove(ocean)
    },
  })

  // Ocean cannon body
  const oceanShape1 = new Box(new Vec3(55, 50, 1))
  const oceanBody1 = new Body({
    mass: 0,
    position: new Vec3(55, 0, -1),
    shape: oceanShape1,
  })
  props.world.addBody(oceanBody1)

  const oceanShape2 = new Box(new Vec3(55, 50, 1))
  const oceanBody2 = new Body({
    mass: 0,
    position: new Vec3(55, 0, 109),
    shape: oceanShape2,
  })
  props.world.addBody(oceanBody2)

  const oceanShape3 = new Box(new Vec3(1, 50, 55))
  const oceanBody3 = new Body({
    mass: 0,
    position: new Vec3(-1, 0, 55),
    shape: oceanShape3,
  })
  props.world.addBody(oceanBody3)

  const oceanShape4 = new Box(new Vec3(1, 50, 55))
  const oceanBody4 = new Body({
    mass: 0,
    position: new Vec3(109, 0, 55),
    shape: oceanShape4,
  })

  props.world.addBody(oceanBody4)
  objects.push({
    dispose: () => {
      props.world.removeBody(oceanBody1)
      props.world.removeBody(oceanBody2)
      props.world.removeBody(oceanBody3)
      props.world.removeBody(oceanBody4)
    },
  })

  // Lake Mesh
  const lakeGeometry = new CylinderGeometry(17, 17, 5)
  const lakeMaterial = new MeshLambertMaterial({
    color: 0x0bd3ff,
    side: DoubleSide,
    opacity: 0.7,
    transparent: true,
  })
  const lake = new Mesh(lakeGeometry, lakeMaterial)

  lake.position.set(45, -3, 43)
  props.scene.add(lake)
  props.rayControls.rayItems.push(lake)

  objects.push({
    dispose: () => {
      lakeGeometry.dispose()
      lakeMaterial.dispose()
      props.scene.remove(lake)
    },
  })

  // Trees mesh & cannon body
  const trees = new Trees({
    container: props.scene,
    world: props.world,
    gltfLoader,
    treesData: TREE_DATA,
  })
  objects.push(trees)
  props.rayControls.rayItems = [...props.rayControls.rayItems, ...trees.meshes]

  // Frame Mesh
  FRAME_DATA.forEach((frameData, idx) => {
    const frame = new Frame({
      order: idx,
      x: frameData.x,
      y: frameData.y,
      z: frameData.z,
      width: FRAME_INFO.width,
      height: FRAME_INFO.height,
      depth: FRAME_INFO.depth,
      container: props.scene,
      textureLoader,
      baseImg: props.postList[idx].imageUrl,
    })
    objects.push(frame)
    props.rayControls.rayItems.push(frame.mesh)
  })

  /**
   * Update function: Render canvas
   */
  const update = function renderCanvas(delta: number) {
    objects.forEach((object) => {
      object.update && object.update(delta)
    })
  }

  /**
   * Dispose function: Release all the resources
   */
  const dispose = function () {
    lights.forEach((light) => {
      props.scene.remove(light)
      light.dispose()
    })
    objects.forEach((object) => {
      object.dispose && object.dispose()
    })
  }

  return { update, dispose }
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
