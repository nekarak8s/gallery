import { useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { IGalleryStrategy } from './strategies'
import GalleryStrategy from './strategies/galleryStrategy'
import GreenaryStrategy from './strategies/greenaryStrategy'
import { GalleryData } from '../../types'
import GalleryCover from '../GalleryCover'
import CSSTransition from '@/atoms/ui/CSSTransition'
import Joystick from '@/atoms/ui/Joystick'
import Loading from '@/atoms/ui/Loading'
import Modal from '@/atoms/ui/Modal'
import PostDetail from '@/features/post/components/PostDetail'
import { PostItemData } from '@/features/post/types'
import useMobile from '@/hooks/useMobile'
import { DefaultCamera } from '@/libs/three-custom/cameras/DefaultCamera'
import { KeypadControls } from '@/libs/three-custom/controls/KeypadControls'
import { RaycasterControls } from '@/libs/three-custom/controls/RaycasterControls.ts'
import { MichelleBuilder } from '@/libs/three-custom/items/Player'
import { FrameMesh } from '@/libs/three-custom/meshes/FrameMesh'
import { DefaultRenderer } from '@/libs/three-custom/renderers/DefaultRenderer'
import musicManager from '@/utils/musicManager'
import toastManager from '@/utils/toastManager'
import './GalleryCanvas.scss'

type GalleryCanvasProps = {
  gallery: GalleryData
  postList: PostItemData[]
}

const STRATEGY_TYPE: Record<number, IGalleryStrategy> = {
  1: new GreenaryStrategy(),
  2: new GalleryStrategy(),
}

const GalleryCanvas = ({ gallery, postList }: GalleryCanvasProps) => {
  const [requiredCount, setRequiredCount] = useState(0)
  const [loadedCount, setLoadedCount] = useState(0)

  /**
   * Handle click enter button
   * 1. Remove the cover
   * 2. Play the music
   * 3. Enable the keypad controls
   */
  const [isCoverShow, setIsCoverShow] = useState(true)
  const isClicked = useRef(false)

  const onClickEnter = () => {
    if (!keypadControlsRef.current) return

    setIsCoverShow(false)
    musicManager.playAudio()
    if (requiredCount === loadedCount) {
      keypadControlsRef.current.enabled = true
    } else {
      isClicked.current = true
    }
  }

  useEffect(() => {
    if (loadedCount === requiredCount && isClicked.current) {
      setTimeout(() => {
        keypadControlsRef.current!.enabled = true
      }, 500)
    }
  }, [loadedCount, requiredCount])

  /**
   * Set the Three.js canvas and controls
   */
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const loadingManagerRef = useRef<THREE.LoadingManager | null>(null)
  const keypadControlsRef = useRef<KeypadControls | null>(null)
  const rayControlsRef = useRef<RaycasterControls | null>(null)
  const isSet = useRef(false)

  const [selectedPostIdx, setSelectedPostIdx] = useState<number | null>(null)

  useEffect(() => {
    if (!gallery || !postList) return

    const canvas = canvasRef.current!

    // loadingManager
    const loadingManager = new THREE.LoadingManager()
    loadingManagerRef.current = loadingManager
    loadingManager.onStart = function increaseLoadCount() {
      setRequiredCount((cnt) => cnt + 1)
    }
    loadingManager.onLoad = function decreaseLoadCount() {
      setLoadedCount((cnt) => cnt + 1)
    }
    loadingManager.onError = function toastLoadingErrorMesage(url) {
      console.error(url)
      toastManager.addToast('error', '필요한 자원을 로드하지 못했습니다')
    }

    // Renderer
    const renderer = new DefaultRenderer({ canvas, antialias: true })
    rendererRef.current = renderer

    // Scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera
    const camera = new DefaultCamera({ canvas })
    scene.add(camera)

    // Keypad controls
    const keypadControls = new KeypadControls(scene, camera, 1.6)
    keypadControlsRef.current = keypadControls
    keypadControls.enabled = false

    // Create character for the keypad contorls
    MichelleBuilder.build(new GLTFLoader(loadingManager))
      .then((michelle) => {
        keypadControls.character = michelle
      })
      .catch((err) => {
        console.error(err)
      })

    // Raycaster controls
    const rayControls = new RaycasterControls(canvas, camera)
    rayControlsRef.current = rayControls
    rayControls.raycast = (item) => {
      if (!(item.object instanceof FrameMesh)) return
      if (item.distance > 15) toastManager.addToast('error', '앨범이 너무 멀리 있습니다')
      else {
        setSelectedPostIdx(item.object.index)
        musicManager.muteAudio()
        keypadControls.enabled = false
      }
    }
    rayControls.onEsc = () => {
      setSelectedPostIdx(null)
      musicManager.unmuteAudio()
      keypadControls.enabled = true
    }

    // Add Re-size Listener
    const handleSize = function resizeCameraRenderer() {
      camera.setDefaultAspect()
      camera.updateProjectionMatrix()
      renderer.setDefaultSize()
      renderer.render(scene, camera)
    }
    window.addEventListener('resize', handleSize)

    // Draw canvas
    const clock = new THREE.Clock()
    const draw = function renderCanvas() {
      const delta = clock.getDelta()
      keypadControls.update(delta)
      currentStrategy.current?.update && currentStrategy.current.update(delta)
      renderer.render(scene, camera)
      renderer.setAnimationLoop(draw)
    }
    draw()

    // Ready to build the strategy
    isSet.current = true

    // Clean-up function: Release resources
    return () => {
      scene.remove(camera)
      renderer.setAnimationLoop(null)
      renderer.dispose()
      keypadControls.dispose()
      rayControls.dispose()
      window.removeEventListener('resize', handleSize)
    }
  }, [])

  /**
   * Draw Strategy
   */
  const isFirst = useRef(true)
  const currentStrategy = useRef<IGalleryStrategy | null>(null)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }

    if (!gallery || !postList || !isSet.current) return

    // Select strategy
    const strategy = STRATEGY_TYPE[gallery.place.placeId]
    currentStrategy.current = strategy

    // Build the strategy
    strategy.build({
      scene: sceneRef.current!,
      controls: keypadControlsRef.current!,
      loadingManager: loadingManagerRef.current!,
      postList,
    })

    keypadControlsRef.current!.floors = strategy.floors // Don't destruct (promise objects)
    keypadControlsRef.current!.obstacles = strategy.obstacles // Don't destruct (promise objects)
    rayControlsRef.current!.rayItems = strategy.targets // Don't destruct (promise objects)

    // Reset the variables
    return () => {
      setIsCoverShow(true)
      isClicked.current = false
      setRequiredCount(0)
      setLoadedCount(0)
      strategy.dispose()
    }
  }, [gallery, postList, isSet.current])

  /**
   * Joystick on Mobile
   */
  const isMobile = useMobile()

  const joystickControl = useCallback((x: number, y: number) => {
    if (!keypadControlsRef.current) return
    keypadControlsRef.current.rotateSpeedRatio = x
    keypadControlsRef.current.moveSpeedRatio = -y
  }, [])

  const joystickShoot = useCallback(() => {
    if (!rayControlsRef.current) return
    rayControlsRef.current.shoot()
  }, [])

  const joystickJump = useCallback(() => {
    if (!keypadControlsRef.current) return
    keypadControlsRef.current.jump()
  }, [])

  return (
    <div className="gallery-canvas">
      <canvas ref={canvasRef} />
      <Modal
        isOpen={selectedPostIdx !== null}
        onClose={() => {
          setSelectedPostIdx(null)
          musicManager.unmuteAudio()
          if (keypadControlsRef.current) {
            keypadControlsRef.current.enabled = true
          }
        }}
      >
        {selectedPostIdx !== null && <PostDetail post={postList[selectedPostIdx]} />}
      </Modal>
      {isMobile && (
        <div className="gallery-canvas__joystick">
          <Joystick control={joystickControl} shoot={joystickShoot} jump={joystickJump} />
        </div>
      )}
      <CSSTransition className="gallery-canvas__loading" isShow={requiredCount !== loadedCount} duration={1300} timingFunction="ease-in-out">
        <Loading />
        <span className="gallery-canvas__percentage">{(loadedCount / requiredCount) * 100}%</span>
      </CSSTransition>
      <CSSTransition className="gallery-canvas__cover" isShow={isCoverShow} duration={1000}>
        <GalleryCover gallery={gallery} onClickEnter={onClickEnter} />
      </CSSTransition>
    </div>
  )
}

export default GalleryCanvas

// Capture camera
// const camera2 = new THREE.OrthographicCamera(
//   canvas.offsetWidth / -2,
//   canvas.offsetWidth / 2,
//   canvas.offsetHeight / 2,
//   canvas.offsetHeight / -2,
//   3,
//   1000
// )
// camera2.position.set(-40, 90, -40)
// camera2.lookAt(54, 0, 54)
// camera2.zoom = 10
// camera2.updateProjectionMatrix()
// scene.add(camera2)
