import { Body, Box, Quaternion, Vec3, World } from 'cannon-es'
import { Quaternion as ThreeQuaternion, Vector3 } from 'three'

export class CannonKeypadControls {
  camera: THREE.Camera
  world: World
  cannonBody: Body

  // API
  enabled: boolean = true

  movementSpeed: number = 8
  lookSpeed: number = 0.5

  dispose: () => void

  // internals
  #targetPosition = new Vec3()
  #targetQuaternion = new Quaternion()

  #lookLeft: number = 0
  #lookRight: number = 0

  #moveForward: boolean = false
  #moveBackward: boolean = false

  constructor(camera: THREE.Camera, world: World) {
    this.camera = camera
    this.world = world
    // const shape = new Cylinder(0.3, 0.3, 1.8, 20)
    const shape = new Box(new Vec3(0.2, 0.9, 0.2))
    this.cannonBody = new Body({
      mass: 60,
      position: new Vec3(
        this.camera.position.x,
        this.camera.position.y - 0.7,
        this.camera.position.z
      ),
      shape,
    })

    this.cannonBody.quaternion.setFromAxisAngle(new Vec3(0, 1, 0), this.camera.rotation.y)
    this.world.addBody(this.cannonBody)

    const _onKeyDown = this.onKeyDown.bind(this)
    const _onKeyUp = this.onKeyUp.bind(this)

    window.addEventListener('keydown', _onKeyDown)
    window.addEventListener('keyup', _onKeyUp)

    this.dispose = () => {
      window.removeEventListener('keydown', _onKeyDown)
      window.removeEventListener('keyup', _onKeyUp)
    }
  }

  onKeyDown(event: KeyboardEvent) {
    switch (event.code) {
      // forward
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
    const actualMoveSpeed = delta * this.movementSpeed

    const currentPosition = this.cannonBody.position

    const cameraDirection = this.camera
      .getWorldDirection(new Vector3())
      .multiplyScalar(actualMoveSpeed)

    if (this.#moveForward) {
      currentPosition.x += cameraDirection.x * actualMoveSpeed
      currentPosition.z += cameraDirection.z * actualMoveSpeed
      this.cannonBody.position.copy(currentPosition)
    }
    if (this.#moveBackward) {
      currentPosition.x -= cameraDirection.x * actualMoveSpeed
      currentPosition.z -= cameraDirection.z * actualMoveSpeed
      this.cannonBody.position.copy(currentPosition)
    }

    this.cannonBody.quaternion.x = 0
    this.cannonBody.quaternion.z = 0

    // this.cannonBody.force.set(cameraDirection.x, 0, cameraDirection.z)

    /**
     * Update cannonBody angle
     */
    const actualLookSpeed = delta * this.lookSpeed

    const currentQuaternion = this.cannonBody.quaternion
    const rotationQuaternion = new Quaternion()
    if (this.#lookLeft) rotationQuaternion.setFromAxisAngle(new Vec3(0, 1, 0), actualLookSpeed)
    if (this.#lookRight) rotationQuaternion.setFromAxisAngle(new Vec3(0, 1, 0), -actualLookSpeed)

    // Apply this rotation to your current quaternion
    this.cannonBody.quaternion.copy(currentQuaternion.mult(rotationQuaternion, currentQuaternion))

    /**
     * Move camera to the cannonBody
     */
    this.camera.position.x = this.cannonBody.position.x
    this.camera.position.y = this.cannonBody.position.y + 0.7
    this.camera.position.z = this.cannonBody.position.z

    this.camera.quaternion.copy(
      new ThreeQuaternion(
        this.cannonBody.quaternion.x,
        this.cannonBody.quaternion.y,
        this.cannonBody.quaternion.z,
        this.cannonBody.quaternion.w
      )
    )
  }
}
