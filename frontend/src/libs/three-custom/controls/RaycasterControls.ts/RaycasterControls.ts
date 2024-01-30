import { Vector2, Raycaster } from 'three'
import './RaycasterControls.scss'

const _canvasOrigin = new Vector2(0, 0)

export class RaycasterControls {
  // arguments
  canvas: HTMLCanvasElement
  camera: THREE.Camera

  // iternals
  #raycaster: Raycaster = new Raycaster()

  // API
  enabled: boolean = true
  rayItems: THREE.Object3D<THREE.Object3DEventMap>[] = [] // Array for raycastering items

  raycast?: (item: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>) => void
  onEsc?: () => void
  dispose: () => void

  constructor(canvas: HTMLCanvasElement, camera: THREE.Camera) {
    this.canvas = canvas
    this.camera = camera

    // Add event listener
    const _onKeyDown = this.onKeyDown.bind(this)
    window.addEventListener('keydown', _onKeyDown)

    // Add raycaster visual target
    const target = document.createElement('div')
    target.id = 'target'
    this.canvas.parentNode!.insertBefore(target, canvas.nextSibling)

    // Set dispose function: Release resources
    this.dispose = () => {
      window.removeEventListener('keydown', _onKeyDown)
      const target = document.getElementById('target')
      target && target.remove()
    }
  }

  /**
   * Trigger raycast
   */
  shoot() {
    if (this.raycast) {
      this.#raycaster.setFromCamera(_canvasOrigin, this.camera)
      const intersects = this.#raycaster.intersectObjects(this.rayItems)
      for (const item of intersects) {
        this.raycast(item)
        break
      }
    }
  }

  /**
   * Keydown event handler
   */
  onKeyDown(event: KeyboardEvent) {
    if (!this.enabled) return

    switch (event.code) {
      case 'ControlLeft':
        event.preventDefault()
        this.shoot()
        break

      case 'Escape':
        event.preventDefault()
        this.onEsc && this.onEsc()
        break
    }
  }
}
