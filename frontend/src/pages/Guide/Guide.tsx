import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import * as THREE from 'three'
import { degToRad } from 'three/src/math/MathUtils'
import { buildArchitect } from './buildArchitect'
import { routes } from '@/App'
import Button from '@/atoms/ui/Button'
import CSSTransition from '@/atoms/ui/CSSTransition'
import Loading from '@/atoms/ui/Loading'
import ScrollDown from '@/atoms/ui/ScrollDown'
import { DefaultCamera } from '@/libs/three-custom/cameras/DefaultCamera'
import { DefaultRenderer } from '@/libs/three-custom/renderers/DefaultRenderer'
import toFrame from '@/utils/toFrame'
import './Guide.scss'

const CAMERA_ORDERS = [
  { position: { x: 50, y: 17, z: 110 }, rotation: { x: degToRad(0), y: degToRad(20) } },
  { position: { x: 5, y: 6, z: 44 }, rotation: { x: degToRad(0), y: degToRad(0) } },
  { position: { x: 10, y: 6, z: 35 }, rotation: { x: degToRad(0), y: degToRad(-90) } },
  { position: { x: 10, y: 6, z: 5 }, rotation: { x: degToRad(0), y: degToRad(-90) } },
  { position: { x: 10, y: 6, z: 5 }, rotation: { x: degToRad(0), y: degToRad(90) } },
  { position: { x: 10, y: 10, z: -100 }, rotation: { x: degToRad(5), y: degToRad(0) } },
]

const CAMERA_MOBILE_ORDERS = [
  { position: { x: 45, y: 23, z: 170 }, rotation: { x: degToRad(0), y: degToRad(15) } },
  { position: { x: 3, y: 5, z: 46 }, rotation: { x: degToRad(0), y: degToRad(0) } },
  { position: { x: 8, y: 5, z: 37 }, rotation: { x: degToRad(0), y: degToRad(-90) } },
  { position: { x: 8, y: 5, z: 3 }, rotation: { x: degToRad(0), y: degToRad(-90) } },
  { position: { x: 12, y: 5, z: 3 }, rotation: { x: degToRad(0), y: degToRad(90) } },
  { position: { x: 11, y: 10, z: -100 }, rotation: { x: degToRad(5), y: degToRad(0) } },
]

const MOBILE_WIDTH = 992
const DEFAULT_LOADING_TIME = 1000

const Guide = () => {
  const { t } = useTranslation()

  /**
   * Initial loading cover time
   */
  const [isDefaultTime, setIsDefaultTime] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)

    setTimeout(() => {
      setIsDefaultTime(false)
    }, DEFAULT_LOADING_TIME)
  }, [])

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
    const camera = new DefaultCamera({ canvas, fov: 30, near: 2, far: 20000 })
    camera.rotation.order = 'YXZ'
    if (window.innerWidth < MOBILE_WIDTH) {
      camera.position.set(CAMERA_MOBILE_ORDERS[0].position.x, CAMERA_MOBILE_ORDERS[0].position.y, CAMERA_MOBILE_ORDERS[0].position.z)
      camera.rotation.set(CAMERA_MOBILE_ORDERS[0].rotation.x, CAMERA_MOBILE_ORDERS[0].rotation.y, 0)
    } else {
      camera.position.set(CAMERA_ORDERS[0].position.x, CAMERA_ORDERS[0].position.y, CAMERA_ORDERS[0].position.z)
      camera.rotation.set(CAMERA_ORDERS[0].rotation.x, CAMERA_ORDERS[0].rotation.y, 0)
    }
    cameraRef.current = camera

    // Meshes
    const architect = buildArchitect({ scene, loadingManager })

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
      architect.update && architect.update(delta)

      renderer.render(scene, camera)
      renderer.setAnimationLoop(draw)
    }

    draw()

    // Clean-up function: Release resources
    return () => {
      setRequiredCount(0)
      setLoadedCount(0)

      architect.dispose && architect.dispose()

      scene.remove(camera)
      renderer.setAnimationLoop(null)
      renderer.dispose()

      window.removeEventListener('resize', handleSize)
    }
  }, [])

  /**
   * Handle Scroll: Move camera position
   */
  const cameraRef = useRef<THREE.Camera | null>(null)
  const sectionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sections = sectionsRef.current!

    let currentSection = 0

    const handleScroll = function setSection() {
      if (!cameraRef.current) return

      // Only when the section is changed
      const newSection = Math.round(window.scrollY / window.innerHeight)
      if (currentSection === newSection) return

      currentSection = newSection

      sections.style.transform = `translate(0, -${newSection * 100}vh)`

      // Move camera
      if (window.innerWidth < MOBILE_WIDTH) {
        gsap.to(cameraRef.current.position, {
          duration: 1,
          x: CAMERA_MOBILE_ORDERS[currentSection].position.x,
          y: CAMERA_MOBILE_ORDERS[currentSection].position.y,
          z: CAMERA_MOBILE_ORDERS[currentSection].position.z,
        })
        gsap.to(cameraRef.current.rotation, {
          duration: 1,
          x: CAMERA_MOBILE_ORDERS[currentSection].rotation.x,
          y: CAMERA_MOBILE_ORDERS[currentSection].rotation.y,
        })
      } else {
        gsap.to(cameraRef.current.position, {
          duration: 1,
          x: CAMERA_ORDERS[currentSection].position.x,
          y: CAMERA_ORDERS[currentSection].position.y,
          z: CAMERA_ORDERS[currentSection].position.z,
        })
        gsap.to(cameraRef.current.rotation, {
          duration: 1,
          x: CAMERA_ORDERS[currentSection].rotation.x,
          y: CAMERA_ORDERS[currentSection].rotation.y,
        })
      }
    }

    // Add event listener
    const optimizedHandleScroll = toFrame(handleScroll)
    window.addEventListener('scroll', optimizedHandleScroll)

    // Remove event listener
    return () => {
      window.addEventListener('scroll', optimizedHandleScroll)
    }
  }, [])

  return (
    <div className="guide">
      <div className="guide__main">
        <canvas ref={canvasRef} />
        <div className="guide__sections" ref={sectionsRef}>
          <section>
            <h1>
              {t('guide.intro1')}
              <br />
              {t('guide.intro2')}
            </h1>
            <div className="guide__scroll">
              <ScrollDown />
            </div>
          </section>
          <section>
            <h2>{t('guide.step1.title')}</h2>
            <p>{t('guide.step1.content')}</p>
          </section>
          <section>
            <h2>{t('guide.step2.title')}</h2>
            <p>{t('guide.step2.content')}</p>
          </section>
          <section>
            <h2>{t('guide.step3.title')}</h2>
            <p>{t('guide.step3.content')}</p>
          </section>
          <section>
            <h2>{t('guide.step4.title')}</h2>
            <p>{t('guide.step4.content')}</p>{' '}
          </section>
          <section>
            <h1>
              {t('guide.outro1')}
              <br />
              {t('guide.outro2')}
            </h1>
            <Button
              text={t('buttons.experience')}
              ariaLabel="3D 전시회 체험하기"
              to={routes['Example'].path}
              isTransparent={true}
              direction="center"
            ></Button>
          </section>
        </div>
      </div>
      <CSSTransition className="guide__loading" isShow={isDefaultTime || requiredCount !== loadedCount} duration={1000} timingFunction="ease-in-out">
        <Loading />
      </CSSTransition>
    </div>
  )
}

export default Guide
