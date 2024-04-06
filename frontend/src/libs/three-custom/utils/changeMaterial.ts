import * as THREE from 'three'
import { disposeMaterial } from './disposeObject'

export const toLambert = (object: THREE.Mesh) => {
  const prevMaterial = object.material // eslint-disable-line

  if (prevMaterial instanceof Array) {
    const newMaterial: THREE.Material[] = []
    prevMaterial.forEach((material) => {
      newMaterial.push(THREE.MeshLambertMaterial.prototype.copy.call(new THREE.MeshLambertMaterial(), material))
      object.material = newMaterial
      disposeMaterial(material)
    })
  } else {
    object.material = new THREE.MeshLambertMaterial() // eslint-disable-line
    THREE.MeshLambertMaterial.prototype.copy.call(object.material, prevMaterial) // eslint-disable-line
    disposeMaterial(prevMaterial)
  }
}
