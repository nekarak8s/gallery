import { Material, World } from 'cannon-es'
import * as THREE from 'three'
import { Stuff, StuffArgs } from './Stuff'

type TextureProps = {
  textureLoader: THREE.TextureLoader
  baseImg: string
  normalImg?: string
  ambientImg?: string
  roughImg?: string
  roughness?: number
  repeatX?: number
  repeatY?: number
}

type WallArgs = StuffArgs & {
  container: THREE.Scene | THREE.Mesh
  world?: World | undefined
  cannonMaterial?: Material | undefined
  color?: THREE.ColorRepresentation | undefined
  opacity?: number | undefined
  transparent?: boolean | undefined
  texture?: TextureProps | undefined
}

export class Wall extends Stuff {
  type: string = 'wall'
  mesh: THREE.Mesh
  textures: Record<string, THREE.Texture> = {}
  dispose: () => void

  constructor(info: WallArgs) {
    super(info)

    // Adjust position
    this.x += (this.width * Math.cos(this.rotationY)) / 2
    this.y += this.height / 2
    this.z += (this.width * Math.sin(this.rotationY)) / 2

    // Geometry
    const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth)

    // Textures
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

          texture.wrapS = THREE.RepeatWrapping
          texture.wrapT = THREE.RepeatWrapping

          texture.repeat.x = info.texture.repeatX || 1
          texture.repeat.y = info.texture.repeatY || 1
        }
      }
    }

    // Material
    const material = info.texture?.roughImg
      ? new THREE.MeshStandardMaterial({
          color: info.color,
          transparent: info.transparent || false,
          opacity: info.opacity,
          map: this.textures['baseTex'] || undefined,
          normalMap: this.textures['normalTex'] || undefined,
          aoMap: this.textures['ambientTex'] || undefined,
          roughnessMap: this.textures['roughTex'] || undefined,
          roughness: info.texture.roughness || 1,
        })
      : new THREE.MeshLambertMaterial({
          color: info.color,
          transparent: info.transparent || false,
          opacity: info.opacity,
          map: this.textures['baseTex'] || undefined,
          normalMap: this.textures['normalTex'] || undefined,
          aoMap: this.textures['ambientTex'] || undefined,
        })

    // Mesh
    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.position.set(this.x, this.y, this.z)
    this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ)
    this.mesh.castShadow = !info.transparent ? true : false
    this.mesh.receiveShadow = !info.transparent ? true : false
    this.mesh.name = this.name || this.type

    // Add to the scene
    info.container.add(this.mesh)

    // Create cannon body
    info.world && this.setBoxCannonBody(info.world, 0, info.cannonMaterial)

    /**
     *  Dispose function: release resources
     */
    this.dispose = () => {
      // Dispose textures
      for (const key in this.textures) {
        const texture = this.textures[key]
        texture.dispose()
      }

      // Dispose material
      if (this.mesh.material instanceof Array) {
        this.mesh.material.forEach((material) => {
          material.dispose()
        })
      } else {
        this.mesh.material.dispose()
      }

      // Dispose geometry
      this.mesh.geometry.dispose()

      // Dispose mesh
      info.container.remove(this.mesh)

      // Dispose cannonBody
      info.world && info.world.removeBody(this.cannonBody!)
    }
  }
}
