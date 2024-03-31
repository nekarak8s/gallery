export interface IPlayer {
  object: THREE.Object3D
  mixer: THREE.AnimationMixer
  actions: {
    idle: THREE.AnimationAction
    run: THREE.AnimationAction
    runBackward: THREE.AnimationAction
    jump: THREE.AnimationAction
    fall: THREE.AnimationAction
  }
  size: {
    width: number
    height: number
    depth: number
  }
}
