import { Mesh } from 'three'

export class FrameMesh extends Mesh {
  index: number

  constructor(geometry: THREE.BoxGeometry, material: THREE.Material, index: number) {
    super(geometry, material)

    this.index = index
  }
}
