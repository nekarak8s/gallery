import gsap from 'gsap'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { acceleratedRaycast } from 'three-mesh-bvh'
import { IControls } from '..'

const CAMERA_OFFSET = new THREE.Vector3(0, 0, 5) // camera offset from the post
const DRAG_THRESHOLD = 0.1

THREE.Mesh.prototype.raycast = acceleratedRaycast

type MouseControlsArgs = {
  canvas: HTMLCanvasElement
  camera: THREE.Camera
}

class MouseControls implements IControls {
  // arguments
  canvas: HTMLCanvasElement
  camera: THREE.Camera

  // API
  enabled: boolean = true
  targets: THREE.Object3D<THREE.Object3DEventMap>[] = []
  dispose: () => void

  // raycasting
  #raycaster = new THREE.Raycaster()
  #mouse = new THREE.Vector2()
  #curPostIdx: number = -1
  #orbitControls: OrbitControls
  maxDuration: number = 2 // second

  constructor({ canvas, camera }: MouseControlsArgs) {
    this.canvas = canvas
    this.camera = camera
    this.#orbitControls = new OrbitControls(camera, canvas)
    this.#orbitControls.enableDamping = true
    this.#orbitControls.maxDistance = 10
    this.#orbitControls.minDistance = 1
    this.#orbitControls.minPolarAngle = Math.PI / 3 // radians
    this.#orbitControls.maxPolarAngle = (2 * Math.PI) / 3 // radians

    // Add event listener
    const _onMouseDown = this.onMouseDown.bind(this)
    const _onMouseUp = this.onMouseUp.bind(this)
    canvas.addEventListener('mousedown', _onMouseDown)
    canvas.addEventListener('mouseup', _onMouseUp)

    this.dispose = () => {
      this.#orbitControls.dispose()
      canvas.removeEventListener('mousedown', _onMouseDown)
      canvas.removeEventListener('mouseup', _onMouseUp)
    }
  }

  get postTargets() {
    return this.targets.filter((target) => target.userData.isPost)
  }

  onMouseDown(e: MouseEvent) {
    this.#mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    this.#mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
  }

  onMouseUp(e: MouseEvent) {
    // disable if it's dragged
    const prevX = this.#mouse.x
    const prevY = this.#mouse.y
    this.#mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    this.#mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

    if (Math.abs(prevX - this.#mouse.x) > DRAG_THRESHOLD || Math.abs(prevY - this.#mouse.y) > DRAG_THRESHOLD) return
    this.raycastTargets()
  }

  setPosition(x: number, y: number, z: number) {
    this.camera.position.set(x, y, z)
  }
  setQuaternion(x: number, y: number, z: number) {
    this.camera.rotation.set(x, y, z)
  }

  moveToNextPost() {
    if (this.postTargets.length < this.#curPostIdx + 2) return

    this.#curPostIdx += 1
    const nextPost = this.postTargets[this.#curPostIdx]

    this.moveToPost(nextPost)
  }

  moveToPrevPost() {
    if (this.#curPostIdx == 0) return

    this.#curPostIdx -= 1
    const prevPost = this.postTargets[this.#curPostIdx]

    this.moveToPost(prevPost)
  }

  moveToPost(post: THREE.Object3D<THREE.Object3DEventMap>) {
    const offset = CAMERA_OFFSET.clone()
    offset.applyQuaternion(post.quaternion)
    offset.add(post.position)

    const distance = this.camera.position.distanceTo(post.position)
    const duration = Math.max(1, Math.min(distance / 10, this.maxDuration))

    gsap.to(this.camera.position, {
      duration,
      x: offset.x,
      y: offset.y,
      z: offset.z,
    })

    gsap.to(this.camera.rotation, {
      duration,
      x: post.rotation.x,
      y: post.rotation.y,
      z: post.rotation.z,
      onComplete: () => {
        this.#orbitControls.target = post.position
      },
    })
  }

  raycastTargets() {
    this.#raycaster.setFromCamera(this.#mouse, this.camera)
    const intersects = this.#raycaster.intersectObjects(this.targets)
    return intersects[0]
  }

  update(delta: number) {
    this.#orbitControls.update()
  }
}

export default MouseControls
