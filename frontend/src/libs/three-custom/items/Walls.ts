import * as THREE from 'three'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { IItem } from './Item'
import { ItemFactory } from './ItemFactory'
import { disposeObject } from '../utils/disposeResources'

type TextureProps = {
  textureLoader: THREE.TextureLoader
  baseImg: string
  normalImg?: string
  ambientImg?: string
  roughImg?: string
}

type WallData = {
  x: number
  y: number
  z: number
  width: number
  height: number
  depth: number
  rotationX?: number
  rotationY?: number
  rotationZ?: number
}

export type WallsArgs = {
  wallsData: WallData[]
  texture?: TextureProps
  color?: THREE.ColorRepresentation
  opacity?: number
  transparent?: boolean
  repeatX?: number
  repeatY?: number
}

export class Walls implements IItem {
  object: THREE.Mesh
  textures: Record<string, THREE.Texture> = {}

  constructor(info: WallsArgs) {
    const geometries: THREE.BoxGeometry[] = []

    info.wallsData.forEach((wallData) => {
      // Create geometry
      const geometry = new THREE.BoxGeometry(wallData.width, wallData.height, wallData.depth)

      // Set the position
      const rotationX = wallData.rotationX || 0
      const rotationY = wallData.rotationY || 0
      const rotationZ = wallData.rotationZ || 0

      const x = wallData.x + (wallData.width * Math.cos(rotationY)) / 2
      const y = wallData.y + wallData.height / 2
      const z = wallData.z - (wallData.width * Math.sin(rotationY)) / 2

      geometry.rotateX(rotationX)
      geometry.rotateY(rotationY)
      geometry.rotateZ(rotationZ)
      geometry.translate(x, y, z)

      geometries.push(geometry)
    })

    // Merge geometries
    const geometry = BufferGeometryUtils.mergeGeometries(geometries)
    geometries.forEach((geometry) => {
      geometry.dispose()
    })

    // Load Textures
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
    }

    for (const key in this.textures) {
      this.textures[key].wrapS = THREE.RepeatWrapping
      this.textures[key].wrapT = THREE.RepeatWrapping

      this.textures[key].repeat.x = info.repeatX || 1
      this.textures[key].repeat.y = info.repeatY || 1
    }

    // Select Material based on the texture sources
    const material = info.texture?.roughImg
      ? new THREE.MeshStandardMaterial({
          color: info.color,
          transparent: info.transparent || false,
          opacity: info.opacity,
          map: this.textures['baseTex'] || undefined,
          normalMap: this.textures['normalTex'] || undefined,
          aoMap: this.textures['ambientTex'] || undefined,
          roughnessMap: this.textures['roughTex'] || undefined,
        })
      : new THREE.MeshLambertMaterial({
          color: info.color,
          transparent: info.transparent || false,
          opacity: info.opacity,
          map: this.textures['baseTex'] || undefined,
          normalMap: this.textures['normalTex'] || undefined,
          aoMap: this.textures['ambientTex'] || undefined,
        })

    // Create object
    this.object = new THREE.Mesh(geometry, material)
    this.object.castShadow = !info.transparent ? true : false
    this.object.receiveShadow = !info.transparent ? true : false
  }

  dispose() {
    disposeObject(this.object)
    this.textures = {}
  }
}

export default class WallsFactory extends ItemFactory {
  static instance: WallsFactory | null = null

  constructor() {
    if (!WallsFactory.instance) {
      super()
      WallsFactory.instance = this
    }
    return WallsFactory.instance
  }

  createItem(args: WallsArgs) {
    return new Walls(args)
  }
}
