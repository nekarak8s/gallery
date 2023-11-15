import { Mesh, BoxGeometry, TextureLoader, MeshPhongMaterial } from 'three'
import { Stuff, StuffArgs } from './Stuff'

type FrameArgs = StuffArgs & {
  container: THREE.Mesh
  baseImg: string
  textureLoader: TextureLoader
}

export class Frame extends Stuff {
  type: string = 'frame'
  geometry: THREE.BoxGeometry
  material: THREE.Material
  mesh: THREE.Mesh

  constructor(info: FrameArgs) {
    super(info)

    /**
     * Geometry
     */
    this.geometry = new BoxGeometry(this.width, this.height, this.depth)

    /**
     * Texture
     */
    const frameImg = info.textureLoader.load(info.baseImg)

    /**
     * Material
     */
    this.material = new MeshPhongMaterial({
      map: frameImg,
    })

    /**
     * Mesh
     */
    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.position.set(this.x, this.y, this.z)
    this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ)
    this.mesh.receiveShadow = true
    this.mesh.name = this.name || this.type

    /**
     * Add to the scene
     */
    info.container.add(this.mesh)
  }
}
