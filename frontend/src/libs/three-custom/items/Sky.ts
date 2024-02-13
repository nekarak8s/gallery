import * as THREE from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky.js'

type SkyArgs = {
  scene: THREE.Scene
  size: number
}

export class SkyItem {
  type: string = 'sky'
  mesh: Sky
  dispose: () => void

  constructor(info: SkyArgs) {
    this.mesh = new Sky()
    this.mesh.scale.setScalar(1000)
    this.mesh.name = 'sky'
    info.scene.add(this.mesh)

    /**
     *  Dispose function: release reusources
     */
    this.dispose = () => {
      // Dispose material
      this.mesh.material.dispose()

      // Dispose geometry
      this.mesh.geometry.dispose()

      // Dispose mesh
      info.scene.remove(this.mesh)
    }
  }

  /*eslint-disable */
  setSunPosition(sun: THREE.Vector3) {
    this.mesh.material.uniforms['sunPosition'].value.copy(sun)
  }
  /*eslint-enable */
}
