import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import useControlsStrategy from '../../hooks/useControlsStrategy'
import useDefaultRender from '../../hooks/useDefaultRender'
import useLoadingCount from '../../hooks/useLoadingCount'
import useTerrainStrategy from '../../hooks/useTerrainStrategy'
import { GalleryData } from '../../types'
import GalleryCover from '../GalleryCover'
import JoystickControl from '../JoystickControl'
import CSSTransition from '@/atoms/ui/CSSTransition'
import Loading from '@/atoms/ui/Loading'
import Modal from '@/atoms/ui/Modal'
import PostDetail from '@/features/post/components/PostDetail'
import { PostItemData } from '@/features/post/types'
import KeypadControls from '@/libs/three-custom/controls/KeypadControls'
import musicManager from '@/utils/musicManager'
import toastManager from '@/utils/toastManager'
import './GalleryCanvas.scss'

type GalleryCanvasProps = {
  gallery: GalleryData
  postList: PostItemData[]
}

const GalleryCanvas = ({ gallery, postList }: GalleryCanvasProps) => {
  /**
   * Enter the gallery : initial invitation cover
   */
  const [isEntered, setIsEntered] = useState(false)

  const handleEnter = () => {
    musicManager.playAudio()
    setIsEntered(true)
  }

  useEffect(() => {
    return () => {
      setIsEntered(false)
    }
  }, [gallery, postList])

  /**
   * Create rendering environment
   * Default render data -> loadingManger -> controls -> terrain
   */
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { sceneRef, rendererRef, cameraRef } = useDefaultRender({ canvasRef })
  const { loadingManager, requiredCount, loadedCount } = useLoadingCount()
  const { controlsRef } = useControlsStrategy({ type: 'keypad', canvasRef, sceneRef, cameraRef, loadingManager })
  const { terrainRef, isTerrainBuilt } = useTerrainStrategy({ sceneRef, cameraRef, controlsRef, loadingManager, gallery, postList })

  /**
   * Render the canvas
   */
  useEffect(() => {
    const renderer = rendererRef.current
    const scene = sceneRef.current
    const camera = cameraRef.current

    if (!renderer || !scene || !camera) return

    const clock = new THREE.Clock()

    const draw = function renderCanvas() {
      const delta = clock.getDelta()
      renderer.render(scene, camera)
      renderer.setAnimationLoop(draw)
      controlsRef.current?.update && controlsRef.current.update(delta)
      terrainRef.current?.update && terrainRef.current.update(delta)
    }

    draw()

    return () => {
      renderer.setAnimationLoop(null)
    }
  }, [rendererRef, sceneRef, cameraRef])

  /**
   * Enable the controls
   */
  useEffect(() => {
    const controls = controlsRef.current
    const terrain = terrainRef.current

    if (!controls || !terrain || !isEntered || loadedCount !== requiredCount || !isTerrainBuilt) return

    if (controls instanceof KeypadControls) {
      controls.floors = terrain.floors // Don't destruct (promise objects)
      controls.obstacles = terrain.obstacles // Don't destruct (promise objects)
      controls.targets = terrain.targets // Don't destruct (promise objects)
    }
    controls.enabled = true

    return () => {
      controls.enabled = false
    }
  }, [controlsRef, terrainRef, isEntered, loadedCount, requiredCount, isTerrainBuilt])

  /**
   * Show selected frames modal
   */
  const [selectedPostIdx, setSelectedPostIdx] = useState<number | null>(null)

  // Show modal with controls
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls || !isTerrainBuilt) return

    /* eslint-disable */
    const handler = {
      apply(target: Function, thisArg: object, args: any[]) {
        const item = Reflect.apply(target, thisArg, args) // Use reflect to access private properties
        if (!item || !item.object.userData.isPost) return
        if (item.distance > 10) toastManager.addToast('error', '앨범이 너무 멀리 있습니다')
        else {
          setSelectedPostIdx(item.object.userData.idx as number)
        }
      },
    }

    controls.raycastTargets = new Proxy(controls.raycastTargets, handler) as (
      ...args: any[]
    ) => THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>> // Type assertion for assignability
    /* eslint-enable */
  }, [controlsRef, isTerrainBuilt])

  // Close modal on ESC
  useEffect(() => {
    const closeModal = (e: KeyboardEvent) => {
      if (e.code === 'Escape') setSelectedPostIdx(null)
    }

    window.addEventListener('keydown', closeModal)

    return () => {
      window.removeEventListener('keydown', closeModal)
    }
  }, [])

  // Side effect of modal state
  useEffect(() => {
    if (!isEntered) return

    if (selectedPostIdx === null) {
      musicManager.unmuteAudio()
      controlsRef.current && (controlsRef.current.enabled = true)
    } else {
      musicManager.muteAudio()
      controlsRef.current && (controlsRef.current.enabled = false)
    }
  }, [selectedPostIdx, isEntered])

  // Check the control type
  const [isKeypad, setIsKeypad] = useState(false)

  useEffect(() => {
    setIsKeypad(controlsRef.current instanceof KeypadControls)
  }, [controlsRef])

  return (
    <div className="gallery-canvas">
      <canvas ref={canvasRef} />
      {isKeypad && <JoystickControl controlsRef={controlsRef as React.RefObject<KeypadControls>} />}
      <Modal
        isOpen={selectedPostIdx !== null}
        onClose={() => {
          setSelectedPostIdx(null)
        }}
      >
        <PostDetail post={postList[selectedPostIdx!]} />
      </Modal>
      <CSSTransition className="gallery-canvas__loading" isShow={requiredCount !== loadedCount} duration={1000} timingFunction="ease-in-out">
        <Loading />
      </CSSTransition>
      <CSSTransition className="gallery-canvas__cover" isShow={!isEntered} duration={1000}>
        <GalleryCover gallery={gallery} onClickEnter={handleEnter} />
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
