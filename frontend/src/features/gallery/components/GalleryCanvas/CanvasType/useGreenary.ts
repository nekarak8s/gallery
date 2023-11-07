import { useEffect } from 'react'
import * as THREE from 'three'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'
import { Floor } from './Floor'
import { Frame } from './Frame'
import { Wall } from './Wall'
import nx from '@/assets/cubemaps/clear_sky/nx.png'
import ny from '@/assets/cubemaps/clear_sky/ny.png'
import nz from '@/assets/cubemaps/clear_sky/nz.png'
import px from '@/assets/cubemaps/clear_sky/px.png'
import py from '@/assets/cubemaps/clear_sky/py.png'
import pz from '@/assets/cubemaps/clear_sky/pz.png'

interface GreenaryProps {
  placeId: number
  containerRef: React.RefObject<HTMLDivElement>
  canvasRef: React.RefObject<HTMLCanvasElement>
  gallery: Gallery
  frameList: TFrame[]
}

const UNIT = {
  WALL_DEPTH: 0.2,
  WALL_HEIGHT: 3,
  GLASS_WALL_DEPTH: 0.1,
  FRAME_HEIGHT: 2,
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
  { x: 10.34, z: 17.43, width: 0.77 },
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
  { x: 0, z: 20.78, width: 6.53 },
  { x: 9.57, z: 20.78, width: 0.77 },
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
  { x: 19.22, z: 23.88, width: 0.77 },
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
  { x: 15.12, z: 26.98, width: 4.88 },
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
  {
    x: 10.34,
    z: 13.42,
    width: 16.62,
    frames: [
      {
        order: 10,
        x: -5,
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

const useGreenary = ({
  placeId,
  containerRef,
  canvasRef,
  gallery,
  frameList,
}: GreenaryProps) => {
  console.log(gallery, frameList)

  useEffect(() => {
    /**
     * Filter
     */
    if (gallery.place.placeId !== placeId) return

    const container = containerRef.current!
    const canvas = canvasRef.current!

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    /**
     * Scene
     */
    const cubeTextureLoader = new THREE.CubeTextureLoader()
    const scene = new THREE.Scene()
    scene.background = cubeTextureLoader.load([px, nx, py, ny, pz, nz])

    /**
     * Camera
     */
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    )
    camera.position.x = 7
    camera.position.y = 1.6
    camera.position.z = 29
    scene.add(camera)

    /**
     * Controls
     */
    const controls = new FirstPersonControls(camera, renderer.domElement)
    controls.movementSpeed = 2
    controls.lookSpeed = 0.1

    /**
     * Light
     */
    const ambientLight = new THREE.AmbientLight('white', 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight('white', 1)
    directionalLight.position.set(30, 30, 0)
    directionalLight.shadow.camera.left = -30
    directionalLight.shadow.camera.right = 0
    directionalLight.shadow.camera.top = 0
    directionalLight.shadow.camera.bottom = -20
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // LightHelper
    const helper = new THREE.CameraHelper(directionalLight.shadow.camera)
    scene.add(helper)

    /**
     * Floor Mesh
     */
    const floor = new Floor({
      container: scene,
      name: 'floor',
      width: 20,
      depth: 30,
      repeatX: 4,
      repeatY: 6,
    })

    /**
     * Wall Mesh
     */
    HORIZONTAL_WALLS.forEach(({ x, z, width, frames = [] }, idx) => {
      const wall = new Wall({
        container: scene,
        name: `horizontal_wall_${idx + 1}`,
        x,
        z,
        width,
        height: UNIT.WALL_HEIGHT,
        depth: UNIT.WALL_DEPTH,
        repeatX: width * 3,
        repeatY: UNIT.WALL_HEIGHT * 3,
      })
      frames.forEach((frame) => {
        new Frame({
          container: wall.mesh,
          name: `frame_${frame.order}`,
          baseImg: frameList[frame.order - 1].framePictureUrl,
          x: frame.x,
          y: UNIT.FRAME_HEIGHT - UNIT.WALL_HEIGHT / 2,
          isDownRight: frame.isDownRight,
        })
      })
    })

    VERTICAL_WALLS.forEach(({ x, z, width, frames = [] }, idx) => {
      const wall = new Wall({
        container: scene,
        name: `vertical_wall_${idx + 1}`,
        direction: 'vertical',
        x,
        z,
        width,
        height: UNIT.WALL_HEIGHT,
        depth: UNIT.WALL_DEPTH,
        repeatX: width * 3,
        repeatY: UNIT.WALL_HEIGHT * 3,
      })
      frames.forEach((frame) => {
        new Frame({
          container: wall.mesh,
          name: `frame_${frame.order}`,
          baseImg: frameList[frame.order - 1].framePictureUrl,
          x: frame.x,
          y: UNIT.FRAME_HEIGHT - UNIT.WALL_HEIGHT / 2,
          isDownRight: frame.isDownRight,
        })
      })
    })

    VERTICAL_GLASS_WALLS.forEach(({ x, z, width }, idx) => {
      new Wall({
        container: scene,
        name: `vertical_glass_wall_${idx + 1}`,
        direction: 'vertical',
        x,
        z,
        width,
        height: UNIT.WALL_HEIGHT,
        depth: UNIT.GLASS_WALL_DEPTH,
        noTexture: true,
        color: '#ffffff',
        transparent: true,
        opacity: 0.2,
      })
    })

    /**
     * dat.gui
     */
    if (process.env.NODE_ENV !== 'production') {
      import('dat.gui').then((dat) => {
        const gui = new dat.GUI()
      })
    }

    /**
     * Render
     */
    const clock = new THREE.Clock()

    function draw() {
      const delta = clock.getDelta()
      controls.update(delta)
      renderer.render(scene, camera) // rerender
      renderer.setAnimationLoop(draw)
    }

    /**
     * Resize & Event Listener
     */

    function setSize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.render(scene, camera)
    }

    window.addEventListener('resize', setSize)

    draw()

    return () => {
      window.removeEventListener('resize', setSize)
    }
  }, [])
}

export default useGreenary
