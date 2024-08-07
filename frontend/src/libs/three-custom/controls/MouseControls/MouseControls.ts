import gsap from 'gsap'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { acceleratedRaycast } from 'three-mesh-bvh'
import { IControls } from '..'

const _canvasOrigin = new THREE.Vector2(0, 0)
const _vector3 = new THREE.Vector3()
const _frontDirection = new THREE.Vector3(0, 0, 1)

const DRAG_THRESHOLD = 0.05

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

  // movement
  #orbitControls: OrbitControls
  #curPostIdx: number = -1
  isMoving: boolean = false
  #originPosition: THREE.Vector3 = new THREE.Vector3()
  maxDuration: number = 4 // second
  minDuration: number = 2 // second
  offsetDistance: number = 2.5

  constructor({ canvas, camera }: MouseControlsArgs) {
    this.canvas = canvas
    this.camera = camera
    this.camera.rotation.order = 'YZX'
    this.#orbitControls = new OrbitControls(camera, canvas)
    this.#orbitControls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_ROTATE,
    }
    this.#orbitControls.enableDamping = true
    this.#orbitControls.maxDistance = 15
    this.#orbitControls.minDistance = 1
    this.#orbitControls.minPolarAngle = Math.PI / 3 // radians
    this.#orbitControls.maxPolarAngle = (2 * Math.PI) / 3 // radians
    this.#originPosition.copy(camera.position)
    this.setTargetOnFront()

    // Limit the raycaster distance
    this.#raycaster.far = 20
    this.#raycaster.firstHitOnly = true

    // Add event listener
    const _onKeyDown = this.onKeyDown.bind(this)
    const _onMouseDown = this.onMouseDown.bind(this)
    const _onMouseUp = this.onMouseUp.bind(this)
    window.addEventListener('keydown', _onKeyDown)
    canvas.addEventListener('mousedown', _onMouseDown)
    canvas.addEventListener('mouseup', _onMouseUp)

    this.dispose = () => {
      this.#orbitControls.dispose()
      window.removeEventListener('keydown', _onKeyDown)
      canvas.removeEventListener('mousedown', _onMouseDown)
      canvas.removeEventListener('mouseup', _onMouseUp)
    }
  }

  get postTargets() {
    return this.targets.filter((target) => target.userData.isPost)
  }

  get position() {
    return this.camera.position
  }

  get rotationY() {
    return Math.PI - this.camera.rotation.y
  }

  // Raycast on Ctrl key for keyboard accessibility
  onKeyDown(event: KeyboardEvent) {
    if (!this.enabled) return

    switch (event.code) {
      case 'ControlLeft':
        event.preventDefault()
        this.raycastTargets(_canvasOrigin)
        break
    }
  }

  onMouseDown(e: MouseEvent) {
    this.#mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    this.#mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
  }

  onMouseUp(e: MouseEvent) {
    // Disable if it's dragged
    const prevX = this.#mouse.x
    const prevY = this.#mouse.y
    this.#mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    this.#mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    if (Math.abs(prevX - this.#mouse.x) > DRAG_THRESHOLD || Math.abs(prevY - this.#mouse.y) > DRAG_THRESHOLD) return

    this.raycastTargets()
  }

  setPosition(x: number, y: number, z: number) {
    this.camera.position.set(x, y, z)
    this.#originPosition.copy(this.camera.position)
    this.setTargetOnFront()
  }

  setQuaternion(x: number, y: number, z: number) {
    this.camera.rotation.set(x, y, z)
    this.setTargetOnFront()
  }

  setTargetOnFront() {
    const cameraDirection = _frontDirection.applyQuaternion(this.camera.quaternion)
    this.#orbitControls.target = this.camera.position.clone().add(cameraDirection)
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
    // calculate distance and duration
    const distance = this.camera.position.distanceTo(post.position)
    const duration = Math.max(this.minDuration, Math.min(distance / 10, this.maxDuration))

    // get target position
    const targetPosition = new THREE.Vector3(0, 0, this.offsetDistance * Number(post.userData.width) || this.offsetDistance)
    targetPosition.applyQuaternion(post.quaternion)
    targetPosition.add(post.position)

    this.isMoving = true
    this.#orbitControls.enabled = false
    gsap.to(this.camera.position, {
      duration,
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
    })

    gsap.to(this.camera.rotation, {
      duration: duration,
      x: post.rotation.x,
      y: post.rotation.y,
      z: post.rotation.z,
      onComplete: () => {
        this.#originPosition.copy(this.camera.position)
        this.#orbitControls.target = post.position
        this.#orbitControls.enabled = true
        this.isMoving = false
      },
    })
  }

  raycastTargets(origin?: THREE.Vector2) {
    if (this.isMoving) return
    this.#raycaster.setFromCamera(origin ?? this.#mouse, this.camera)
    const intersects = this.#raycaster.intersectObjects(this.targets)
    return intersects[0]
  }

  update(delta: number) {
    if (this.isMoving) return
    const movementSpeed = _vector3.copy(this.#originPosition).sub(this.camera.position).multiplyScalar(delta)
    this.camera.position.add(movementSpeed)
    this.#orbitControls.update()
  }
}

export default MouseControls
