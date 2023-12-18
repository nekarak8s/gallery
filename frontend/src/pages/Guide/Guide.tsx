import { useEffect, useRef, useState } from 'react'
import { SAPBroadphase, World } from 'cannon-es'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { buildSky } from './utils/buildSky'
import { buildWater } from './utils/buildWater'
import { DefaultCamera } from '@/features/gallery/components/GalleryCanvas/three-custom/cameras/DefaultCamera'
import { DefaultRenderer } from '@/features/gallery/components/GalleryCanvas/three-custom/renderers/DefaultRenderer'
import './Guide.scss'

const Guide = () => {
  /**
   * Render the Three.js canvas
   */
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [requiredCount, setRequiredCount] = useState(0)
  const [loadedCount, setLoadedCount] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current!

    // loadingManager
    const loadingManager = new THREE.LoadingManager()
    loadingManager.onStart = function increaseLoadCount() {
      setRequiredCount((cnt) => cnt + 1)
    }
    loadingManager.onLoad = function decreaseLoadCount() {
      setLoadedCount((cnt) => cnt + 1)
    }

    // Renderer
    const renderer = new DefaultRenderer({ canvas, antialias: true })

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new DefaultCamera({ canvas, near: 1, far: 20000 })
    camera.position.set(20, 10, 30)
    scene.add(camera)

    console.log(camera.position)

    // Cannon world
    const world = new World()
    world.broadphase = new SAPBroadphase(world)

    // Main controls
    const controls = new OrbitControls(camera, canvas)

    // build Meshes
    const water = buildWater(scene)
    buildSky(scene)

    // light
    const light = new THREE.AmbientLight(0x404040) // soft white light
    scene.add(light)

    // box
    // const geometry = new THREE.BoxGeometry(10, 10, 10)
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    // const cube = new THREE.Mesh(geometry, material)
    // scene.add(cube)

    // Add Resize Listener
    const handleSize = function resizeCameraRenderer() {
      // camera resize
      camera.setDefaultAspect()
      camera.updateProjectionMatrix()

      // renderer resize
      renderer.setDefaultSize()
      renderer.render(scene, camera)
    }

    window.addEventListener('resize', handleSize)

    // Update canvas
    const clock = new THREE.Clock()

    const draw = function renderCanvas() {
      const delta = clock.getDelta()

      // Update renderer
      renderer.render(scene, camera)
      renderer.setAnimationLoop(draw)

      // Update controls
      controls.update(delta)
    }

    draw()

    // Clean-up function: Release resources
    return () => {
      setRequiredCount(0)
      setLoadedCount(0)

      scene.remove(camera)
      renderer.setAnimationLoop(null)
      renderer.dispose()
      controls.dispose()

      window.removeEventListener('resize', handleSize)
    }
  }, [])

  return (
    <div className="guide">
      <canvas ref={canvasRef} />
      {/* <CSSTransition
        className="guide__loading"
        isShow={requiredCount !== loadedCount}
        duration={1000}
        timingFunction="ease-in-out"
      >
        <Loading />
      </CSSTransition> */}
    </div>
  )
}

export default Guide
