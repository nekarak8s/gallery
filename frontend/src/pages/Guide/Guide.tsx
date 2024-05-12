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
import useDefaultRender from '@/features/gallery/hooks/useDefaultRender'
import useLoadingCount from '@/features/gallery/hooks/useLoadingCount'
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
   * Create rendering resources
   * Default render data, loadingManger
   */
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { sceneRef, rendererRef, cameraRef } = useDefaultRender({ canvasRef })
  const { loadingManager, requiredCount, loadedCount, setLoadedCount, setRequiredCount } = useLoadingCount()

  useEffect(() => {
    const renderer = rendererRef.current
    const scene = sceneRef.current
    const camera = cameraRef.current

    if (!renderer || !scene || !camera || !loadingManager) return

    camera.fov = 30
    camera.updateProjectionMatrix()

    // Build architect
    const architect = buildArchitect({ scene, loadingManager })

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
      camera.resetFov()
      architect.dispose && architect.dispose()
      renderer.setAnimationLoop(null)
    }
  }, [rendererRef.current, sceneRef.current, cameraRef.current, loadingManager])

  /**
   * Handle Scroll: Move camera position by scroll
   */
  const sectionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const camera = cameraRef.current
    const sections = sectionsRef.current

    if (!camera || !sections) return

    let currentSection = -1

    const handleScroll = function setSection() {
      // Only when the section is changed
      const newSection = Math.round(window.scrollY / window.innerHeight)
      if (currentSection === newSection) return

      currentSection = newSection
      sections.style.transform = `translate(0, -${newSection * 100}vh)`

      // Move camera
      if (window.innerWidth < MOBILE_WIDTH) {
        gsap.to(camera.position, {
          duration: 1,
          x: CAMERA_MOBILE_ORDERS[currentSection].position.x,
          y: CAMERA_MOBILE_ORDERS[currentSection].position.y,
          z: CAMERA_MOBILE_ORDERS[currentSection].position.z,
        })
        gsap.to(camera.rotation, {
          duration: 1,
          x: CAMERA_MOBILE_ORDERS[currentSection].rotation.x,
          y: CAMERA_MOBILE_ORDERS[currentSection].rotation.y,
        })
      } else {
        gsap.to(camera.position, {
          duration: 1,
          x: CAMERA_ORDERS[currentSection].position.x,
          y: CAMERA_ORDERS[currentSection].position.y,
          z: CAMERA_ORDERS[currentSection].position.z,
        })
        gsap.to(camera.rotation, {
          duration: 1,
          x: CAMERA_ORDERS[currentSection].rotation.x,
          y: CAMERA_ORDERS[currentSection].rotation.y,
        })
      }
    }

    // Add event listener
    const optimizedHandleScroll = toFrame(handleScroll)
    optimizedHandleScroll()

    window.addEventListener('scroll', optimizedHandleScroll)

    // Remove event listener
    return () => {
      window.addEventListener('scroll', optimizedHandleScroll)
    }
  }, [cameraRef.current])

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
