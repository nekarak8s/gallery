import * as THREE from 'three'
import { acceleratedRaycast } from 'three-mesh-bvh'
import { getRandom } from '@/libs/math'

THREE.Mesh.prototype.raycast = acceleratedRaycast

export interface ISpecies {
  object: THREE.Object3D
  mixer: THREE.AnimationMixer
  actions: {
    idle: THREE.AnimationAction
    walk: THREE.AnimationAction
    swim: THREE.AnimationAction
  }
  size: {
    width: number
    height: number
    depth: number
  }
}

export interface IAnimal {
  species: ISpecies
  floors: THREE.Object3D[]
  obstacles: THREE.Object3D[]
  update: (delta: number) => void
  dispose: () => void
}

const _downDirection = new THREE.Vector3(0, -1, 0)

export class Animal implements IAnimal {
  species: ISpecies
  floors: THREE.Object3D[] = [] // Array for floor meshes
  obstacles: THREE.Object3D[] = [] // Array for floor meshes

  // raycasting
  #raycaster = new THREE.Raycaster()
  #lookDirection = new THREE.Vector3()
  #throttleTime = Date.now()

  // movement variables
  movementSpeed: number = 1
  rotateSpeed: number = 3

  pausingPeriod: number = 5
  walkingPeriod: number = 7
  rotatingPeriod: number = 0.5

  #pausingTime: number = 0
  #walkingTime: number = 0
  #rotatingTime: number = 0

  #status: 'pause' | 'walk' | 'turn' | 'swim'
  #activeAction: THREE.AnimationAction

  constructor(props: ISpecies) {
    this.species = props

    // Set idle animation
    this.#status = 'pause'
    this.species.actions.idle.play()
    this.#activeAction = this.species.actions.idle

    // Set raycaster
    this.#raycaster.far = 5
    this.#raycaster.firstHitOnly = true
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

  pause() {
    this.#status = 'pause'
    this.#pausingTime = 0
    this.pausingPeriod = getRandom(3, 7)
    this.fadeToAction(this.species.actions.idle)
  }

  walk() {
    this.#status = 'walk'
    this.#walkingTime = 0
    this.walkingPeriod = getRandom(8, 12)
    this.fadeToAction(this.species.actions.walk)
  }

  turn() {
    this.#status = 'turn'
    this.#rotatingTime = 0
    this.rotatingPeriod = getRandom(0.1, 0.3)
    this.fadeToAction(this.species.actions.idle)
  }

  swim() {
    this.#status = 'swim'
    this.fadeToAction(this.species.actions.swim)
  }

  update(delta: number) {
    // Animation
    this.species.mixer.update(delta)

    // Position vertically
    this.#raycaster.set(new THREE.Vector3(0, this.species.size.height / 2, 0).add(this.species.object.position), _downDirection)
    let intersects = this.#raycaster.intersectObjects(this.floors)
    if (intersects.length) {
      const distance = intersects[0].distance
      this.species.object.position.y += this.species.size.height / 2 - distance
    }

    // Swim
    if (this.#status === 'swim') {
      if (this.species.object.position.y > -0.8) this.walk()
    }

    if (this.species.object.position.y < -0.8) this.species.object.position.y = -0.8

    // Pause
    if (this.#status === 'pause') {
      this.#pausingTime += delta

      if (this.#pausingTime > this.pausingPeriod) this.walk()
      return
    }

    // Rotate
    if (this.#status === 'turn') {
      this.#rotatingTime += delta
      const actualLookSpeed = delta * this.rotateSpeed
      this.species.object.rotateY(actualLookSpeed)

      if (this.#rotatingTime > this.rotatingPeriod) {
        this.species.object.position.y > -0.8 ? this.walk() : this.swim()
      }
      return
    }

    // Walk
    if (this.#status === 'walk') {
      this.#walkingTime += delta

      // pause or turn
      if (this.#walkingTime > this.walkingPeriod) {
        getRandom(0, 1) < 0.5 ? this.pause() : this.turn()
        return
      }

      // swim
      if (this.species.object.position.y < -0.8) {
        this.species.object.position.y = -0.8
        this.swim()
        return
      }
    }

    // obstacle
    if (Date.now() > this.#throttleTime + 200) {
      this.species.object.getWorldDirection(this.#lookDirection)
      this.#raycaster.set(this.species.object.position, this.#lookDirection)
      intersects = this.#raycaster.intersectObjects(this.obstacles)

      this.#throttleTime = Date.now()
      if (intersects.length > 0 && intersects[0].distance < 0.5) {
        this.turn()
        return
      }
    }

    // move forward
    const actualMoveSpeed = this.movementSpeed * delta
    this.species.object.translateZ(actualMoveSpeed)
  }

  dispose() {}
}
