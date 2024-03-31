import * as THREE from 'three'
import { acceleratedRaycast } from 'three-mesh-bvh'
import { IPlayer } from '../items/Player/Player'

const _downDirection = new THREE.Vector3(0, -1, 0)
const _groundOffset = 0.3
const MOVE_SPEED_FACTOR = 5
const ROTATE_SPEED_FACTOR = 0.6

THREE.Mesh.prototype.raycast = acceleratedRaycast

export class KeypadControls {
  // arguments
  scene: THREE.Scene
  camera: THREE.Camera
  gravity: number
  jumpForce: number
  maxFallSpeed: number

  // API
  enabled: boolean = true
  obstacles: THREE.Object3D<THREE.Object3DEventMap>[] = [] // Array for obstacle meshes
  floors: THREE.Object3D<THREE.Object3DEventMap>[] = [] // Array for floor meshes
  dispose: () => void

  // camera & character group
  #group: THREE.Group = new THREE.Group()
  #cameraOffset: THREE.Vector3 = new THREE.Vector3(0, 4, -6)

  // character
  #character: IPlayer | null = null
  #activeAction: THREE.AnimationAction | null = null

  // raycasting
  #raycaster = new THREE.Raycaster()

  // movement variables
  #lookDirection = new THREE.Vector3()

  #moveSpeed: number = 1
  #moveForwardRatio: number = 0
  #moveBackwardRatio: number = 0

  #rotateSpeed: number = 1
  #rotateRightRatio: number = 0
  #rotateLeftRatio: number = 0

  // falling variables
  #isJump: boolean = false
  #isFloating: boolean = false
  #floatingDuration: number = 0

