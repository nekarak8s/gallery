import { Mesh, MeshStandardMaterial, BoxGeometry, Texture, TextureLoader, SpotLight } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Stuff, StuffArgs } from './Stuff'
import lightGlb from '@/assets/glbs/spotlight.glb'

type FrameArgs = StuffArgs & {
  container: THREE.Mesh
  baseImg: string
  isDownRight?: boolean
}

export class Frame extends Stuff {
  type: string = 'frame'
  geometry: THREE.BoxGeometry
  material: THREE.MeshStandardMaterial
  mesh: THREE.Mesh
  textures: Record<string, Texture>

  constructor(info: FrameArgs) {
    super(info)

    /**
     * Adjust position
     */

    const depth = 0.2
    if (info.isDownRight) {
      this.z += depth / 2
    } else {
      this.z -= depth / 2
    }

    /**
     * Geometry
     */
    this.geometry = new BoxGeometry(1, 1, 0.05)

    /**
     * Texture
     */
    this.textures = {}
    const textureLoader = new TextureLoader()
    this.textures['baseTex'] = textureLoader.load(info.baseImg)

    /**
     * Material
     */
    this.material = new MeshStandardMaterial({
      map: this.textures['baseTex'],
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
    spotLight.position.z = info.isDownRight ? 1 : -1
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
      light.position.set(0, 1, info.isDownRight ? 1 : -1)
      light.rotation.set(0, info.isDownRight ? Math.PI / 2 : -Math.PI / 2, 0)
      light.castShadow = true
      this.mesh.add(light)
    })

    /**
     * Add to the scene
     */
    info.container.add(this.mesh)
  }
}
