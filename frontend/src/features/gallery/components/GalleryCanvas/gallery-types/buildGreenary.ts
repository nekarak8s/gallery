import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { degToRad } from 'three/src/math/MathUtils'
import nx from '@/assets/cubemaps/clear_sky/nx.png'
import ny from '@/assets/cubemaps/clear_sky/ny.png'
import nz from '@/assets/cubemaps/clear_sky/nz.png'
import px from '@/assets/cubemaps/clear_sky/px.png'
import py from '@/assets/cubemaps/clear_sky/py.png'
import pz from '@/assets/cubemaps/clear_sky/pz.png'
import greenaryGlb from '@/assets/glbs/greenary.glb'
import { GalleryTypeProps } from '@/features/gallery/types'
import { Edges } from '@/libs/three-custom/items/Edges'
import { PostFrames } from '@/libs/three-custom/items/PostFrames'
import { Trees } from '@/libs/three-custom/items/Trees'

const buildGreenary = (props: GalleryTypeProps) => {
  // Create Loaders
  const textureLoader = new THREE.TextureLoader(props.loadingManager)
  const cubeTextureLoader = new THREE.CubeTextureLoader(props.loadingManager)
  const gltfLoader = new GLTFLoader(props.loadingManager)

  // Set scene background cubemap
  props.scene.background = cubeTextureLoader.load([px, nx, py, ny, pz, nz])

  /**
   * Light
   */
  const lights: THREE.Light[] = []

  // Ambient light
  const ambientLight = new THREE.AmbientLight('white', 0.8)
  props.scene.add(ambientLight)
  lights.push(ambientLight)

  // Direct Light
  const directLight = new THREE.DirectionalLight('white', 1.8)
  directLight.position.set(110, 220, 110)
  directLight.shadow.camera.left = -60
  directLight.shadow.camera.right = 60
  directLight.shadow.camera.top = 60
  directLight.shadow.camera.bottom = -100
  directLight.castShadow = true
  props.scene.add(directLight)
  lights.push(directLight)

  // Light Helper : Development
  if (process.env.NODE_ENV !== 'production') {
    import('three').then(({ CameraHelper }) => {
      props.scene.add(new CameraHelper(directLight.shadow.camera))
    })
  }

  /**
   * Meshes
   */
  const items: ThreeItem[] = []

  // Greeneary floor
  gltfLoader.load(greenaryGlb, (glb) => {
    const mesh = glb.scene.children[0]
    mesh.receiveShadow = true

    const box = new THREE.Box3().setFromObject(mesh)
    const { x: width, y: height, z: depth } = box.getSize(new THREE.Vector3())

    mesh.position.x += width / 2
    mesh.position.z += depth / 2

    props.scene.add(mesh)
    props.controls.floors.push(mesh)
    props.rayControls.rayItems.push(mesh)

    // Set camera position & rotation by controls
    props.controls.setPosition(25.1, 5, 25.1)
    props.controls.setQuaternion(0, degToRad(-135), 0)

    items.push({
      dispose: () => {
        props.scene.remove(mesh)
      },
    })
  })

  // Ocean meshes
  const oceanGeometry = new THREE.BoxGeometry(1000, 5, 1000)
  const oceanMaterial = new THREE.MeshLambertMaterial({
    color: 0x008cf1,
    side: THREE.DoubleSide,
    opacity: 0.8,
    transparent: true,
  })
  const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial)

  ocean.position.set(55, -3.8, 55)
  props.scene.add(ocean)
  props.rayControls.rayItems.push(ocean)

  items.push({
    dispose: () => {
      oceanGeometry.dispose()
      oceanMaterial.dispose()
      props.scene.remove(ocean)
    },
  })

  // Create edges
  const edges = new Edges({
    container: props.scene,
    edgesData: EDGES_DATA,
  })
  items.push(edges)
  props.controls.obstacles.push(edges.mesh)

  // Create lake
  const lakeGeometry = new THREE.CylinderGeometry(17, 17, 5)
  const lakeMaterial = new THREE.MeshLambertMaterial({
    color: 0x0bd3ff,
    side: THREE.DoubleSide,
    opacity: 0.7,
    transparent: true,
  })
  const lake = new THREE.Mesh(lakeGeometry, lakeMaterial)

  lake.position.set(45, -3, 43)
  props.scene.add(lake)
  props.rayControls.rayItems.push(lake)

  items.push({
    dispose: () => {
      lakeGeometry.dispose()
      lakeMaterial.dispose()
      props.scene.remove(lake)
    },
  })

  // Create Trees
  const trees = new Trees({
    container: props.scene,
    gltfLoader,
    treesData: TREE_DATA,
    onLoad: (tree: THREE.Object3D) => {
      props.rayControls.rayItems.push(tree)
      props.controls.obstacles.push(tree)
    },
  })
  items.push(trees)

  // Create PostFrames
  const frames = new PostFrames({
    container: props.scene,
    textureLoader,
    postList: props.postList,
    framesData: FRAMES_DATA,
  })
  items.push(frames)
  frames.meshes.forEach((mesh) => {
    props.rayControls.rayItems.push(mesh)
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

export default buildGreenary

const FRAME_INFO = {
  width: 2,
  height: 2,
  depth: 0.05,
}

const FRAMES_DATA = [
  {
    // 1
    x: 40,
    y: 1,
    z: 39,
    width: FRAME_INFO.width,
    height: FRAME_INFO.height,
    depth: FRAME_INFO.depth,
  },
  {
    // 2
    x: 63,
    y: 4,
    z: 53,
    width: FRAME_INFO.width,
    height: FRAME_INFO.height,
    depth: FRAME_INFO.depth,
  },
  {
    // 3
    x: 75,
    y: 3,
    z: 27,
    width: FRAME_INFO.width,
    height: FRAME_INFO.height,
    depth: FRAME_INFO.depth,
  },
  {
    // 4
    x: 100,
    y: 1.7,
    z: 40,
    width: FRAME_INFO.width,
    height: FRAME_INFO.height,
    depth: FRAME_INFO.depth,
  },
  {
    // 5
    x: 28,
    y: 4,
    z: 66,
    width: FRAME_INFO.width,
    height: FRAME_INFO.height,
    depth: FRAME_INFO.depth,
  },
  {
    // 6
    x: 64,
    y: 14.6,
    z: 78,
    width: FRAME_INFO.width,
    height: FRAME_INFO.height,
    depth: FRAME_INFO.depth,
  },
  {
    // 7
    x: 83,
    y: 10,
    z: 80,
    width: FRAME_INFO.width,
    height: FRAME_INFO.height,
    depth: FRAME_INFO.depth,
  },
  {
    // 8
    x: 37,
    y: 2.4,
    z: 93,
    width: FRAME_INFO.width,
    height: FRAME_INFO.height,
    depth: FRAME_INFO.depth,
  },
  {
    // 9
    x: 104,
    y: -2.6,
    z: 104,
    width: FRAME_INFO.width,
    height: FRAME_INFO.height,
    depth: FRAME_INFO.depth,
  },
  {
    // 10
    x: 17,
    y: 1.5,
    z: 28,
    width: FRAME_INFO.width,
    height: FRAME_INFO.height,
    depth: FRAME_INFO.depth,
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

const EDGES_DATA = [
  { width: 120, height: 100, depth: 1, x: 55, y: 0, z: -1 },
  { width: 120, height: 100, depth: 1, x: 55, y: 0, z: 109 },
  { width: 1, height: 100, depth: 120, x: -1, y: 0, z: 55 },
  { width: 1, height: 100, depth: 120, x: 109, y: 0, z: 55 },
]
