import { Box3, ColorRepresentation, PointLight, Vector3 } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Stuff, StuffArgs } from './Stuff'
import pointLightGlb from '@/assets/glbs/pointlight.glb'

export type PointLightingProps = StuffArgs & {
  container: THREE.Scene
  gltfLoader: GLTFLoader
  color?: ColorRepresentation | undefined
  intensity?: number | undefined
  distance?: number | undefined
  decay?: number | undefined
}

export class PointLighting extends Stuff {
  type: string = 'pointlight'
  glb?: THREE.Group<THREE.Object3DEventMap> | undefined
  light?: THREE.PointLight | undefined

  constructor(info: PointLightingProps) {
    super(info)

    /**
     * Load GLTF
     */
    info.gltfLoader.load(pointLightGlb, (glb) => {
      this.glb = glb.scene
      this.glb.scale.multiplyScalar(0.06)

      /**
       * Set glb scale
       */
      const box = new Box3().setFromObject(glb.scene)
      const size = box.getSize(new Vector3())
      this.width = size.x
      this.height = size.y
      this.depth = size.z

      /**
       * Adjust position
       */
      this.y -= this.height * 0.5

      /**
       * PointLight
       */
      this.light = new PointLight(info.color, info.intensity, info.distance, info.decay)
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
