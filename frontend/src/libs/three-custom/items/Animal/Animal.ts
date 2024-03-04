import * as THREE from 'three'
import { getRandom } from '@/libs/math'

type Species = {
  type: string
  object: THREE.Object3D
  mixer: THREE.AnimationMixer
  idle: THREE.AnimationAction
  walk: THREE.AnimationAction
  swim: THREE.AnimationAction
  height: number
}

type AnimalProps = {
  species: Species
  container: THREE.Mesh | THREE.Scene
  x: number
  y: number
  z: number
  rotationY: number
}

const _downDirection = new THREE.Vector3(0, -1, 0)

export default class Animal {
  type: string = 'trees'
  species: Species
  mixer: THREE.AnimationMixer
  floors: THREE.Object3D[] = [] // Array for floor meshes
  obstacles: THREE.Object3D[] = [] // Array for floor meshes
  height: number
  dispose: () => void

  #raycaster = new THREE.Raycaster()
  #lookDirection = new THREE.Vector3()

  #movementSpeed: number = 1
  #lookSpeed: number = 3

  #status: 'pause' | 'walk' | 'turn' | 'swim'

  pausingPeriod = 5
  pausingTime = 0

  walkingPeriod = 7
  walkingTime = 0

  rotatingPeriod = 0.5
  rotatingTime = 0

  constructor(info: AnimalProps) {
    /**
     * Load GLTF
     */
    info.species.object.position.set(info.x, info.y, info.z)
    info.species.object.rotateY(info.rotationY)
    info.container.add(info.species.object)
    this.species = info.species
    this.mixer = info.species.mixer
    this.#status = 'walk'
    this.species.walk.play()

    this.height = info.species.height

    /**
     *  Dispose function: release resources
     */
    this.dispose = () => {
      info.container.remove(this.species.object)
    }
  }

  pause() {
    this.#status = 'pause'
    this.pausingTime = 0
    this.pausingPeriod = getRandom(3, 7)

    this.species.walk.stop()
    this.species.idle.play()
  }

  walk() {
    this.#status = 'walk'
    this.walkingTime = 0
    this.walkingPeriod = getRandom(8, 12)

    this.species.idle.stop()
    this.species.walk.play()
    this.species.swim.stop()
  }

  turn() {
    this.#status = 'turn'
    this.rotatingTime = 0
    this.rotatingPeriod = getRandom(0.2, 0.5)

    this.species.walk.stop()
    this.species.idle.play()
    this.species.swim.stop()
  }

  swim() {
    this.#status = 'swim'
    this.species.walk.stop()
    this.species.idle.stop()
    this.species.swim.play()
  }

  update(delta: number) {
    // Animation
    this.mixer.update(delta)

    this.#raycaster.set(this.species.object.position, _downDirection)
    const intersects = this.#raycaster.intersectObjects(this.floors)
    if (!intersects[0]) return

    // move forward
    const actualMoveSpeed = this.#movementSpeed * delta
    this.species.object.translateZ(actualMoveSpeed)

    // Position on the floor
    const distance = intersects[0].distance
    this.species.object.position.y += this.height / 2 - distance

    // normal vector 와 (0, 1, 0) 사이 각도 체크)
    // const worldNormal = intersects[0].normal!.clone() // intersects[0].normal을 변경하지 않도록 복제합니다.
    // worldNormal.applyMatrix4(intersects[0].object.matrixWorld)

    // Swim or Walk (y < 0.4)
    // if (this.species.object.position.y <= -0.55) {
    //   this.species.object.position.y = -0.55
    //   if (this.#status !== 'swim') this.swim()
    // } else if (this.#status === 'swim') {
    //   this.walk()
    // }

    // Pause
    if (this.#status === 'pause') {
      this.pausingTime += delta

      if (this.pausingTime > this.pausingPeriod) this.walk()
      return
    }

    // Rotate
    if (this.#status === 'turn') {
      this.rotatingTime += delta
      const actualLookSpeed = delta * this.#lookSpeed
      this.species.object.rotateY(actualLookSpeed)

      if (this.rotatingTime > this.rotatingPeriod) this.walk()
      return
    }

    // Walk
    if (this.#status === 'walk') {
      this.walkingTime += delta

      // pause or turn
      if (this.walkingTime > this.walkingPeriod) {
        getRandom(0, 1) < 0.5 ? this.pause() : this.turn()
        return
      }

      // avoid water (lookDirection과 normal vector 사이 각도 체크)
      // if (this.species.object.position.y < -0.4) {
      //   this.turn()
      //   return
      // }

      // obstacle
      this.species.object.getWorldDirection(this.#lookDirection)
      this.#raycaster.set(this.species.object.position, this.#lookDirection)
      const intersects = this.#raycaster.intersectObjects(this.obstacles)
      if (intersects.length > 0 && intersects[0].distance < 0.2) {
        this.turn()
        return
      }
    }
  }
}
