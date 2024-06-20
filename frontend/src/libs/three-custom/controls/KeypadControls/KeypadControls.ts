import gsap from 'gsap'
import * as THREE from 'three'
import { acceleratedRaycast } from 'three-mesh-bvh'
import { IControls } from '..'
import { IPlayer } from '../../items/Player/Player'
import './KeypadControls.scss'

const _canvasOrigin = new THREE.Vector2(0, 0)
const _downDirection = new THREE.Vector3(0, -1, 0)
const _epsilon = 0.001

const MOVE_SPEED_FACTOR = 5
const ROTATE_SPEED_FACTOR = 0.6

const FLOOR_PASS_THRESHOLD = 0.5
const OBSTACLE_DETECT_DISTANCE = 1
const FALL_ANIMATION_HEIGHT = 0.8

const CAMERA_OFFSET = new THREE.Vector3(0, 2.7, -4) // camera offset from the character's foot
const CAMERA_LOOK_AT = new THREE.Vector3(0, 2.7, 2)

const CHARACTER_CHANGE_SPEED = 500 //ms

THREE.Mesh.prototype.raycast = acceleratedRaycast

type KeypadControlsArgs = {
  canvas: HTMLCanvasElement
  scene: THREE.Scene
  camera: THREE.Camera
  gravity: number
  jumpForce: number
  maxFallSpeed: number
}

class KeypadControls implements IControls {
  // arguments
  canvas: HTMLCanvasElement
  scene: THREE.Scene
  camera: THREE.Camera
  gravity: number
  jumpForce: number
  maxFallSpeed: number

  // API
  enabled: boolean = true
  obstacles: THREE.Object3D<THREE.Object3DEventMap>[] = [] // Array for obstacle meshes
  floors: THREE.Object3D<THREE.Object3DEventMap>[] = [] // Array for floor meshes
  targets: THREE.Object3D<THREE.Object3DEventMap>[] = [] // Array for raycastering frames
  dispose: () => void

  // camera & character group
  #group: THREE.Group = new THREE.Group()
  #cameraOffset: THREE.Vector3 = CAMERA_OFFSET

  // character
  #character: IPlayer | null = null
  #activeAction: THREE.AnimationAction | null = null

  // raycasting
  #raycaster = new THREE.Raycaster()
  #numRaycasters: number = 2

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

  // optional features
  onControl?: () => unknown
  onEsc?: () => unknown

  constructor({ canvas, scene, camera, gravity = 10, jumpForce = 10, maxFallSpeed = 7 }: KeypadControlsArgs) {
    this.canvas = canvas
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
    this.camera.lookAt(CAMERA_LOOK_AT.add(this.#group.position))
    this.#group.rotation.order = 'YXZ'

    // Limit the raycaster distance
    this.#raycaster.far = 20
    this.#raycaster.firstHitOnly = true

    // Set the orientation of the camera
    this.initOrientation()

    // Add visual target(+) of raycaster
    const target = document.createElement('div')
    target.id = 'target'
    this.canvas.parentNode!.insertBefore(target, canvas.nextSibling)

    // Add event listener
    const _onKeyDown = this.onKeyDown.bind(this)
    const _onKeyUp = this.onKeyUp.bind(this)
    window.addEventListener('keydown', _onKeyDown)
    window.addEventListener('keyup', _onKeyUp)

    // Set dispose function: Release resources
    this.dispose = () => {
      this.scene.remove(this.#group)
      this.#group.remove(this.camera)
      if (this.#character) {
        this.#group.remove(this.#character.object)
        this.#character.dispose()
      }
      target.remove()

      window.removeEventListener('keydown', _onKeyDown)
      window.removeEventListener('keyup', _onKeyUp)
    }
  }

  get position() {
    return this.#group.position
  }

  get rotationY() {
    return -this.#group.rotation.y
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

      case 'ControlLeft':
        event.preventDefault()
        this.raycastTargets()
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

  set character(player: IPlayer) {
    // hide the character
    if (this.#character) {
      gsap.to(this.#character.object.position, {
        duration: CHARACTER_CHANGE_SPEED / 1000,
        y: -1,
        z: this.camera.position.z,
        ease: 'power1.out',
      })
    }

    setTimeout(
      () => {
        // dispose the previous character
        if (this.#character) {
          this.#group.remove(this.#character.object)
          this.#character.dispose()
        }

        // set the new character
        this.#character = player
        this.#character.object.position.set(0, -1, this.#cameraOffset.z)
        this.#group.add(this.#character.object)

        // set the character animation
        this.#character.actions.jump.setLoop(THREE.LoopRepeat, 1)
        this.#character.actions.jump.clampWhenFinished = true
        this.#character.mixer.addEventListener('finished', (e) => {
          if (e.action === this.#character?.actions.jump) {
            this.#isJump = false
          }
        })

        // show the character again
        gsap.to(this.#character.object.position, {
          duration: CHARACTER_CHANGE_SPEED / 1000,
          y: 0,
          z: 0,
          ease: 'power1.in',
        })
      },
      this.#character ? CHARACTER_CHANGE_SPEED : 0
    )
  }

