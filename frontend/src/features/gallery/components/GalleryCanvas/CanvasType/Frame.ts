import {
  Mesh,
  MeshStandardMaterial,
  BoxGeometry,
  Texture,
  TextureLoader,
} from 'three'
import { Stuff, StuffArgs } from './Stuff'

type FrameArgs = StuffArgs & {
  container: THREE.Mesh
  baseImg: string
  isDownRight?: boolean
}

export class Frame extends Stuff {
  type: string = 'frame'
  geometry: THREE.BoxGeometry
  material: THREE.MeshStandardMaterial
  mesh: THREE.Mesh
  textures: Record<string, Texture>

  constructor(info: FrameArgs) {
    super(info)

    /**
     * Adjust position
     */

    const depth = 0.2
    if (info.isDownRight) {
      this.z += depth / 2
    } else {
      this.z -= depth / 2
    }

    /**
     * Geometry
     */
    this.geometry = new BoxGeometry(1, 1, 0.05)

    /**
     * Texture
     */
    this.textures = {}
    const textureLoader = new TextureLoader()
    this.textures['baseTex'] = textureLoader.load(info.baseImg)

    /**
     * Material
     */
    this.material = new MeshStandardMaterial({
      map: this.textures['baseTex'],
      roughness: 0.2,
    })

    /**
     * Mesh
     */
    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.position.set(this.x, this.y, this.z)
    this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ)
    this.mesh.receiveShadow = true

    /**
     * Add to the scene
     */
    info.container.add(this.mesh)
  }
}
