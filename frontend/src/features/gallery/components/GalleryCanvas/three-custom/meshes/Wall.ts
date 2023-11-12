import {
  Mesh,
  MeshStandardMaterial,
  BoxGeometry,
  RepeatWrapping,
  Texture,
  TextureLoader,
} from 'three'
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
  material: THREE.MeshStandardMaterial
  mesh: THREE.Mesh

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
    const textures: Record<string, Texture> = {}

    if (info.texture) {
      textures['baseTex'] = info.texture.textureLoader.load(info.texture.baseImg)
      if (info.texture.normalImg) {
        textures['normalTex'] = info.texture.textureLoader.load(info.texture.normalImg)
      }
      if (info.texture.roughImg) {
        textures['roughTex'] = info.texture.textureLoader.load(info.texture.roughImg)
      }
      if (info.texture.ambientImg) {
        textures['ambientTex'] = info.texture.textureLoader.load(info.texture.ambientImg)
      }

      if (info.texture.repeatX || info.texture.repeatY) {
        for (const key in textures) {
          const texture = textures[key]

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
      map: textures['baseTex'],
      normalMap: textures['normalTex'],
      roughnessMap: textures['roughTex'],
      aoMap: textures['ambientTex'],
    })

    /**
     * Mesh
     */
    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.position.set(this.x, this.y, this.z)
    this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ)
    this.mesh.castShadow = !info.transparent || false
    this.mesh.receiveShadow = true

    /**
     * Add to the scene
     */
    info.container.add(this.mesh)
  }
}
