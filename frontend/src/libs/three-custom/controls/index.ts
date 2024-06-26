import * as THREE from 'three'

export interface IControls {
  enabled: boolean
  camera: THREE.Camera
  targets: THREE.Object3D<THREE.Object3DEventMap>[]
  position: THREE.Vector3
  rotationY: number
  setPosition: (x: number, y: number, z: number) => void
  setQuaternion: (x: number, y: number, z: number) => void
  raycastTargets: (...args: any[]) => THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>> | undefined
  update?: (delta: number) => void
  dispose: () => void
}
