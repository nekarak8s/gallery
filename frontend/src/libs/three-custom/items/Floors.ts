import * as THREE from 'three'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { IItem } from './Item'
import { ItemFactory } from './ItemFactory'
import { disposeObject } from '../utils/disposeObject'

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

type FloorData = {
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

export type FloorsArgs = {
  floorsData: FloorData[]
  color?: THREE.ColorRepresentation | undefined
  opacity?: number | undefined
  transparent?: boolean | undefined
  texture?: TextureProps | undefined
}

export class Floors implements IItem {
  object: THREE.Mesh
  textures: Record<string, THREE.Texture> = {}

  constructor(info: FloorsArgs) {
    const geometries: THREE.BufferGeometry[] = []

    info.floorsData.forEach((floorData) => {
      let x = floorData.x
      let y = floorData.y
      let z = floorData.z

      let rotationX = floorData.rotationX || 0
      const rotationY = floorData.rotationY || 0
      const rotationZ = floorData.rotationZ || 0

      const height = floorData.height || 0
      const width = floorData.width
      const depth = floorData.depth

      // Adjust position (pivot : left top)
      z -= (depth * (1 - Math.cos(rotationX))) / 2
      y += (depth * Math.sin(rotationX)) / 2

      x += (width * Math.cos(rotationY)) / 2
      z += (depth * Math.cos(rotationY)) / 2

      x -= (width * (1 - Math.cos(rotationZ))) / 2
      y += (width * Math.sin(rotationZ)) / 2

      // Create geometry
      let geometry: THREE.BufferGeometry
      if (floorData.isPlane === true) {
        // Plane
        rotationX -= Math.PI / 2
        geometry = new THREE.PlaneGeometry(width, depth)
      } else {
        // Box
        y -= height / 2
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

export default class FloorsFactory extends ItemFactory {
  static instance: FloorsFactory | null = null

  constructor() {
    if (!FloorsFactory.instance) {
      super()
      FloorsFactory.instance = this
    }
    return FloorsFactory.instance
  }

  createItem(args: FloorsArgs) {
    return new Floors(args)
  }
}
