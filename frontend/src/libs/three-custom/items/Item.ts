import * as THREE from 'three'

export interface IItem {
  object: THREE.Object3D
  dispose: () => void
  update?: (delta: number) => void
}

export interface IItems {
  objects: THREE.Object3D[]
  dispose: () => void
  update?: (delta: number) => void
}
