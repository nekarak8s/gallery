import { ColorRepresentation, CylinderGeometry, Mesh, MeshBasicMaterial, PointLight } from 'three'
import { Stuff, StuffArgs } from './Stuff'

export type SimplePointLightingProps = StuffArgs & {
  container: THREE.Scene
  color?: ColorRepresentation | undefined
  intensity?: number | undefined
  distance?: number | undefined
  decay?: number | undefined
}

export class SimplePointLighting extends Stuff {
  type: string = 'simplepointlight'
  geometry: THREE.CylinderGeometry
  material: THREE.Material
  mesh: THREE.Mesh
  light?: THREE.PointLight | undefined

  constructor(info: SimplePointLightingProps) {
    super(info)

    /**
     * Adjust position
     */
    this.y -= this.height / 2

    /**
     * Geometry
     */
    this.geometry = new CylinderGeometry(this.width / 2, this.width / 2, this.height)

    /**
     * Material
     */
    this.material = new MeshBasicMaterial({
      color: info.color,
    })

    /**
     * Mesh
     */
    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.position.set(this.x, this.y, this.z)
    this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ)
    this.mesh.name = this.name || this.type

    /**
     * PointLight
     */
    this.light = new PointLight(info.color, info.intensity, info.distance, info.decay)
    this.mesh.add(this.light)

    /**
     * Add to the container
     */
    info.container.add(this.mesh)
  }
}
