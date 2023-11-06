import { useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

interface GreenaryProps {
  placeId: number
  canvasRef: React.RefObject<HTMLCanvasElement>
  gallery: Gallery
  frameList: Frame[]
}

const useGreenary = ({
  placeId,
  canvasRef,
  gallery,
  frameList,
}: GreenaryProps) => {
  useEffect(() => {
    if (gallery.place.placeId !== placeId) return

    console.log(gallery, frameList)

    const canvas = canvasRef.current!

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    })
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1)

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.y = 1.5
    camera.position.z = 4
    scene.add(camera)

    // Light
    const ambientLight = new THREE.AmbientLight('white', 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight('white', 1)
    directionalLight.position.x = 1
    directionalLight.position.z = 2
    scene.add(directionalLight)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    // Mesh
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({
      color: 'seagreen',
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // 그리기
    const clock = new THREE.Clock()

    function draw() {
      const delta = clock.getDelta()

      controls.update()

      renderer.render(scene, camera)
      renderer.setAnimationLoop(draw)
    }

    function setSize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(canvas.clientWidth, canvas.clientHeight)
      renderer.render(scene, camera)
    }

    // dat.gui
    if (process.env.NODE_ENV !== 'production') {
      import('dat.gui').then((dat) => {
        const gui = new dat.GUI()
        gui.add(mesh.position, 'x', -30, 30, 0.01).name('x')
        gui.add(mesh.position, 'z', -30, 30, 0.01).name('z')
      })
    }

    // 이벤트
    window.addEventListener('resize', setSize)

    draw()
  }, [])
}

export default useGreenary
