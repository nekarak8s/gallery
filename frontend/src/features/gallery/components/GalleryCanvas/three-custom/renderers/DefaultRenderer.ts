import { PCFSoftShadowMap, WebGLRenderer } from 'three'

export class DefaultRenderer extends WebGLRenderer {
  constructor(info: THREE.WebGLRendererParameters) {
    super(info)

    this.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1)
    this.setSize(this.domElement.offsetWidth, this.domElement.offsetHeight)
    this.shadowMap.enabled = true
    this.shadowMap.type = PCFSoftShadowMap
  }

  setDefaultSize = () => {
    this.setSize(this.domElement.offsetWidth, this.domElement.offsetHeight)
  }
}
