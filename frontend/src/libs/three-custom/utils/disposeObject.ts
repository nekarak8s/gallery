import * as THREE from 'three'

// dispose TREE.Object3D method
export const disposeObject = (object: THREE.Object3D) => {
  // Dispose object
  object.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      // Dispose geometry
      if (obj.geometry instanceof THREE.BufferGeometry) {
        obj.geometry.dispose()
        obj.geometry = null
      }
      // Dispose material
      if (obj.material instanceof THREE.Material) {
        disposeMaterial(obj.material)
        obj.material = null
      }
    }

    // Dispose light
    if (obj instanceof THREE.Light) {
      obj.dispose()
    }

    // Dispose render target
    if (obj instanceof THREE.WebGLRenderTarget) {
      obj.dispose()
    }
  })

  object.parent?.remove(object)
  object.children = []
}

export const disposeMaterial = (material: THREE.Material) => {
  // Dispose textures
  Object.entries(material).forEach(([key, value]) => {
    if (value instanceof THREE.Texture) {
      value.dispose()
    }
  })
  // Dispose material
  material.dispose()
}
