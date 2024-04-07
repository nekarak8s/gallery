import { PerspectiveCamera } from 'three'

type DefaultCameraProps = {
  canvas?: HTMLCanvasElement
  fov?: number
  aspect?: number
  near?: number
  far?: number
}

export class DefaultCamera extends PerspectiveCamera {
  canvas: HTMLCanvasElement | undefined

  constructor(info: DefaultCameraProps) {
    super(
      info.fov || 45,
      info.canvas ? info.canvas.offsetWidth / info.canvas.offsetHeight : window.innerWidth / window.innerHeight,
      info.near || 1,
      info.far || 500
    )
    this.canvas = info.canvas
  }

  setDefaultAspect() {
    this.aspect = this.canvas ? this.canvas.offsetWidth / this.canvas.offsetHeight : window.innerWidth / window.innerHeight
  }

  resetFov() {
    this.fov = 45
  }
}
