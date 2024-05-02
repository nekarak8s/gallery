import { PerspectiveCamera } from 'three'

const DEFUALT_FOV = 45

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
      info.fov || DEFUALT_FOV,
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
    this.fov = DEFUALT_FOV
  }
}
