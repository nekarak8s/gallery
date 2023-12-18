import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import * as THREE from 'three'
import { degToRad } from 'three/src/math/MathUtils'
import { buildArchitect } from './buildArchitect'
import ScrollDown from '@/atoms/ui/ScrollDown'
import { buildSky } from '@/libs/three-custom/utils/buildSky'
import { buildSun } from '@/libs/three-custom/utils/buildSun'
import { buildWater } from '@/libs/three-custom/utils/buildWater'
import toFrame from '@/utils/toFrame'
import './Guide.scss'

const CAMERA_ORDERS = [
  { position: { x: 80, y: 50, z: 80 }, rotation: { x: degToRad(-20), y: degToRad(45) } },
  { position: { x: -15, y: 5, z: 20 }, rotation: { x: degToRad(0), y: degToRad(0) } },
  { position: { x: 15, y: 5, z: 15 }, rotation: { x: degToRad(0), y: degToRad(-90) } },
  { position: { x: 15, y: 5, z: -15 }, rotation: { x: degToRad(0), y: degToRad(-90) } },
  { position: { x: -15, y: 5, z: -20 }, rotation: { x: degToRad(0), y: degToRad(90) } },
  { position: { x: -15, y: 3, z: -100 }, rotation: { x: degToRad(10), y: degToRad(0) } },
]

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
    camera.rotation.order = 'YXZ'
    camera.position.set(
      CAMERA_ORDERS[0].position.x,
      CAMERA_ORDERS[0].position.y,
      CAMERA_ORDERS[0].position.z
    )
    camera.rotation.set(CAMERA_ORDERS[0].rotation.x, CAMERA_ORDERS[0].rotation.y, 0)
    cameraRef.current = camera

    // build Meshes
    const water = buildWater(scene)
    const sky = buildSky(scene, renderer)
    const sun = buildSun(renderer, sky, water)
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

      window.removeEventListener('resize', handleSize)
    }
  }, [])

  /**
   * Handle Scroll
   */
  const cameraRef = useRef<THREE.Camera | null>(null)

  useEffect(() => {
    let currentSection = 0

    const handleScroll = function setSection() {
      if (!cameraRef.current) return

      const newSection = Math.round(window.scrollY / window.innerHeight)
      if (currentSection === newSection) return

      currentSection = newSection

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

    const optimizedHandleScroll = toFrame(handleScroll)
    window.addEventListener('scroll', optimizedHandleScroll)

    return () => {
      window.addEventListener('scroll', optimizedHandleScroll)
    }
  }, [])

  return (
    <div className="guide">
      <canvas ref={canvasRef} />
      <section>
        <h1 className="guide--accent">
          더 갤러리 속성 강의에 오신
          <br /> 여러분 환영합니다
        </h1>
      </section>
      <div className="guide__sections">
        <section>
          <h1>먼저 로그인 해주세요</h1>
          <p>
            저희 더갤러리는 소셜로그인으로 본인 인증만 진행하고 어떠한 정보도 받아오지 않습니다.
            저희 말고 IT 대기업을 신뢰하세요!
          </p>
        </section>
        <section>
          <h1>마이페이지에서 전시회를 생성하세요</h1>
          <p>
            여러분이 열고자 하는 전시회의 제목과 설명글을 적은 후, 공간타입을 정해주세요. 어차피
            지금은 한개밖에 없지만요!
          </p>
        </section>
        <section>
          <h1>생성한 전시회에 사진을 채워넣으세요</h1>
          <p>
            지금당장 은밀하고 소중한 사진첩을 열어 전시회 작품으로 선보일 만한 사진을 골라주세요.
            그것이 바로 순기능입니다 SNS의!
          </p>
        </section>
        <section>
          <h1>전시회에 입장해 플레이해보세요</h1>
          <p>
            전시회에 입장해서 곳곳에 숨어있는 앨범을 찾아 감상문을 남기세요.앨범을 과녁해서 맞출
            때의 타격감은 덤!
          </p>
        </section>
        <section>
          <h1 className="guide--accent">고양이 애용 부탁드립니다</h1>
        </section>
      </div>
      <div className="guide__scroll">
        <ScrollDown />
      </div>
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
