import {
  Mesh,
  ColorRepresentation,
  MeshStandardMaterial,
  BoxGeometry,
  TextureLoader,
  SpotLight,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Stuff, StuffArgs } from './Stuff'
import lightGlb from '@/assets/glbs/spotlight.glb'

type LightProps = {
  gltfLoader: GLTFLoader
  color?: ColorRepresentation | undefined
  intensity?: number | undefined
  distance?: number | undefined
  angle?: number | undefined
  penumbra?: number | undefined
  decay?: number | undefined
}

type FrameArgs = StuffArgs & {
  container: THREE.Mesh
  baseImg: string
  textureLoader: TextureLoader
  spotLight?: LightProps
}

export class Frame extends Stuff {
  type: string = 'frame'
  geometry: THREE.BoxGeometry
  material: THREE.MeshStandardMaterial
  mesh: THREE.Mesh

  constructor(info: FrameArgs) {
    super(info)

    /**
     * Geometry
     */
    this.geometry = new BoxGeometry(this.width, this.height, this.depth)

    /**
     * Texture
     */
    const frameImg = info.textureLoader.load(info.baseImg)

    /**
     * Material
     */
    this.material = new MeshStandardMaterial({
      map: frameImg,
      roughness: 0.2,
    })

    /**
     * Mesh
     */
    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.position.set(this.x, this.y, this.z)
    this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ)
    this.mesh.receiveShadow = true

    /**
     * Light
     */
    const spotLight = new SpotLight('white', 1.5, 3, Math.PI / 5)
    spotLight.position.z = 1
    spotLight.position.y = 1
    spotLight.target = this.mesh
    this.mesh.add(spotLight)

    const gltfLoader = new GLTFLoader()
    gltfLoader.load(lightGlb, (glb) => {
      // glb.scene.traverse((child) => {
      //   if (child.isMesh) {
      //     child.castShadow = true
      //   }
      // })

      const light = glb.scene
      light.position.set(0, 1, 1)
      light.rotation.set(0, Math.PI / 2, 0)
      light.castShadow = true
      this.mesh.add(light)
    })

    /**
     * Add to the scene
     */
    info.container.add(this.mesh)
  }
}
