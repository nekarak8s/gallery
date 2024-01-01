import * as THREE from 'three'
import texture from '@/assets/images/home-section-3/white-wall.jpg'

// create a wall mesh based on x, y, z params
export class WallMesh {
  geometry: THREE.BoxGeometry
  material: THREE.MeshStandardMaterial
  wallMesh: THREE.Mesh

  constructor(x: number, y: number, z: number) {
    const textureLoader = new THREE.TextureLoader()
    const wallTexture = textureLoader.load(texture)

    this.geometry = new THREE.BoxGeometry(x, y, z)
    this.material = new THREE.MeshStandardMaterial({
      color: '#FAF0E6',
      map: wallTexture,
    })
    this.wallMesh = new THREE.Mesh(this.geometry, this.material)
  }

  getMesh() {
    return this.wallMesh
  }
}
