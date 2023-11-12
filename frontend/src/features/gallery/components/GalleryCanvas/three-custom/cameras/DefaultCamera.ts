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
      info.fov,
      info.canvas instanceof HTMLCanvasElement
        ? info.canvas.offsetWidth / info.canvas.offsetHeight
        : window.innerWidth / window.innerHeight,
      info.near || 0.01,
      info.far || 200
    )
    this.canvas = info.canvas
  }

  setDefaultAspect() {
    this.aspect =
      this.canvas instanceof HTMLCanvasElement
        ? this.canvas.offsetWidth / this.canvas.offsetHeight
        : window.innerWidth / window.innerHeight
  }
}
