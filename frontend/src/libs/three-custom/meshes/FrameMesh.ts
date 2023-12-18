import { Mesh } from 'three'

export class FrameMesh extends Mesh {
  order: number

  constructor(geometry: THREE.BoxGeometry, material: THREE.Material, order: number) {
    super(geometry, material)

    this.order = order
  }
}
