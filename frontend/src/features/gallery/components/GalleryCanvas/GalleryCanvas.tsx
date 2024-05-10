import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import useControlsStrategy, { TControlType } from '../../hooks/useControlsStrategy'
import useDefaultRender from '../../hooks/useDefaultRender'
import useLoadingCount from '../../hooks/useLoadingCount'
import useTerrainStrategy from '../../hooks/useTerrainStrategy'
import { GalleryData } from '../../types'
import ButtonControl from '../ButtonControl/ButtonControl'
import GalleryCover from '../GalleryCover'
import JoystickControl from '../JoystickControl'
import MiniMap from '../MiniMap'
import CSSTransition from '@/atoms/ui/CSSTransition'
import Loading from '@/atoms/ui/Loading'
import Modal from '@/atoms/ui/Modal'
import PortfolioDetail from '@/features/post/components/PortfolioDetail'
import PostDetail from '@/features/post/components/PostDetail'
import { PostItemData } from '@/features/post/types'
import KeypadControls from '@/libs/three-custom/controls/KeypadControls'
import MouseControls from '@/libs/three-custom/controls/MouseControls'
import musicManager from '@/utils/musicManager'
import toastManager from '@/utils/toastManager'
import './GalleryCanvas.scss'

type GalleryCanvasProps = {
  controlType: TControlType
  gallery: GalleryData
  postList: PostItemData[]
  isPortfolio?: boolean
}

const GalleryCanvas = ({ controlType, gallery, postList, isPortfolio = false }: GalleryCanvasProps) => {
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
   * Create rendering resources
   * Default render data / loadingManger -> controls -> terrain
   */
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { sceneRef, rendererRef, cameraRef } = useDefaultRender({ canvasRef })
  const { loadingManager, requiredCount, loadedCount } = useLoadingCount()
  const { controlsRef } = useControlsStrategy({ type: controlType, canvasRef, sceneRef, cameraRef, loadingManager })
  const { terrainRef, isTerrainBuilt } = useTerrainStrategy({
    sceneRef,
    cameraRef,
    controlsRef,
    loadingManager,
    placeId: gallery.place.placeId,
    postList,
  })

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
  }, [rendererRef.current, sceneRef.current, cameraRef.current])

  /**
   * Enable the controls
   */
  useEffect(() => {
    if (!isEntered || loadedCount !== requiredCount || !isTerrainBuilt) return

    const controls = controlsRef.current
    const terrain = terrainRef.current
    if (!controls || !terrain) return

    controls.targets = terrain.targets // Don't destruct (promise objects)
    if (controls instanceof KeypadControls) {
      controls.floors = terrain.floors // Don't destruct (promise objects)
      controls.obstacles = terrain.obstacles // Don't destruct (promise objects)
    }

    controls.enabled = true

    return () => {
      controls.enabled = false
    }
  }, [controlsRef.current, terrainRef.current, isEntered, loadedCount, requiredCount, isTerrainBuilt])

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

  /**
   * Close post modal on ESC
   */
  useEffect(() => {
    const closeModal = (e: KeyboardEvent) => {
      if (e.code === 'Escape') setSelectedPostIdx(null)
    }

    window.addEventListener('keydown', closeModal)

    return () => {
      window.removeEventListener('keydown', closeModal)
    }
  }, [])

  /**
   * Side effect from the modal state
   */
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

  /**
   * Switch the control component
   */
  const [isKeypad, setIsKeypad] = useState(false)

  useEffect(() => {
    setIsKeypad(controlsRef.current instanceof KeypadControls)
  }, [controlsRef])

  return (
    <div className="gallery-canvas">
      <canvas ref={canvasRef} />
      <div className="gallery-canvas__mini-map">
        <MiniMap controlsRef={controlsRef} galleryType={gallery.place.placeId} />
      </div>
      {isKeypad ? (
        <JoystickControl controlsRef={controlsRef as React.RefObject<KeypadControls>} loadingManager={loadingManager} />
      ) : (
        <ButtonControl controlsRef={controlsRef as React.RefObject<MouseControls>} />
      )}
      <Modal
        isOpen={selectedPostIdx !== null}
        onClose={() => {
          setSelectedPostIdx(null)
        }}
      >
        {isPortfolio ? <PortfolioDetail post={postList[selectedPostIdx!]} /> : <PostDetail post={postList[selectedPostIdx!]} />}
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

// const camera2 = new THREE.OrthographicCamera()
// camera2.position.set(50, 1000, 50)
// camera2.lookAt(50, 0, 50)
// camera2.zoom = 0.017
// camera2.updateProjectionMatrix()
// scene.add(camera2)
