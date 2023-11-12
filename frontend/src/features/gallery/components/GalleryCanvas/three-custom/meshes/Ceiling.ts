import { Material, World } from 'cannon-es'
import {
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  RepeatWrapping,
  Texture,
  TextureLoader,
  DoubleSide,
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

type CeilingProps = StuffArgs & {
  container: THREE.Scene | THREE.Mesh
  world: World
  cannonMaterial?: Material
  color?: string
  texture?: TextureProps
}

export class Ceiling extends Stuff {
  type: string = 'ceiling'
  geometry: THREE.PlaneGeometry
  material: THREE.MeshStandardMaterial
  mesh: THREE.Mesh

  constructor(info: CeilingProps) {
    super(info)

    /**
     * Adjust position & angle
     */
    this.x += this.width / 2
    this.y += this.height
    this.z += this.depth / 2

    if (!this.rotationX) {
      this.rotationX = -MathUtils.degToRad(90)
    } else {
      this.rotationX += -MathUtils.degToRad(90)
    }

    /**
     * Geometry
     */
    this.geometry = new PlaneGeometry(this.width, this.depth)

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
      color: info.color || '#ffffff',
      map: textures['baseTex'],
      normalMap: textures['normalTex'],
      roughnessMap: textures['roughTex'],
      roughness: 0.1,
      aoMap: textures['ambientTex'],
      side: DoubleSide,
    })

    /**
     * Mesh
     */
    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.position.set(this.x, this.y, this.z)
    this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ)
    this.mesh.castShadow = true
    this.mesh.name = this.name

    /**
     * Add to the container
     */
    info.container.add(this.mesh)

    /**
     * Create cannon-js body
     */
    this.setCannonBody(info.world, 0, info.cannonMaterial)
  }
}
