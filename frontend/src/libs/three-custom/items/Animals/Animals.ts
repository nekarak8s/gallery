import * as THREE from 'three'
import { getRandom } from '@/libs/math'

type Species = {
  type: string
  object: THREE.Object3D
  mixer: THREE.AnimationMixer
  walk: THREE.AnimationAction
  idle: THREE.AnimationAction
}

type AnimalsProps = {
  species: Species
  container: THREE.Mesh | THREE.Scene
  x: number
  y: number
  z: number
}

const _downDirection = new THREE.Vector3(0, -1, 0)

export default class Animals {
  type: string = 'trees'
  species: Species
  mixer: THREE.AnimationMixer
  floors: THREE.Object3D[] = [] // Array for floor meshes
  obstacles: THREE.Object3D[] = [] // Array for floor meshes
  dispose: () => void

  #raycaster = new THREE.Raycaster()
  #lookDirection = new THREE.Vector3()

  #movementSpeed: number = 1
  #lookSpeed: number = 3

  #isPausing = true
  pausingPeriod = 5
  pausingTime = 0

  #isWalking = false
  walkingPeriod = 7
  walkingTime = 0

  #isRotating = false
  rotatingPeriod = 0.5
  rotatingTime = 0

  constructor(info: AnimalsProps) {
    /**
     * Load GLTF
     */
    info.species.object.position.set(info.x, info.y, info.z)
    info.container.add(info.species.object)
    this.species = info.species
    this.mixer = info.species.mixer
    this.species.idle.play()

    /**
     *  Dispose function: release resources
     */
    this.dispose = () => {
      info.container.remove(this.species.object)
    }
  }

  pause() {
    this.#isPausing = true
    this.pausingTime = 0
    this.pausingPeriod = getRandom(3, 7)

    this.#isWalking = false
    this.#isRotating = false

    this.species.walk.stop()
    this.species.idle.play()
  }

  walk() {
    this.#isWalking = true
    this.walkingTime = 0
    this.walkingPeriod = getRandom(8, 12)

    this.#isPausing = false
    this.#isRotating = false

    this.species.idle.stop()
    this.species.walk.play()
  }

  turn() {
    this.#isRotating = true
    this.rotatingTime = 0
    this.rotatingPeriod = getRandom(0.2, 0.5)

    this.#isPausing = false
    this.#isWalking = false

    this.species.walk.stop()
    this.species.idle.play()
  }

  update(delta: number) {
    // Animation
    this.mixer.update(delta)

    // Position the camera on the floor
    this.#raycaster.set(this.species.object.position, _downDirection)
    const intersects = this.#raycaster.intersectObjects(this.floors)

    if (intersects.length > 0) {
      const distance = intersects[0].distance
      this.species.object.position.y += 0.05 - distance

      // const worldNormal = intersects[0].normal!.clone() // intersects[0].normal을 변경하지 않도록 복제합니다.
      // worldNormal.applyMatrix4(intersects[0].object.matrixWorld)
    }

    // Pause
    if (this.#isPausing) {
      this.pausingTime += delta

      if (this.pausingTime > this.pausingPeriod) this.walk()
      return
    }

    // Rotate
    if (this.#isRotating) {
      this.rotatingTime += delta
      const actualLookSpeed = delta * this.#lookSpeed
      this.species.object.rotateY(actualLookSpeed)

      if (this.rotatingTime > this.rotatingPeriod) this.walk()
      return
    }

    // Move
    if (this.#isWalking) {
      this.walkingTime += delta

      if (this.walkingTime > this.walkingPeriod) {
        getRandom(0, 1) < 0.5 ? this.pause() : this.turn()
        return
      }

      // obstacle
      if (this.species.object.position.y < 0) {
        this.turn()
        return
      }

      // avoid water
      this.species.object.getWorldDirection(this.#lookDirection)
      this.#raycaster.set(this.species.object.position, this.#lookDirection)
      const intersects = this.#raycaster.intersectObjects(this.obstacles)
      if (intersects.length > 0 && intersects[0].distance < 0.2) {
        this.turn()
        return
      }

      // move
      const actualMoveSpeed = this.#movementSpeed * delta
      this.species.object.translateZ(actualMoveSpeed)
    }
  }
}
