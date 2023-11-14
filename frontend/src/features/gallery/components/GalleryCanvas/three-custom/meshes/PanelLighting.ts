import { Mesh, ColorRepresentation, BoxGeometry, RectAreaLight, MeshBasicMaterial } from 'three'
import { Stuff, StuffArgs } from './Stuff'

type PanelLightingProps = StuffArgs & {
  container: THREE.Scene
  color?: ColorRepresentation | undefined
  transparent?: boolean
  opacity?: number
  intensity?: number | undefined
}

export class PanelLighting extends Stuff {
  type: string = 'panellight'
  geometry: THREE.BoxGeometry
  material: THREE.Material
  mesh: THREE.Mesh
  light: THREE.Light

  constructor(info: PanelLightingProps) {
    super(info)

    /**
     * Adjust position
     */
    this.y -= this.height * 0.5

    /**
     * Geometry
     */
    this.geometry = new BoxGeometry(this.width, this.height, this.depth)

    /**
     * Material
     */
    this.material = new MeshBasicMaterial({
      color: info.color,
      transparent: info.transparent || false,
      opacity: info.opacity,
    })

    /**
     * Mesh
     */
    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.position.set(this.x, this.y, this.z)
    this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ)
    this.mesh.name = this.name || this.type

    /**
     * PanelLight
     */
    this.light = new RectAreaLight(info.color, info.intensity, this.width, this.depth)
    this.light.lookAt(0, -1, 0)
    this.mesh.add(this.light)

    info.container.add(this.mesh)
  }
}
