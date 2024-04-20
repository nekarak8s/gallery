import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import useControlsStrategy from '../../hooks/useControlsStrategy'
import useDefaultRender from '../../hooks/useDefaultRender'
import useLoadingCount from '../../hooks/useLoadingCount'
import useTerrainStrategy from '../../hooks/useTerrainStrategy'
import { GalleryData } from '../../types'
import GalleryCover from '../GalleryCover'
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
    if (!renderer) return

    const clock = new THREE.Clock()

    const draw = function renderCanvas() {
      const delta = clock.getDelta()
      sceneRef.current && cameraRef.current && renderer.render(sceneRef.current, cameraRef.current)
      renderer.setAnimationLoop(draw)
      controlsRef.current?.update && controlsRef.current.update(delta)
      terrainRef.current?.update && terrainRef.current.update(delta)
    }

    draw()

    return () => {
      renderer.setAnimationLoop(null)
      renderer.dispose()
    }
  }, [rendererRef.current])

  /**
   * Enable the controls
   */
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls || !isEntered || loadedCount !== requiredCount || !isTerrainBuilt) return

    if (controls instanceof KeypadControls) {
      controls.floors = terrainRef.current!.floors // Don't destruct (promise objects)
      controls.obstacles = terrainRef.current!.obstacles // Don't destruct (promise objects)
      controls.targets = terrainRef.current!.targets // Don't destruct (promise objects)
    }
    controls.enabled = true

    return () => {
      controls.enabled = false
    }
  }, [controlsRef.current, isEntered, loadedCount, requiredCount, isTerrainBuilt])

  /**
   * Show selected frames modal
   */
  const [selectedPostIdx, setSelectedPostIdx] = useState<number | null>(null)

  // Show modal with controls
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    /* eslint-disable */
    const handler = {
      apply(target: Function, thisArg: object, args: any[]) {
        const item = Reflect.apply(target, thisArg, args) // Use reflect to access private properties
        if (!item.object.userData.isPost) return
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
  }, [controlsRef.current])

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
    if (selectedPostIdx === null) {
      musicManager.unmuteAudio()
      controlsRef.current && (controlsRef.current.enabled = true)
    } else {
      musicManager.muteAudio()
      controlsRef.current && (controlsRef.current.enabled = false)
    }
  }, [selectedPostIdx])

  return (
    <div className="gallery-canvas">
      <canvas ref={canvasRef} />
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
