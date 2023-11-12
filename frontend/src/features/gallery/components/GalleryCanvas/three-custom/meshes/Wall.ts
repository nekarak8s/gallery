import {
  Mesh,
  MeshStandardMaterial,
  BoxGeometry,
  RepeatWrapping,
  Texture,
  TextureLoader,
  MathUtils,
} from 'three'
import { Stuff, StuffArgs } from './Stuff'
import baseImg from '@/assets/textures/plaster_rough/Plaster_Rough_001_COLOR.jpg'
import normalImg from '@/assets/textures/plaster_rough/Plaster_Rough_001_NORM.jpg'
import ambientImg from '@/assets/textures/plaster_rough/Plaster_Rough_001_OCC.jpg'
import roughImg from '@/assets/textures/plaster_rough/Plaster_Rough_001_ROUGH.jpg'

type WallArgs = StuffArgs & {
  container: THREE.Scene | THREE.Mesh
  color?: string
  transparent?: boolean
  opacity?: number
  direction?: 'horizontal' | 'vertical'
  repeatX?: number
  repeatY?: number
  noTexture?: boolean
  baseImg?: string
  normalImg?: string
  ambientImg?: string
  roughImg?: string
}

export class Wall extends Stuff {
  type: string = 'wall'
  geometry: THREE.BoxGeometry
  material: THREE.MeshStandardMaterial
  mesh: THREE.Mesh
  direction: 'horizontal' | 'vertical' = 'horizontal'
  textures: Record<string, Texture>

  constructor(info: WallArgs) {
    super(info)

    /**
     * Adjust position
     */
    this.y += this.height / 2

    if (info.direction === 'vertical') {
      this.direction = 'vertical'
      this.rotationY = MathUtils.degToRad(90)
      this.z += this.width / 2
    } else {
      this.x += this.width / 2
    }

    /**
     * Geometry
     */
    this.geometry = new BoxGeometry(this.width, this.height, this.depth)

    /**
     * Texture
     */
    this.textures = {}
    const textureLoader = new TextureLoader()

    if (!info.noTexture) {
      this.textures['baseTex'] = textureLoader.load(info.baseImg || baseImg)
      this.textures['normalTex'] = textureLoader.load(info.normalImg || normalImg)
      this.textures['roughTex'] = textureLoader.load(info.roughImg || roughImg)
      this.textures['ambientTex'] = textureLoader.load(info.ambientImg || ambientImg)
    }

    if (info.repeatX || info.repeatY) {
      for (const key in this.textures) {
        const texture = this.textures[key]

        texture.wrapS = RepeatWrapping
        texture.wrapT = RepeatWrapping

        texture.repeat.x = info.repeatX || 1
        texture.repeat.y = info.repeatY || 1
      }
    }

    /**
     * Material
     */
    this.material = new MeshStandardMaterial({
      color: info.color || '#ffffff',
      transparent: info.transparent || false,
      opacity: info.opacity || 1.0,
      map: this.textures['baseTex'],
      normalMap: this.textures['normalTex'],
      roughnessMap: this.textures['roughTex'],
      roughness: 0.2,
      aoMap: this.textures['ambientTex'],
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