  constructor(scene: THREE.Scene, camera: THREE.Camera, gravity: number = 10, jumpForce: number = 10, maxFallSpeed: number = 7) {
    this.scene = scene
    this.camera = camera
    this.gravity = gravity
    this.jumpForce = jumpForce
    this.maxFallSpeed = maxFallSpeed

    // Make a group
    this.scene.add(this.#group)
    this.scene.remove(this.camera)
    this.camera.position.copy(this.#cameraOffset)
    this.#group.add(this.camera)
    this.camera.lookAt(new THREE.Vector3(0, 3, 0).add(this.#group.position))

    // Limit the raycaster distance
    this.#raycaster.far = 10
    this.#raycaster.firstHitOnly = true

    // Set the orientation of the camera
    this.setOrientation()

    // Add event listener
    const _onKeyDown = this.onKeyDown.bind(this)
    const _onKeyUp = this.onKeyUp.bind(this)
    window.addEventListener('keydown', _onKeyDown)
    window.addEventListener('keyup', _onKeyUp)

    // Set dispose function: Release resources
    this.dispose = () => {
      this.#group.remove(this.camera)
      this.#character && this.#group.remove(this.#character.object)
      this.scene.remove(this.#group)
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
        this.#rotateLeftRatio = 0
        this.#rotateRightRatio = 1
        break

      case 'ArrowLeft':
      case 'KeyA':
        event.preventDefault()
        this.#rotateLeftRatio = 1
        this.#rotateRightRatio = 0
        break

      case 'AltLeft':
        event.preventDefault()
        this.jump()
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
        this.#rotateRightRatio = 0
        break

      case 'ArrowLeft':
      case 'KeyA':
        this.#rotateLeftRatio = 0
        break
    }
  }

  set moveSpeed(speed: number) {
    if (speed > 0) this.#moveSpeed = speed
    else this.#moveSpeed = 1.6
  }

  set moveSpeedRatio(speed: number) {
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

  set rotateSpeed(speed: number) {
    if (speed > 0) this.#rotateSpeed = speed
    else this.#rotateSpeed = 1.5
  }

  set rotateSpeedRatio(speed: number) {
    if (speed > 1) {
      this.#rotateRightRatio = 1
      this.#rotateLeftRatio = 0
    } else if (speed > 0) {
      this.#rotateRightRatio = speed
      this.#rotateLeftRatio = 0
    } else if (speed < -1) {
      this.#rotateRightRatio = 0
      this.#rotateLeftRatio = 1
    } else {
      this.#rotateRightRatio = 0
      this.#rotateLeftRatio = -speed
    }
  }

  set character(character: IPlayer) {
    if (this.#character) {
      this.#group.remove(this.#character.object)
    }

    this.#character = character
    this.#group.add(this.#character.object)

    this.#character.actions.jump.setLoop(THREE.LoopRepeat, 1)
    this.#character.actions.jump.clampWhenFinished = true
    this.#character.mixer.addEventListener('finished', (e) => {
      if (e.action === this.#character?.actions.jump) {
        this.#isJump = false
      }
    })
  }

  /**
   * Set camera offset
   */
  set cameraOffset(offset: THREE.Vector3) {
    this.#cameraOffset.copy(offset)
    this.camera.position.copy(this.#cameraOffset)
  }

  /**
   * Set camera orientation of rotation
   */
  setOrientation() {
    this.#group.getWorldDirection(this.#lookDirection)
    this.#isFloating = false
    this.#floatingDuration = 0
  }

  /**
   * Set camera position
   */
  setPosition(x: number, y: number, z: number) {
    this.#group.position.set(x, y, z)
    this.setOrientation()
  }

  /**
   * Set camera rotation
   */
  setQuaternion(x: number, y: number, z: number) {
    this.#group.rotation.set(x, y, z)
    this.setOrientation()
  }

  /**
   * animations
   */

  fadeToAction(action: THREE.AnimationAction, duration: number = 0.5) {
    const previousAction = this.#activeAction
    this.#activeAction = action

    if (previousAction !== this.#activeAction) {
      previousAction && previousAction.fadeOut(duration)
      this.#activeAction.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(duration).play()
    }
  }

  /**
   * Jump
   */
  jump() {
    this.#isJump = true
  }

  /**
   * Move camera tagging along with cannon body
   */
  update(delta: number) {
    if (!this.enabled || !this.#character) return

    // Rotate group
    const actualRotateSpeed = delta * this.#rotateSpeed * (this.#rotateLeftRatio - this.#rotateRightRatio) * ROTATE_SPEED_FACTOR
    this.#group.rotateY(actualRotateSpeed)

    // Move group detecting obstacles
    let intersects
    let actualMoveSpeed = 0
    if (this.#moveForwardRatio || this.#moveBackwardRatio) {
      actualMoveSpeed = delta * this.#moveSpeed * (this.#moveForwardRatio - this.#moveBackwardRatio) * MOVE_SPEED_FACTOR
      this.#character.object.getWorldDirection(this.#lookDirection) // update rotateDriection which the camera is rotateings
      if (actualMoveSpeed < 0) this.#lookDirection.negate()
      for (const point of [0, this.#character.size.height * (this.#isJump ? 0.5 : 1) - 0.4]) {
        this.#raycaster.set(new THREE.Vector3(0, this.#character.size.height - point, 0).add(this.#group.position), this.#lookDirection)
        intersects = this.#raycaster.intersectObjects(this.obstacles)
        if (intersects.length && intersects[0].distance < 0.5) {
          actualMoveSpeed = 0
          break
        }
      }
    }
    this.#group.translateZ(actualMoveSpeed)

    // Position vertically
    this.#raycaster.set(new THREE.Vector3(0, this.#character.size.height, 0).add(this.#group.position), _downDirection)
    intersects = this.#raycaster.intersectObjects(this.floors)
    if (intersects.length && intersects[0].distance < this.#character.size.height + 1) {
      // grounded
      this.#isFloating = false
      this.#floatingDuration = 0
      this.#group.position.y += this.#character.size.height - intersects[0].distance
    } else {
      // falling
      this.#isFloating = true
      this.#floatingDuration += delta
      const fallspeed = Math.min(this.gravity * this.#floatingDuration ** 2 * 10, this.maxFallSpeed)
      this.#group.position.y -= delta * fallspeed
    }

    // Animation Update
    this.#character.mixer.update(delta)
    if (this.#isJump) {
      this.fadeToAction(this.#character.actions.jump)
    } else if (this.#isFloating) {
      this.fadeToAction(this.#character.actions.fall)
    } else if (!actualMoveSpeed) {
      this.fadeToAction(this.#character.actions.idle)
    } else if (actualMoveSpeed > 0) {
      this.fadeToAction(this.#character.actions.run)
    } else {
      this.fadeToAction(this.#character.actions.runBackward)
    }
  }
}
