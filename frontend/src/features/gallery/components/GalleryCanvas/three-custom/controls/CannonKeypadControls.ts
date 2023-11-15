import { Body, Box, Quaternion, Vec3, World } from 'cannon-es'
import { Quaternion as ThreeQuaternion, Vector3 } from 'three'

const _xAxis = new Vec3(1, 0, 0)
const _yAxis = new Vec3(0, 1, 0)
const _zAxis = new Vec3(0, 0, 1)
const _forceDirection = new Vec3()
const _cameraDirection = new Vector3()
const _rotationQuaternion = new Quaternion()
const _cannonQuaternion = new ThreeQuaternion()

export class CannonKeypadControls {
  camera: THREE.Camera
  world: World
  height: number
  cannonBody: Body

  // API
  enabled: boolean = true

  movementSpeed: number = 1
  lookSpeed: number = 0.4

  dispose: () => void

  // internals
  #targetPosition = new Vec3()
  #targetQuaternion = new Quaternion()

  #lookLeft: number = 0
  #lookRight: number = 0

  #moveForward: boolean = false
  #moveBackward: boolean = false

  constructor(camera: THREE.Camera, world: World, height: number = 1.6) {
    this.camera = camera
    this.world = world
    this.height = height

    // Create cannon body
    const shape = new Box(new Vec3(0.2, height / 2, 0.2))
    this.cannonBody = new Body({
      mass: 60,
      position: new Vec3(
        this.camera.position.x,
        this.camera.position.y - height / 2,
        this.camera.position.z
      ),
      shape,
      fixedRotation: true,
    })
    this.cannonBody.quaternion.setFromAxisAngle(new Vec3(0, 1, 0), this.camera.rotation.y)
    this.world.addBody(this.cannonBody)

    // Add event listener
    const _onKeyDown = this.onKeyDown.bind(this)
    const _onKeyUp = this.onKeyUp.bind(this)

    window.addEventListener('keydown', _onKeyDown)
    window.addEventListener('keyup', _onKeyUp)

    // Set dispose function
    this.dispose = () => {
      this.world.removeBody(this.cannonBody)
      window.removeEventListener('keydown', _onKeyDown)
      window.removeEventListener('keyup', _onKeyUp)
    }
  }

  /**
   * Keydown event handler
   */
  onKeyDown(event: KeyboardEvent) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        this.#moveForward = true
        break

      case 'ArrowLeft':
      case 'KeyA':
        this.#lookLeft = -1
        break

      case 'ArrowDown':
      case 'KeyS':
        this.#moveBackward = true
        break

      case 'ArrowRight':
      case 'KeyD':
        this.#lookRight = 1
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
        this.#moveForward = false
        break

      case 'ArrowLeft':
      case 'KeyA':
        this.#lookLeft = 0
        break

      case 'ArrowDown':
      case 'KeyS':
        this.#moveBackward = false
        break

      case 'ArrowRight':
      case 'KeyD':
        this.#lookRight = 0
        break
    }
  }

  update(delta: number) {
    if (!this.enabled) return

    /**
     * Update cannonBody position
     */
    this.cannonBody.velocity.set(0, 0, 0)

    if (this.#moveForward || this.#moveBackward) {
      const actualMoveSpeed = 10000 * this.movementSpeed
      this.camera.getWorldDirection(_cameraDirection).normalize().multiplyScalar(actualMoveSpeed)

      if (this.#moveForward) {
        this.cannonBody.applyForce(
          _forceDirection.set(_cameraDirection.x, _cameraDirection.y, _cameraDirection.z)
        )
      }
      if (this.#moveBackward) {
        this.cannonBody.applyForce(
          _forceDirection.set(-_cameraDirection.x, -_cameraDirection.y, -_cameraDirection.z)
        )
      }
    }

    /**
     * Update cannonBody angle
     */

    if (this.#lookLeft || this.#lookRight) {
      const actualLookSpeed = delta * this.lookSpeed

      const currentQuaternion = this.cannonBody.quaternion
      _rotationQuaternion.set(0, 0, 0, 1)
      if (this.#lookLeft) _rotationQuaternion.setFromAxisAngle(_yAxis, actualLookSpeed)
      if (this.#lookRight) _rotationQuaternion.setFromAxisAngle(_yAxis, -actualLookSpeed)

      this.cannonBody.quaternion.copy(
        currentQuaternion.mult(_rotationQuaternion, currentQuaternion)
      )
    }

    /**
     * Move camera to the cannonBody
     */
    this.camera.position.x = this.cannonBody.position.x
    this.camera.position.y = this.cannonBody.position.y + this.height
    this.camera.position.z = this.cannonBody.position.z
    this.camera.quaternion.copy(
      _cannonQuaternion.set(
        this.cannonBody.quaternion.x,
        this.cannonBody.quaternion.y,
        this.cannonBody.quaternion.z,
        this.cannonBody.quaternion.w
      )
    )
  }
}
