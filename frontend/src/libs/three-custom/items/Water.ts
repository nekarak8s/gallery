import * as THREE from 'three'
import { Water } from 'three/examples/jsm/objects/Water.js'
import { Stuff, StuffArgs } from './Stuff'
import waterNomals from '@/assets/textures/water/waternormals.jpg'

type WaterArgs = StuffArgs & {
  container: THREE.Scene | THREE.Mesh
  textureLoader: THREE.TextureLoader
  color?: THREE.ColorRepresentation | undefined
  distortionScale?: number | undefined
  isFog?: boolean
}

export class WaterItem extends Stuff {
  type: string = 'water'
  mesh: Water
  texture: THREE.Texture
  update: () => void
  dispose: () => void

  constructor(info: WaterArgs) {
    super(info)

    // Adjust position
    this.rotationX -= Math.PI / 2

    // Geometry
    const geometry = new THREE.PlaneGeometry(this.width, this.depth)

    // Texture
    this.texture = info.textureLoader.load(waterNomals, function (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    })

    // Mesh
    this.mesh = new Water(geometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: this.texture,
      alpha: 1,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: info.color || 0x001e4f,
      distortionScale: info.distortionScale || 3.7,
      fog: info.isFog || false,
    })
    this.mesh.name = 'water'
    this.mesh.position.set(this.x, this.y, this.z)
    this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ)
    info.container.add(this.mesh)

    /**
     *  Dispose function: release resources
     */
    this.dispose = () => {
      // Dispose texture
      this.texture.dispose()

      // Dispose material
      this.mesh.material.dispose()

      // Dispose geometry
      this.mesh.geometry.dispose()

      // Dispose mesh
      info.container.remove(this.mesh)
    }

    /**
     *  Update function: animation
     */
    this.update = () => {
      this.mesh.material.uniforms['time'].value += 1.0 / 60.0
    }
  }

  /*eslint-disable */
  setSunDirection(sun: THREE.Vector3) {
    this.mesh.material.uniforms['sunDirection'].value.copy(sun).normalize()
  }
  /*eslint-enable */
}
