import { Box3, ColorRepresentation, MathUtils, SpotLight, Vector3 } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Stuff, StuffArgs } from './Stuff'
import spotLightGlb from '@/assets/glbs/spotlight.glb'

export type SpotLightingProps = StuffArgs & {
  container: THREE.Mesh
  gltfLoader: GLTFLoader
  targetMesh: THREE.Mesh
  color?: ColorRepresentation | undefined
  intensity?: number | undefined
  distance?: number | undefined
  angle?: number | undefined
  penumbra?: number | undefined
  decay?: number | undefined
}

export class SpotLighting extends Stuff {
  type: string = 'spotlight'
  glb?: THREE.Group<THREE.Object3DEventMap>
  light?: THREE.SpotLight

  constructor(info: SpotLightingProps) {
    super(info)

    this.rotationY += MathUtils.degToRad(90)

    /**
     * Load GLTF
     */
    info.gltfLoader.load(spotLightGlb, (glb) => {
      this.glb = glb.scene

      /**
       * Get size
       */
      const box = new Box3().setFromObject(glb.scene)
      const size = box.getSize(new Vector3())
      this.width = size.x
      this.height = size.y
      this.depth = size.z

      /**
       * Adjust position
       */
      this.x -= this.height / 2

      /**
       * SpotLight
       */
      this.light = new SpotLight(
        info.color,
        info.intensity,
        info.distance,
        info.angle,
        info.penumbra,
        info.decay
      )
      this.light.position.x = this.width / 2
      this.light.position.y = -this.height / 2
      this.light.target = info.targetMesh
      this.glb.add(this.light)

      /**
       * Set Position
       */
      this.glb.position.set(this.x, this.y, this.z)
      this.glb.rotation.set(this.rotationX, this.rotationY, this.rotationZ)
      this.glb.name = this.name || this.type

      /**
       * Add to the container
       */
      info.container.add(this.glb)
    })
  }
}
