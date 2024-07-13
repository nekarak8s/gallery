import * as THREE from 'three'

// Dispose material
export const disposeMaterial = (material: THREE.Material | THREE.Material[]) => {
  // Array일 경우
  if (Array.isArray(material)) {
    material.forEach((material) => disposeMaterial(material))
    return
  }

  // Texture 해제
  Object.entries(material).forEach(([key, value]) => {
    if (value instanceof THREE.Texture) {
      value.dispose()
    }
  })

  // Material 해제
  material.dispose()
}

// Dispose Object3D
export const disposeObject = (object: THREE.Object3D) => {
  object.children.forEach((child) => {
    disposeObject(child)
  })

  // Dispose geometry
  if ('geometry' in object && object.geometry instanceof THREE.BufferGeometry) {
    object.geometry.dispose()
    object.geometry = null
  }

  // Dispose material
  if ('material' in object && object.material instanceof THREE.Material) {
    disposeMaterial(object.material)
    object.material = null
  }

  // Dispose object (Ex. Light)
  if ('dispose' in object && typeof object.dispose === 'function') {
    object.dispose()
  }

  object.removeFromParent()
}
