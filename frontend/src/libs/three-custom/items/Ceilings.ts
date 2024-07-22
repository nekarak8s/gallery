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
  roughness?: number
  repeatX?: number
  repeatY?: number
}

type CeilingData = {
  x: number
  y: number
  z: number
  width: number
  height?: number
  depth: number
  rotationX?: number
  rotationY?: number
  rotationZ?: number
  isPlane?: boolean
}

export type CeilingsArgs = {
  ceilingsData: CeilingData[]
  color?: THREE.ColorRepresentation | undefined
  opacity?: number | undefined
  transparent?: boolean | undefined
  texture?: TextureProps | undefined
}

export class Ceilings implements IItem {
  object: THREE.Mesh
  textures: Record<string, THREE.Texture> = {}

  constructor(info: CeilingsArgs) {
    const geometries: THREE.BufferGeometry[] = []

    info.ceilingsData.forEach((ceilingData) => {
      let x = ceilingData.x
      let y = ceilingData.y
      let z = ceilingData.z

      let rotationX = ceilingData.rotationX || 0
      const rotationY = ceilingData.rotationY || 0
      const rotationZ = ceilingData.rotationZ || 0

      const height = ceilingData.height || 0
      const width = ceilingData.width
      const depth = ceilingData.depth

      // Adjust position
      x += (width * Math.cos(rotationY)) / 2
      x += (depth * Math.sin(rotationY)) / 2
      z -= (width * Math.sin(rotationY)) / 2
      z += (depth * Math.cos(rotationY)) / 2

      let geometry: THREE.BufferGeometry
      if (ceilingData.isPlane === true) {
        // Plane
        rotationX += Math.PI / 2
        geometry = new THREE.PlaneGeometry(width, depth)
      } else {
        // Box
        y += height / 2
        geometry = new THREE.BoxGeometry(width, height, depth)
      }

      // Set the positions
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

export default class CeilingsFactory extends ItemFactory {
  static instance: CeilingsFactory | null = null

  constructor() {
    if (!CeilingsFactory.instance) {
      super()
      CeilingsFactory.instance = this
    }
    return CeilingsFactory.instance
  }

  createItem(args: CeilingsArgs) {
    return new Ceilings(args)
  }
}