  set cameraOffset(offset: THREE.Vector3) {
    this.#cameraOffset.copy(offset)
    this.camera.position.copy(this.#cameraOffset)
  }

  /**
   * Raycast targets
   */
  raycastTargets() {
    this.#raycaster.setFromCamera(_canvasOrigin, this.camera)
    const intersects = this.#raycaster.intersectObjects(this.targets)
    return intersects[0]
  }

  /**
   * Character moving raycaster
   */
  set numRaycasters(num: number) {
    if (num < 2) return
    this.#numRaycasters = num
  }

  resetNumRaycasters() {
    this.#numRaycasters = 2
  }

  /**
   * Set position & rotation
   */
  initOrientation() {
    this.#group.getWorldDirection(this.#lookDirection)
    this.#isFloating = false
    this.#floatingDuration = 0
  }

  setPosition(x: number, y: number, z: number) {
    this.#group.position.set(x, y, z)
    this.initOrientation()
  }

  setQuaternion(x: number, y: number, z: number) {
    this.#group.rotation.set(x, y, z)
    this.initOrientation()
  }

  /**
   * Animation
   */
  fadeToAction(action: THREE.AnimationAction, duration: number = 0.5) {
    const previousAction = this.#activeAction
    this.#activeAction = action

    if (previousAction !== this.#activeAction) {
      previousAction && previousAction.fadeOut(duration)
      this.#activeAction.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(duration).play()
    }
  }

  jump() {
    if (this.#isFloating) return
    this.#isJump = true
  }

  /**
   * Update the character's position and animation
   */
  update(delta: number) {
    if (!this.enabled || !this.#character) return

    let intersects

    // Position vertically
    this.#raycaster.set(new THREE.Vector3(0, this.#character.size.height, 0).add(this.#group.position), _downDirection)
    intersects = this.#raycaster.intersectObjects(this.floors)

    if (!intersects.length) return // Don't update if the floor is not detected

    if (intersects[0].distance < this.#character.size.height) {
      // grounded
      this.#isFloating = false
      this.#floatingDuration = 0
      // update the position proportional to the distance from the floor
      const factor = 4 * ((this.#character.size.height - intersects[0].distance) / this.#character.size.height)
      this.#group.position.y += Math.min(this.#character.size.height - intersects[0].distance, (factor + 1) * delta)
    } else if (intersects[0].distance - this.#character.size.height > _epsilon) {
      // falling
      if (!intersects.length || intersects[0].distance > this.#character.size.height + FALL_ANIMATION_HEIGHT) {
        this.#isFloating = true
      }
      this.#floatingDuration += delta
      const fallspeed = Math.min(this.gravity * this.#floatingDuration ** 2 * 10, this.maxFallSpeed)
      this.#group.position.y -= delta * fallspeed
    }

    // Rotate group
    const actualRotateSpeed = delta * this.#rotateSpeed * (this.#rotateLeftRatio - this.#rotateRightRatio) * ROTATE_SPEED_FACTOR
    this.#group.rotateY(actualRotateSpeed)

    // Move group detecting obstacles
    let actualMoveSpeed = 0

    if (this.#moveForwardRatio || this.#moveBackwardRatio) {
      this.#group.getWorldDirection(this.#lookDirection) // update rotateDriection which the camera is rotateings
      actualMoveSpeed = delta * this.#moveSpeed * (this.#moveForwardRatio - this.#moveBackwardRatio) * MOVE_SPEED_FACTOR
      if (actualMoveSpeed < 0) this.#lookDirection.negate()
      for (let i = 0; i < this.#numRaycasters; i++) {
        const length = ((this.#character.size.height * (this.#isJump ? 0.5 : 1) - FLOOR_PASS_THRESHOLD) * i) / (this.#numRaycasters - 1)
        this.#raycaster.set(new THREE.Vector3(0, this.#character.size.height - length, 0).add(this.#group.position), this.#lookDirection)
        intersects = this.#raycaster.intersectObjects(this.obstacles)
        if (intersects.length && intersects[0].distance < OBSTACLE_DETECT_DISTANCE) {
          actualMoveSpeed = 0
          break
        }
      }
    }
    this.#group.translateZ(actualMoveSpeed)

    // Animation Update
    this.#character.mixer.update(delta)
    if (this.#isJump) {
      this.fadeToAction(this.#character.actions.jump)
    } else if (this.#isFloating) {
      this.fadeToAction(this.#character.actions.fall)
    } else if (this.#moveForwardRatio > this.#moveBackwardRatio) {
      this.fadeToAction(this.#character.actions.run)
    } else if (this.#moveForwardRatio < this.#moveBackwardRatio) {
      this.fadeToAction(this.#character.actions.runBackward)
    } else {
      this.fadeToAction(this.#character.actions.idle)
    }
  }
}

export default KeypadControls
