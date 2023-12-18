import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { buildArchitect } from './buildArchitect'
import { buildSky } from '@/libs/three-custom/utils/buildSky'
import { buildSun } from '@/libs/three-custom/utils/buildSun'
import { buildWater } from '@/libs/three-custom/utils/buildWater'
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
    const renderer = new THREE.WebGLRenderer({ canvas })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    // canvas.appendChild(renderer.domElement)

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000)
    camera.position.set(30, 30, 100)

    // Main controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.maxPolarAngle = Math.PI * 0.495
    controls.target.set(0, 10, 0)
    controls.minDistance = 40.0
    controls.maxDistance = 200.0
    controls.update()

    // build Meshes
    const water = buildWater(scene)
    const sky = buildSky(scene, renderer)
    const sun = buildSun(renderer, sky, water, scene)
    const architect = buildArchitect({ scene, loadingManager })

    // light
    const light = new THREE.AmbientLight(0x404040) // soft white light
    scene.add(light)

    // Add Resize Listener
    const handleSize = function resizeCameraRenderer() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleSize)

    // Update canvas
    const clock = new THREE.Clock()

    const draw = function renderCanvas() {
      // Animates our water
      water.material.uniforms['time'].value += 1.0 / 60.0

      // Finally, render our scene
      renderer.render(scene, camera)
      renderer.setAnimationLoop(draw)
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
