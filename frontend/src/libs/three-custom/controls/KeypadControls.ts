import * as THREE from 'three'

const _downDirection = new THREE.Vector3(0, -1, 0)
const _groundOffset = 0.3
const _floatPrecision = 0.001

export class KeypadControls {
  // arguments
  canvas: HTMLCanvasElement
  camera: THREE.Camera
  height: number
  gravity: number
  jumpForce: number
  maxFallSpeed: number

  // internals
  #raycaster = new THREE.Raycaster()

  #movementSpeed: number = 1
  #moveForwardRatio: number = 0
  #moveBackwardRatio: number = 0

  #LookSpeed: number = 1.5
  #lookRightRatio: number = 0
  #lookLeftRatio: number = 0

  // rotation variables
  #lookDirection = new THREE.Vector3()
  #spherical = new THREE.Spherical()
  #target = new THREE.Vector3()
  #lon: number = 0

  // jump variables
  #isJump: boolean = false
  #floatDuration: number = 0

  // API
  enabled: boolean = true
  obstacles: THREE.Object3D<THREE.Object3DEventMap>[] = [] // Array for obstacle meshes
  floors: THREE.Object3D<THREE.Object3DEventMap>[] = [] // Array for floor meshes

  dispose: () => void

  constructor(
    canvas: HTMLCanvasElement,
    camera: THREE.Camera,
    height: number = 1.6,
    gravity: number = 10,
    jumpForce: number = 10,
    maxFallSpeed: number = 7
  ) {
    this.canvas = canvas
    this.camera = camera
    this.height = height
    this.gravity = gravity
    this.jumpForce = jumpForce
    this.maxFallSpeed = maxFallSpeed

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
   * Keydown event handler
   */
  onKeyDown(event: KeyboardEvent) {
    if (!this.enabled) return

    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        event.preventDefault()
        this.#moveForwardRatio = 1
        this.#moveBackwardRatio = 0
        break

      case 'ArrowDown':
      case 'KeyS':
        event.preventDefault()
        this.#moveForwardRatio = 0
        this.#moveBackwardRatio = 1
        break

      case 'ArrowRight':
      case 'KeyD':
        event.preventDefault()
        this.#lookLeftRatio = 0
        this.#lookRightRatio = 1
        break

      case 'ArrowLeft':
      case 'KeyA':
        event.preventDefault()
        this.#lookLeftRatio = 1
        this.#lookRightRatio = 0
        break

      case 'AltLeft':
        event.preventDefault()
        if (this.#floatDuration === 0) {
          this.#isJump = true
        }
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
        this.#moveForwardRatio = 0
        break

      case 'ArrowDown':
      case 'KeyS':
        this.#moveBackwardRatio = 0
        break

      case 'ArrowRight':
      case 'KeyD':
        this.#lookRightRatio = 0
        break

      case 'ArrowLeft':
      case 'KeyA':
        this.#lookLeftRatio = 0
        break
    }
  }
  /**
   * Set movement speed
   */
  set movementSpeed(speed: number) {
    if (speed > 0) this.#movementSpeed = speed
    else this.#movementSpeed = 1.6
  }

  /**
   * Set movement speed ratio
   */
  set movementSpeedRatio(speed: number) {
    if (speed > 1) {
      this.#moveForwardRatio = 1
      this.#moveBackwardRatio = 0
    } else if (speed > 0) {
      this.#moveForwardRatio = speed
      this.#moveBackwardRatio = 0
    } else if (speed < -1) {
      this.#moveForwardRatio = 0
      this.#moveBackwardRatio = 1
    } else {
      this.#moveForwardRatio = 0
      this.#moveBackwardRatio = -speed
    }
  }

  /**
   * Set LookSpeed
   */
  set LookSpeed(speed: number) {
    if (speed > 0) this.#LookSpeed = speed
    else this.#LookSpeed = 1.6
  }

