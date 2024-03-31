import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { degToRad } from 'three/src/math/MathUtils'
import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh'
import { FRAMES_DATA } from './greenaryData'
import nx from '@/assets/cubemaps/clear_sky/nx.png'
import ny from '@/assets/cubemaps/clear_sky/ny.png'
import nz from '@/assets/cubemaps/clear_sky/nz.png'
import px from '@/assets/cubemaps/clear_sky/px.png'
import py from '@/assets/cubemaps/clear_sky/py.png'
import pz from '@/assets/cubemaps/clear_sky/pz.png'
import hexagonGlb from '@/assets/glbs/free_low_poly_game_assets.glb'
import { GalleryTypeProps } from '@/features/gallery/types'
import { Floor } from '@/libs/three-custom/items/Floor'
import { PostFrames } from '@/libs/three-custom/items/PostFrames'

THREE.Mesh.prototype.raycast = acceleratedRaycast

const buildHexagon = (props: GalleryTypeProps) => {
  // Create Loaders
  const cubeTextureLoader = new THREE.CubeTextureLoader(props.loadingManager)
  const textureLoader = new THREE.TextureLoader(props.loadingManager)
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
  directLight.position.set(0, 110, 110)
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
  const hexagon = Hexagon.build(props.scene, gltfLoader).then((hexagon) => {
    props.controls.floors.push(hexagon.terrain)
    props.controls.obstacles.push(hexagon.terrain)

    props.rayControls.rayItems.push(hexagon.terrain)

    // Set camera position & rotation by controls
    props.controls.setPosition(25.1, 50, 25.1)
    props.controls.setQuaternion(0, degToRad(0), 0)

    directLight.target = hexagon.terrain

    items.push(hexagon)
    return hexagon
  })

  const ocean = new Floor({
    container: props.scene,
    color: 0x7abfff,
    isPlane: true,
    width: 10000,
    depth: 10000,
    x: -500,
    y: 0.5,
    z: -500,
  })
  items.push(ocean)

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

export default buildHexagon

type HexagonProps = {
  container: THREE.Mesh | THREE.Scene
  terrain: THREE.Object3D
  animation: THREE.AnimationClip
}

export class Hexagon {
  type: string = 'hexagon'
  terrain: THREE.Object3D
  mixer: THREE.AnimationMixer
  update: (delta: number) => void
  dispose: () => void

  constructor(props: HexagonProps) {
    if (!props) {
      throw new Error("Cannot be called directly. Uses static 'build' method")
    }

    this.terrain = props.terrain
    props.container.add(this.terrain)

    this.mixer = new THREE.AnimationMixer(props.terrain)
    const idle = this.mixer.clipAction(props.animation)

    idle.play()
    this.update = (delta: number) => {
      this.mixer.update(delta)
    }

    this.dispose = () => {
      props.container.remove(this.terrain)
    }
  }

  // Construct asynchronously
  static async build(container: THREE.Mesh | THREE.Scene, gltfLoader: GLTFLoader) {
    // Load GLTF
    const glb: GLTF = await new Promise((resolve, reject) => {
      gltfLoader.load(hexagonGlb, (glb) => resolve(glb), undefined, reject)
    })

    console.log('glb', glb)
    // Extract glbs

    const animation = glb.animations[0]
    const terrain = glb.scene.children[0]
    terrain.scale.set(7, 7, 7)

    terrain.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true
        obj.receiveShadow = true
        obj.geometry.boundsTree = new MeshBVH(obj.geometry) // eslint-disable-line
      }
    })
    // const edges = glb.scene.children[3]
    // const ocean = glb.scene.children[2]
    // const lake = glb.scene.children[1]
    // const terrain = glb.scene.children[0]
    // if (terrain instanceof THREE.Mesh) {
    //   terrain.geometry.boundsTree = new MeshBVH(terrain.geometry) // eslint-disable-line
    // }
    // terrain.receiveShadow = true

    return new Hexagon({ container, terrain, animation })
  }
}
