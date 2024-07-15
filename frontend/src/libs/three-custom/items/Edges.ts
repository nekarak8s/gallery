import * as THREE from 'three'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { IItem } from './Item'
import { ItemFactory } from './ItemFactory'
import { disposeObject } from '../utils/disposeResources'

type EdgeData = {
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

export type EdgesArgs = {
  edgesData: EdgeData[]
}

export class Edges implements IItem {
  object: THREE.Mesh

  constructor(info: EdgesArgs) {
    const geometries: THREE.BoxGeometry[] = []

    info.edgesData.forEach((edgeData) => {
      // Geometry
      const geometry = new THREE.BoxGeometry(edgeData.width, edgeData.height, edgeData.depth)

      // Adjust position
      const rotationX = edgeData.rotationX || 0
      const rotationY = edgeData.rotationY || 0
      const rotationZ = edgeData.rotationZ || 0

      geometry.rotateX(rotationX)
      geometry.rotateY(rotationY)
      geometry.rotateZ(rotationZ)
      geometry.translate(edgeData.x, edgeData.y, edgeData.z)

      geometries.push(geometry)
    })

    // Merge geometry
    const geometry = BufferGeometryUtils.mergeGeometries(geometries)
    geometries.forEach((geometry) => {
      geometry.dispose()
    })

    // Create Material
    const material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      opacity: 0,
      transparent: true,
    })

    // Create object
    this.object = new THREE.Mesh(geometry, material)
  }

  dispose() {
    disposeObject(this.object)
  }
}

export default class EdgesFactory extends ItemFactory {
  static instance: EdgesFactory | null = null

  constructor() {
    if (!EdgesFactory.instance) {
      super()
      EdgesFactory.instance = this
    }
    return EdgesFactory.instance
  }

  createItem(args: EdgesArgs) {
    return new Edges(args)
  }
}
