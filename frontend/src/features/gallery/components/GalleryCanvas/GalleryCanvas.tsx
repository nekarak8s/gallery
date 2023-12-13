import { useEffect, useRef, useState } from 'react'
import { SAPBroadphase, World } from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'
import * as THREE from 'three'
import greenary from './gallery-types/greenary'
import './GalleryCanvas.scss'
import { DefaultCamera } from './three-custom/cameras/DefaultCamera'
import { CannonKeypadControls } from './three-custom/controls/CannonKeypadControls'
import { RaycasterControls } from './three-custom/controls/RaycasterControls.ts'
import { FrameMesh } from './three-custom/meshes/FrameMesh'
import { DefaultRenderer } from './three-custom/renderers/DefaultRenderer'
import { galleryItemData } from '../../data'
import { GalleryTypeProps, GalleryTypeReturns } from '../../types'
import CSSTransition from '@/atoms/ui/CSSTransition'
import Loading from '@/atoms/ui/Loading'
import Modal from '@/atoms/ui/Modal'
import { postListData } from '@/features/post/data'
import toastManager from '@/utils/toastManager'

const CANVAS_TYPE: Record<number, (kwargs: GalleryTypeProps) => GalleryTypeReturns> = {
  1: greenary,
}

const GalleryCanvas = () => {
  /**
   * Get Data
   */
  const gallery = galleryItemData
  const postList = postListData
  /**
   * Render the Three.js canvas
   */
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const controlsRef = useRef<CannonKeypadControls | null>(null)

  const [requiredCount, setRequiredCount] = useState(0)
  const [loadedCount, setLoadedCount] = useState(0)

  const [selectedPostIdx, setSelectedPostIdx] = useState<number | null>(null)

  useEffect(() => {
    if (!gallery || !postList) return

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
    const camera = new DefaultCamera({ canvas })
    scene.add(camera)

    // Cannon world
    const world = new World()
    world.broadphase = new SAPBroadphase(world)

    // Main controls
    const controls = new CannonKeypadControls(canvas, camera, world, 1.6)
    controlsRef.current = controls

    // Raycaster controls
    const rayControls = new RaycasterControls(canvas, camera)
    rayControls.raycast = (item) => {
      if (item.object instanceof FrameMesh) {
        if (item.distance > 10) toastManager.addToast('error', '너무 멂')
        else {
          setSelectedPostIdx(item.object.order)
          controls.enabled = false
        }
      }
    }
    rayControls.onEsc = () => {
      setSelectedPostIdx(null)
      controls.enabled = true
    }

    // Cannon Helper : Development
    let cannonDebugger: { update: () => void } | null = null
    if (process.env.NODE_ENV !== 'production') cannonDebugger = CannonDebugger(scene, world, {})

    // Render canvas
    const { update: updateCanvas, dispose: disposeCanvas } = CANVAS_TYPE[gallery.place.placeId]({
      canvas,
      loadingManager,
      renderer,
      scene,
      camera,
      world,
      controls,
      rayControls,
      postList,
    })

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

      // Update cannon world
      world.step(delta < 0.01 ? 1 / 120 : 1 / 60, delta, 3)

      if (process.env.NODE_ENV !== 'production') {
        cannonDebugger && cannonDebugger.update()
      }

      // Update controls
      controls.update(delta)

      // Update canvas
      updateCanvas(delta)
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

      disposeCanvas()

      window.removeEventListener('resize', handleSize)
    }
  }, [gallery, postList])

  return (
    <div className="gallery-canvas">
      <canvas ref={canvasRef} />
      <CSSTransition
        className="gallery-canvas__loading"
        isShow={requiredCount !== loadedCount}
        duration={1000}
        timingFunction="ease-in-out"
      >
        <Loading />
      </CSSTransition>
      <Modal
        isOpen={selectedPostIdx !== null}
        onClose={() => {
          setSelectedPostIdx(null)
          console.log(controlsRef.current)
          if (controlsRef.current) {
            controlsRef.current.enabled = true
          }
        }}
      >
        {selectedPostIdx} 번째 선택됨
      </Modal>
    </div>
  )
}

export default GalleryCanvas
