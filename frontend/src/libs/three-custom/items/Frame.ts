import * as THREE from 'three'
import { Stuff, StuffArgs } from './Stuff'
import { FrameMesh } from '../meshes/FrameMesh'

type FrameArgs = StuffArgs & {
  container: THREE.Scene | THREE.Mesh
  baseImg: string
  textureLoader: THREE.TextureLoader
  order: number
}

export class Frame extends Stuff {
  type: string = 'frame'
  geometry: THREE.BoxGeometry
  material: THREE.Material
  mesh: THREE.Mesh
  dispose: () => void
  update: (delta: number) => void

  constructor(info: FrameArgs) {
    super(info)

    // Geometry
    this.geometry = new THREE.BoxGeometry(this.width, this.height, this.depth)

    // Texture
    const frameImg = info.textureLoader.load(info.baseImg)

    // Material
    this.material = new THREE.MeshPhongMaterial({
      map: frameImg,
    })

    // Mesh
    this.mesh = new FrameMesh(this.geometry, this.material, info.order)
    this.mesh.position.set(this.x, this.y, this.z)
    this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ)
    this.mesh.receiveShadow = true
    this.mesh.castShadow = true
    this.mesh.name = this.name || this.type

    // Add to the scene
    info.container.add(this.mesh)

    // Set the dispose function
    this.dispose = () => {
      info.container.remove(this.mesh)
      this.material.dispose()
      this.geometry.dispose()
    }

    // Set update function
    this.update = (delta: number) => {
      this.mesh.rotation.y += delta
    }
  }
}
