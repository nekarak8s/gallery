import { Vector3, Raycaster, Spherical, MathUtils } from 'three'

const _downDirection = new Vector3(0, -1, 0)

export class KeypadControls {
  // arguments
  canvas: HTMLCanvasElement
  camera: THREE.Camera
  height: number

  // internals
  #raycaster: Raycaster = new Raycaster()

  #movementSpeedRatio: number = 0
  #movementSpeed: number = 1

  #lookSpeedRatio: number = 0
  #LookSpeed: number = 1.5

  #lookDirection = new Vector3()
  #spherical = new Spherical()
  #target = new Vector3()

  // #lat = 0
  #lon = 0

  // API
  enabled: boolean = true
  obstacles: THREE.Object3D<THREE.Object3DEventMap>[] = [] // Array for obstacle meshes
  floors: THREE.Object3D<THREE.Object3DEventMap>[] = [] // Array for floor meshes

  dispose: () => void

  constructor(canvas: HTMLCanvasElement, camera: THREE.Camera, height: number = 1.6) {
    this.canvas = canvas
    this.camera = camera
    this.height = height

    // Add event listener
    const _onKeyDown = this.onKeyDown.bind(this)
    const _onKeyUp = this.onKeyUp.bind(this)

    window.addEventListener('keydown', _onKeyDown)
    window.addEventListener('keyup', _onKeyUp)

    this.setOrientation()

    // Set dispose function: Release resources
    this.dispose = () => {
      window.removeEventListener('keydown', _onKeyDown)
      window.removeEventListener('keyup', _onKeyUp)
    }
  }

  /**
   * Set movement speed ratio
   */
  set movementSpeedRatio(speed: number) {
    if (speed > 1) this.#movementSpeedRatio = 1
    else if (speed < -1) this.#movementSpeedRatio = -1
    else this.#movementSpeedRatio = speed
  }

  /**
   * Set movement speed
   */
  set movementSpeed(speed: number) {
    if (speed > 0) this.#movementSpeed = speed
    else this.#movementSpeed = 1.6
  }

  /**
   * Set lookSpeedRatio
   */
  set lookSpeedRatio(speed: number) {
    if (speed > 1) this.#lookSpeedRatio = 1
    else if (speed < -1) this.#lookSpeedRatio = -1
    else this.#lookSpeedRatio = speed
  }

  /**
   * Set LookSpeed
   */
  set LookSpeed(speed: number) {
    if (speed > 0) this.#LookSpeed = speed
    else this.#LookSpeed = 1.6
  }

  /**
   * Keydown event handler
   */
  onKeyDown(event: KeyboardEvent) {
    if (!this.enabled) return

    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        event.preventDefault()
        this.#movementSpeedRatio = 1
        break

      case 'ArrowLeft':
      case 'KeyA':
        event.preventDefault()
        this.#lookSpeedRatio = 1
        break

      case 'ArrowDown':
      case 'KeyS':
        event.preventDefault()
        this.#movementSpeedRatio = -1
        break

      case 'ArrowRight':
      case 'KeyD':
        event.preventDefault()
        this.#lookSpeedRatio = -1
        break
    }
  }

  /**
   * Keyup event handler
   */
  onKeyUp(event: KeyboardEvent) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        this.#movementSpeedRatio = 0
        break

      case 'ArrowLeft':
      case 'KeyA':
        this.#lookSpeedRatio = 0
        break

      case 'ArrowDown':
      case 'KeyS':
        this.#movementSpeedRatio = 0
        break

      case 'ArrowRight':
      case 'KeyD':
        this.#lookSpeedRatio = 0
        break
    }
  }

  /**
   * Set camera orientation of rotation
   */
  setOrientation() {
    const quaternion = this.camera.quaternion

    this.#lookDirection.set(0, 0, -1).applyQuaternion(quaternion)
    this.#spherical.setFromVector3(this.#lookDirection)

    // this.#lat = 90 - MathUtils.radToDeg(this.#spherical.phi)
    this.#lon = MathUtils.radToDeg(this.#spherical.theta)
  }

  /**
   * Move camera tagging along with cannon body
   */
  update(delta: number) {
    if (!this.enabled) return

    // Rotate camera
    const actualLookSpeed = delta * this.#lookSpeedRatio * this.#LookSpeed * 13

    this.#lon += actualLookSpeed
    const phi = MathUtils.degToRad(90)
    const theta = MathUtils.degToRad(this.#lon)
    this.#target.setFromSphericalCoords(1, phi, theta).add(this.camera.position)

    this.camera.lookAt(this.#target)

    // Move camera forward / backward
    let actualMoveSpeed = delta * this.#movementSpeedRatio * this.#movementSpeed * 8

    // Stop if there's an obstacle
    this.#raycaster.set(this.camera.position, this.#target)

    let intersects = this.#raycaster.intersectObjects(this.obstacles)

    // console.log(this.obstacles)
    for (const item of intersects) {
      //   console.log('item', item)
      if (item.distance < 1 && actualMoveSpeed > 0) {
        actualMoveSpeed = 0
      }
      break
    }
    this.camera.translateZ(-actualMoveSpeed)

    // Position the camera on floor
    this.#raycaster.set(this.camera.position, _downDirection)

    intersects = this.#raycaster.intersectObjects(this.floors)
    for (const item of intersects) {
      this.camera.position.y += this.height - item.distance
      break
    }
  }
}
