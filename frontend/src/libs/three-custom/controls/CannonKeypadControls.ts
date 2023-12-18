import { Body, Box, Quaternion, Vec3, World } from 'cannon-es'
import { Quaternion as ThreeQuaternion, Vector3, Raycaster } from 'three'

const _xAxis = new Vec3(1, 0, 0)
const _yAxis = new Vec3(0, 1, 0)
const _zAxis = new Vec3(0, 0, 1)
const _forceDirection = new Vec3()
const _raycasterDirection = new Vector3(0, -1, 0)
const _cameraDirection = new Vector3()
const _rotationQuaternion = new Quaternion()
const _cannonQuaternion = new ThreeQuaternion()

export class CannonKeypadControls {
  // arguments
  canvas: HTMLCanvasElement
  camera: THREE.Camera
  world: World
  height: number

  // internals
  #cannonBody: Body
  #raycaster: Raycaster = new Raycaster()

  #movementSpeed: number = 0
  #maxMovementSpeed: number = 1.6

  #lookSpeed: number = 0
  #maxLookSpeed: number = 0.6

  // API
  enabled: boolean = true
  floors: THREE.Object3D<THREE.Object3DEventMap>[] = [] // Array for floor meshes

  dispose: () => void

  constructor(canvas: HTMLCanvasElement, camera: THREE.Camera, world: World, height: number = 1.6) {
    this.canvas = canvas
    this.camera = camera
    this.world = world
    this.height = height

    // Create cannon body
    const shape = new Box(new Vec3(0.2, height / 2, 0.2))
    this.#cannonBody = new Body({
      mass: 40,
      position: new Vec3(
        this.camera.position.x,
        this.camera.position.y - height / 2,
        this.camera.position.z
      ),
      shape,
      fixedRotation: true,
    })
    const quaternionX = new Quaternion()
    const quaternionY = new Quaternion()
    const quaternionZ = new Quaternion()

    quaternionX.setFromAxisAngle(new Vec3(1, 0, 0), this.camera.rotation.x)
    quaternionY.setFromAxisAngle(new Vec3(0, 1, 0), this.camera.rotation.y)
    quaternionZ.setFromAxisAngle(new Vec3(0, 0, 1), this.camera.rotation.z)

    this.#cannonBody.quaternion.copy(quaternionX.mult(quaternionY).mult(quaternionZ))
    this.world.addBody(this.#cannonBody)

    // Add event listener
    const _onKeyDown = this.onKeyDown.bind(this)
    const _onKeyUp = this.onKeyUp.bind(this)

    window.addEventListener('keydown', _onKeyDown)
    window.addEventListener('keyup', _onKeyUp)

    // Set dispose function: Release resources
    this.dispose = () => {
      this.world.removeBody(this.#cannonBody)

      window.removeEventListener('keydown', _onKeyDown)
      window.removeEventListener('keyup', _onKeyUp)
    }
  }

  /**
   * Set cannonBody position
   */
  setPosition(x: number, y: number, z: number) {
    this.#cannonBody.position.x = x
    this.#cannonBody.position.y = y
    this.#cannonBody.position.z = z
  }

  /**
   * Set cannonBody quaternion
   */
  setQuaternion(x: number, y: number, z: number) {
    this.#cannonBody.quaternion.x = x
    this.#cannonBody.quaternion.y = y
    this.#cannonBody.quaternion.z = z
  }

  /**
   * Set movementSpeed
   */
  set movementSpeed(speed: number) {
    if (speed > 1) this.#movementSpeed = 1
    else if (speed < -1) this.#movementSpeed = -1
    else this.#movementSpeed = speed
  }

  /**
   * Set maxMovementSpeed
   */
  set maxMovementSpeed(speed: number) {
    if (speed > 0) this.#maxMovementSpeed = speed
    else this.#maxMovementSpeed = 1.6
  }

  /**
   * Set lookSpeed
   */
  set lookSpeed(speed: number) {
    if (speed > 1) this.#lookSpeed = 1
    else if (speed < -1) this.#lookSpeed = -1
    else this.#lookSpeed = speed
  }

  /**
   * Set maxLookSpeed
   */
  set maxLookSpeed(speed: number) {
    if (speed > 0) this.#maxLookSpeed = speed
    else this.#maxLookSpeed = 1.6
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
        this.#movementSpeed = 1
        break

      case 'ArrowLeft':
      case 'KeyA':
        event.preventDefault()
        this.#lookSpeed = 1
        break

      case 'ArrowDown':
      case 'KeyS':
        event.preventDefault()
        this.#movementSpeed = -1
        break

      case 'ArrowRight':
      case 'KeyD':
        event.preventDefault()
        this.#lookSpeed = -1
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
        this.#movementSpeed = 0
        break

      case 'ArrowLeft':
      case 'KeyA':
        this.#lookSpeed = 0
        break

      case 'ArrowDown':
      case 'KeyS':
        this.#movementSpeed = 0
        break

      case 'ArrowRight':
      case 'KeyD':
        this.#lookSpeed = 0
        break
    }
  }

  /**
   * Move camera tagging along with cannon body
   */
  update(delta: number) {
    if (!this.enabled) return

    // Position the cannonBody on the floor
    this.#raycaster.set(this.camera.position, _raycasterDirection)

    const intersects = this.#raycaster.intersectObjects(this.floors)
    for (const item of intersects) {
      this.#cannonBody.position.y += this.height - item.distance
      break
    }

    // Move cannonBody forward or backward
    this.#cannonBody.velocity.set(0, 0, 0)

    if (this.#movementSpeed) {
      const actualMoveSpeed = 10000 * this.#movementSpeed * this.#maxMovementSpeed
      this.camera.getWorldDirection(_cameraDirection).normalize().multiplyScalar(actualMoveSpeed)

      this.#cannonBody.applyForce(
        _forceDirection.set(_cameraDirection.x, _cameraDirection.y, _cameraDirection.z)
      )
    }

    // Rotate cannonBody angle
    if (this.#lookSpeed) {
      const actualLookSpeed = delta * this.#lookSpeed * this.#maxLookSpeed
      _rotationQuaternion.setFromAxisAngle(_yAxis, actualLookSpeed)

      const currentQuaternion = this.#cannonBody.quaternion
      this.#cannonBody.quaternion.copy(
        currentQuaternion.mult(_rotationQuaternion, currentQuaternion)
      )
    }

    // Move camera to the cannonBody
    this.camera.position.x = this.#cannonBody.position.x
    this.camera.position.y = this.#cannonBody.position.y + this.height
    this.camera.position.z = this.#cannonBody.position.z
    this.camera.quaternion.copy(
      _cannonQuaternion.set(
        this.#cannonBody.quaternion.x,
        this.#cannonBody.quaternion.y,
        this.#cannonBody.quaternion.z,
        this.#cannonBody.quaternion.w
      )
    )
  }
}
