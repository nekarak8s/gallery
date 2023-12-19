import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import * as THREE from 'three'
import { degToRad } from 'three/src/math/MathUtils'
import { buildArchitect } from './buildArchitect'
import CSSTransition from '@/atoms/ui/CSSTransition'
import Loading from '@/atoms/ui/Loading'
import ScrollDown from '@/atoms/ui/ScrollDown'
import { DefaultCamera } from '@/libs/three-custom/cameras/DefaultCamera'
import { DefaultRenderer } from '@/libs/three-custom/renderers/DefaultRenderer'
import toFrame from '@/utils/toFrame'
import './Guide.scss'

const CAMERA_ORDERS = [
  { position: { x: 60, y: 17, z: 110 }, rotation: { x: degToRad(0), y: degToRad(25) } },
  { position: { x: 5, y: 6, z: 45 }, rotation: { x: degToRad(0), y: degToRad(0) } },
  { position: { x: 10, y: 6, z: 35 }, rotation: { x: degToRad(0), y: degToRad(-90) } },
  { position: { x: 10, y: 6, z: 5 }, rotation: { x: degToRad(0), y: degToRad(-90) } },
  { position: { x: 10, y: 6, z: 5 }, rotation: { x: degToRad(0), y: degToRad(90) } },
  { position: { x: 10, y: 10, z: -100 }, rotation: { x: degToRad(5), y: degToRad(0) } },
]

const CAMERA_MOBILE_ORDERS = [
  { position: { x: 60, y: 20, z: 120 }, rotation: { x: degToRad(0), y: degToRad(25) } },
  { position: { x: 3, y: 5, z: 46 }, rotation: { x: degToRad(0), y: degToRad(0) } },
  { position: { x: 8, y: 5, z: 37 }, rotation: { x: degToRad(0), y: degToRad(-90) } },
  { position: { x: 8, y: 5, z: 3 }, rotation: { x: degToRad(0), y: degToRad(-90) } },
  { position: { x: 12, y: 5, z: 3 }, rotation: { x: degToRad(0), y: degToRad(90) } },
  { position: { x: 11, y: 10, z: -100 }, rotation: { x: degToRad(5), y: degToRad(0) } },
]

const MOBILE_WIDTH = 992

const DEFAULT_LOADING_TIME = 1000

const Guide = () => {
  /**
   * Initial loading cover time
   */
  const [isDefaultTime, setIsDefaultTime] = useState(true)

  useEffect(() => {
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
      camera.position.set(
        CAMERA_MOBILE_ORDERS[0].position.x,
        CAMERA_MOBILE_ORDERS[0].position.y,
        CAMERA_MOBILE_ORDERS[0].position.z
      )
      camera.rotation.set(CAMERA_MOBILE_ORDERS[0].rotation.x, CAMERA_MOBILE_ORDERS[0].rotation.y, 0)
    } else {
      camera.position.set(
        CAMERA_ORDERS[0].position.x,
        CAMERA_ORDERS[0].position.y,
        CAMERA_ORDERS[0].position.z
      )
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

  useEffect(() => {
    let currentSection = 0

    const handleScroll = function setSection() {
      if (!cameraRef.current) return

      // Only when the section is changed
      const newSection = Math.round(window.scrollY / window.innerHeight)
      if (currentSection === newSection) return

      currentSection = newSection

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
      <canvas ref={canvasRef} />
      <section>
        <div>
          <h1 className="guide__intro">
            더 갤러리 속성 강의에 오신
            <br />
            여러분 환영합니다
          </h1>
          <div className="guide__scroll">
            <ScrollDown />
          </div>
        </div>
      </section>
      <div className="guide__sections">
        <section>
          <div>
            <h1>먼저 로그인 해주세요</h1>
            <p>
              더갤러리는 안전한 소셜로그인을 지원합니다. 그 과정에서 어떠한 권한도 요구하지
              않습니다. 저희 말고 IT 대기업을 신뢰하세요!
            </p>
          </div>
        </section>
        <section>
          <div>
            <h1>전시회를 생성하세요</h1>
            <p>
              마이페이지에서 &apos;+&apos; 버튼을 눌러 갤러리를 생성합니다. 전시회의 이름과 소개를
              적고 공간타입을 선택하세요.
            </p>
          </div>
        </section>
        <section>
          <div>
            <h1>사진을 등록하세요</h1>
            <p>
              여러분의 사진첩에서 선보이고 싶은 사진들을 골라 등록하세요. 각 사진마다 어울리는
              음악을 검색해 등록할 수 있습니다.
            </p>
          </div>
        </section>
        <section>
          <div>
            <h1>전시회에 입장하세요</h1>
            <p>
              입장 버튼을 통해 전시회를 관람할 수 있습니다. 전시회 곳곳을 돌아다니며 앨범에 방명록을
              남겨보세요.
            </p>
          </div>
        </section>
        <section>
          <div>
            <h1>
              지금 바로 전시회를 열고
              <br />
              친구들을 초대하세요
            </h1>
          </div>
        </section>
      </div>
      <CSSTransition
        className="guide__loading"
        isShow={isDefaultTime || requiredCount !== loadedCount}
        duration={1000}
        timingFunction="ease-in-out"
      >
        <Loading />
      </CSSTransition>
    </div>
  )
}

export default Guide
