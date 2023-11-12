import {
  Box3,
  ColorRepresentation,
  Group,
  MathUtils,
  Object3DEventMap,
  SpotLight,
  Vector3,
} from 'three'
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
  mesh: Group<Object3DEventMap> | undefined

  constructor(info: SpotLightingProps) {
    super(info)

    this.rotationY += MathUtils.degToRad(90)

    /**
     * Load GLTF
     */
    info.gltfLoader.load(spotLightGlb, (glb) => {
      this.mesh = glb.scene

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
       * Set Position
       */
      console.log(this.x, this.y, this.z, this.width, this.height, this.depth)
      this.mesh.position.set(this.x, this.y, this.z)
      this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ)
      this.mesh.name = 'spotlight'

      /**
       * SpotLight
       */
      const spotLight = new SpotLight(
        info.color,
        info.intensity,
        info.distance,
        info.angle,
        info.penumbra,
        info.decay
      )
      spotLight.target = info.targetMesh
      this.mesh.add(spotLight)

      /**
       * Add to the container
       */
      info.container.add(this.mesh)
    })
  }
}
