import { Mesh, MeshStandardMaterial, BoxGeometry, RepeatWrapping, TextureLoader } from 'three'
import { Stuff, StuffArgs } from './Stuff'

type TextureProps = {
  textureLoader: TextureLoader
  baseImg: string
  normalImg?: string
  ambientImg?: string
  roughImg?: string
  repeatX?: number
  repeatY?: number
}

type WallArgs = StuffArgs & {
  container: THREE.Scene | THREE.Mesh
  color?: string
  transparent?: boolean
  opacity?: number
  texture?: TextureProps
}

export class Wall extends Stuff {
  type: string = 'wall'
  geometry: THREE.BoxGeometry
  material: THREE.Material
  mesh: THREE.Mesh
  textures: Record<string, THREE.Texture> = {}

  constructor(info: WallArgs) {
    super(info)

    /**
     * Adjust position
     */
    this.x += (this.width * Math.cos(this.rotationY)) / 2
    this.y += this.height / 2
    this.z += (this.width * Math.sin(this.rotationY)) / 2

    /**
     * Geometry
     */
    this.geometry = new BoxGeometry(this.width, this.height, this.depth)

    /**
     * Texture
     */

    if (info.texture) {
      this.textures['baseTex'] = info.texture.textureLoader.load(info.texture.baseImg)
      if (info.texture.normalImg) {
        this.textures['normalTex'] = info.texture.textureLoader.load(info.texture.normalImg)
      }
      if (info.texture.roughImg) {
        this.textures['roughTex'] = info.texture.textureLoader.load(info.texture.roughImg)
      }
      if (info.texture.ambientImg) {
        this.textures['ambientTex'] = info.texture.textureLoader.load(info.texture.ambientImg)
      }

      if (info.texture.repeatX || info.texture.repeatY) {
        for (const key in this.textures) {
          const texture = this.textures[key]

          texture.wrapS = RepeatWrapping
          texture.wrapT = RepeatWrapping

          texture.repeat.x = info.texture.repeatX || 1
          texture.repeat.y = info.texture.repeatY || 1
        }
      }
    }

    /**
     * Material
     */
    this.material = new MeshStandardMaterial({
      color: info.color,
      transparent: info.transparent || false,
      opacity: info.opacity,
      roughness: 0.1,
      map: this.textures['baseTex'] || null,
      normalMap: this.textures['normalTex'] || null,
      roughnessMap: this.textures['roughTex'] || null,
      aoMap: this.textures['ambientTex'] || null,
    })

    /**
     * Mesh
     */
    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.position.set(this.x, this.y, this.z)
    this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ)
    this.mesh.castShadow = !info.transparent ? true : false
    this.mesh.receiveShadow = !info.transparent ? true : false

    /**
     * Add to the scene
     */
    info.container.add(this.mesh)
  }
}
