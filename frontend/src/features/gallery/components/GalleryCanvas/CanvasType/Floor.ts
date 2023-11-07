import {
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  RepeatWrapping,
  Texture,
  TextureLoader,
} from 'three'
import { Stuff, StuffArgs } from './Stuff'
import ambientImg from '@/assets/textures/wood_herringbone/Wood_Herringbone_Tiles_001_ambientOcclusion.jpg'
import baseImg from '@/assets/textures/wood_herringbone/Wood_Herringbone_Tiles_001_basecolor.jpg'
import normalImg from '@/assets/textures/wood_herringbone/Wood_Herringbone_Tiles_001_normal.jpg'
import roughImg from '@/assets/textures/wood_herringbone/Wood_Herringbone_Tiles_001_roughness.jpg'

type FloorArgs = StuffArgs & {
  container: THREE.Scene | THREE.Mesh
  color?: string
  textureRepeat?: number
  baseImg?: string
  normalImg?: string
  ambientImg?: string
  roughImg?: string
}

export class Floor extends Stuff {
  type: string = 'floor'
  geometry: THREE.PlaneGeometry
  material: THREE.MeshStandardMaterial
  mesh: THREE.Mesh
  textures: Record<string, Texture>

  constructor(info: FloorArgs) {
    super(info)
    /**
     * Adjust position
     */
    this.x += this.width / 2
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
    this.textures = {}
    const textureLoader = new TextureLoader()

    this.textures['baseTex'] = textureLoader.load(info.baseImg || baseImg)
    this.textures['normalTex'] = textureLoader.load(info.normalImg || normalImg)
    this.textures['roughTex'] = textureLoader.load(info.roughImg || roughImg)
    this.textures['ambientTex'] = textureLoader.load(
      info.ambientImg || ambientImg
    )

    if (info.textureRepeat) {
      for (const key in this.textures) {
        const texture = this.textures[key]

        texture.wrapS = RepeatWrapping
        texture.wrapT = RepeatWrapping

        texture.repeat.x = info.textureRepeat
        texture.repeat.y = info.textureRepeat
      }
    }

    /**
     * Material
     */
    this.material = new MeshStandardMaterial({
      color: info.color || '#ffffff',
      map: this.textures['baseTex'],
      normalMap: this.textures['normalTex'],
      roughnessMap: this.textures['roughTex'],
      roughness: 0.1,
      aoMap: this.textures['ambientTex'],
      // side: DoubleSide,
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