  /**
   * Set lookSpeedRatio
   */
  set lookSpeedRatio(speed: number) {
    if (speed > 1) {
      this.#lookRightRatio = 1
      this.#lookLeftRatio = 0
    } else if (speed > 0) {
      this.#lookRightRatio = speed
      this.#lookLeftRatio = 0
    } else if (speed < -1) {
      this.#lookRightRatio = 0
      this.#lookLeftRatio = 1
    } else {
      this.#lookRightRatio = 0
      this.#lookLeftRatio = -speed
    }
  }

  /**
   * Jump
   */
  jump() {
    if (this.#floatDuration === 0) {
      this.#isJump = true
    }
  }

  /**
   * Set camera orientation of rotation
   */
  setOrientation() {
    const quaternion = this.camera.quaternion

    this.#lookDirection.set(0, 0, -1).applyQuaternion(quaternion)
    this.#spherical.setFromVector3(this.#lookDirection)
    this.#lon = THREE.MathUtils.radToDeg(this.#spherical.theta)

    this.#isJump = false
    this.#floatDuration = 0
  }

  /**
   * Set camera position
   */
  setPosition(x: number, y: number, z: number) {
    this.camera.position.set(x, y, z)
    this.setOrientation()
  }

  /**
   * Set camera rotation
   */
  setQuaternion(x: number, y: number, z: number) {
    this.camera.rotation.set(x, y, z)
    this.setOrientation()
  }

  /**
   * Move camera tagging along with cannon body
   */
  update(delta: number) {
    if (!this.enabled) return

    // Rotate camera
    const actualLookSpeed =
      delta * this.#LookSpeed * (this.#lookLeftRatio - this.#lookRightRatio) * 17

    this.#lon += actualLookSpeed
    const phi = THREE.MathUtils.degToRad(90)
    const theta = THREE.MathUtils.degToRad(this.#lon)
    this.#target.setFromSphericalCoords(1, phi, theta).add(this.camera.position)

    this.camera.lookAt(this.#target)
    this.#lookDirection.set(0, 0, -1).applyQuaternion(this.camera.quaternion)

    // Move camera forward / backward
    let actualMoveSpeed =
      delta * this.#movementSpeed * (this.#moveForwardRatio - this.#moveBackwardRatio) * 5

    // Stop by obastacle
    let intersects
    if (actualMoveSpeed > 0) {
      // front obastacle
      this.#raycaster.set(this.camera.position, this.#lookDirection)
      intersects = this.#raycaster.intersectObjects(this.obstacles)
      if (intersects.length && intersects[0].distance < 1) {
        actualMoveSpeed = 0
      }
    } else {
      // backward obstacle
      this.#raycaster.set(this.camera.position, this.#lookDirection.negate())
      intersects = this.#raycaster.intersectObjects(this.obstacles)
      if (intersects.length && intersects[0].distance < 1) {
        actualMoveSpeed = 0
      }
    }
    this.camera.translateZ(-actualMoveSpeed)

    // Position the camera on the floor
    this.#raycaster.set(this.camera.position, _downDirection)
    intersects = this.#raycaster.intersectObjects(this.floors)

    let fallspeed =
      this.gravity * this.#floatDuration ** 2 * 10 - (this.#isJump ? this.jumpForce : 0)
    if (fallspeed > this.maxFallSpeed) fallspeed = this.maxFallSpeed // max fall speed

    if (intersects.length === 0) {
      this.#floatDuration += delta
      this.camera.position.y -= delta * fallspeed
      return
    }

    const distance = intersects[0].distance

    if (distance < this.height && this.#floatDuration) {
      this.#isJump = false
      this.#floatDuration = 0
      this.camera.position.y += this.height - distance
    } else if (distance < this.height + _groundOffset && !this.#isJump) {
      this.#floatDuration = 0
      this.camera.position.y += this.height - distance
    } else {
      this.#floatDuration += delta
      this.camera.position.y -= delta * fallspeed
    }
  }
}
