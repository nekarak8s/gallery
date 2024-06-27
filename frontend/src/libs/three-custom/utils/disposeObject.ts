import * as THREE from 'three'

// Material 자원 해제 함수
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

// Object3D 자원 해제 함수
export const disposeObject = (object: THREE.Object3D) => {
  // 자식 Object3D 해제
  object.children.forEach((child) => {
    disposeObject(child)
  })

  // Mesh일 경우
  if (object instanceof THREE.Mesh) {
    // Geometry 해제
    if (object.geometry instanceof THREE.BufferGeometry) {
      object.geometry.dispose()
      object.geometry = null
    }

    // Material 해제
    object.material
    if (object.material instanceof THREE.Material) {
      disposeMaterial(object.material)
      object.material = null
    }
  }

  // Light 해제
  else if (object instanceof THREE.Light) {
    object.dispose()
  }

  object.removeFromParent()
}
