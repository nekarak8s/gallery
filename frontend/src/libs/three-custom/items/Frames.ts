import * as THREE from 'three'
import { FrameMesh } from '../meshes/FrameMesh'
import { PostData } from '@/features/post/types'

type SpotLightProps = {
  lightOffsetX?: number
  lightOffsetY?: number
  lightOffsetZ?: number
  distance?: number
  color?: THREE.ColorRepresentation
  intensity?: number
  angle?: number
  penumbra?: number
  decay?: number
}

type FrameData = {
  x: number
  y: number
  z: number
  width: number
  height: number
  depth: number
  rotationX?: number
  rotationY?: number
  rotationZ?: number
}

export type FramesArgs = {
  postList: PostData[]
  container: THREE.Mesh | THREE.Scene
  color?: THREE.ColorRepresentation
  framesData: FrameData[]
  textureLoader: THREE.TextureLoader
  normalImg?: string
  ambientImg?: string
  roughImg?: string
  repeatFactor?: number
  spotLight?: SpotLightProps
}

export class Frames {
  type: string = 'floors'
  meshes: THREE.Mesh[] = []
  textureSource: Record<string, THREE.Texture> = {}
  spotLights: THREE.SpotLight[] = []

  dispose: () => void
  update: (delta: number) => void

  constructor(info: FramesArgs) {
    // Load Textures
    if (info.normalImg) {
      this.textureSource['normalTex'] = info.textureLoader.load(info.normalImg)
    }
    if (info.roughImg) {
      this.textureSource['roughTex'] = info.textureLoader.load(info.roughImg)
    }
    if (info.ambientImg) {
      this.textureSource['ambientTex'] = info.textureLoader.load(info.ambientImg)
    }

    info.framesData.forEach((frameData, idx) => {
      // Geometry
      const geometry = new THREE.BoxGeometry(frameData.width, frameData.height, frameData.depth)

      // Texture
      const textures: Record<string, THREE.Texture> = {}
      textures['baseTex'] = info.textureLoader.load(info.postList[idx].imageURL)

      for (const key in this.textureSource) {
        this.textureSource[key].wrapS = THREE.RepeatWrapping
        this.textureSource[key].wrapT = THREE.RepeatWrapping

        this.textureSource[key].repeat.x = frameData.width * (info.repeatFactor || 1)
        this.textureSource[key].repeat.y = frameData.height * (info.repeatFactor || 1)
      }

      // Material
      const material = info.roughImg
        ? new THREE.MeshStandardMaterial({
            color: info.color,
            map: this.textureSource['baseTex'] || undefined,
            normalMap: this.textureSource['normalTex'] || undefined,
            aoMap: this.textureSource['ambientTex'] || undefined,
            roughnessMap: this.textureSource['roughTex'] || undefined,
          })
        : new THREE.MeshLambertMaterial({
            color: info.color,
            map: this.textureSource['baseTex'] || undefined,
            normalMap: this.textureSource['normalTex'] || undefined,
            aoMap: this.textureSource['ambientTex'] || undefined,
          })

      // Adjust position (pivot : left top)
      const rotationX = frameData.rotationX || 0
      const rotationY = frameData.rotationY || 0
      const rotationZ = frameData.rotationZ || 0

      const mesh = new FrameMesh(geometry, material, info.postList[idx].order)
      mesh.position.set(frameData.x, frameData.y, frameData.z)
      mesh.rotation.set(rotationX, rotationY, rotationZ)
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.name = 'frame'

      this.meshes.push(mesh)
      info.container.add(mesh)

      // Light
      if (info.spotLight && frameData.width) {
        const spotLight = new THREE.SpotLight(
          info.spotLight.color || 0xffffe6,
          info.spotLight.intensity || frameData.width * 4,
          info.spotLight.distance || frameData.width * 2,
          info.spotLight.angle || Math.PI / 5.2,
          info.spotLight.penumbra,
          info.spotLight.decay || 2
        )
        spotLight.position.set(
          info.spotLight.lightOffsetX || 0,
          info.spotLight.lightOffsetY || frameData.width,
          info.spotLight.lightOffsetZ || frameData.width
        )
        spotLight.target = mesh
        spotLight.castShadow = true

        mesh.add(spotLight)
        this.spotLights.push(spotLight)
      }
    })

    /**
     *  Dispose function: release resources
     */
    this.dispose = () => {
      // Dispose lights
      this.spotLights.forEach((spotLight) => {
        spotLight.dispose()
      })

      // Dispose mesh & material & geometry
      this.meshes.forEach((mesh) => {
        mesh.geometry
        if (mesh.material instanceof Array) {
          mesh.material.forEach((material) => {
            material.dispose()
          })
        } else {
          mesh.material.dispose()
        }

        mesh.geometry.dispose()

        info.container.remove(mesh)
      })

      // Dispose textures
      for (const key in this.textureSource) {
        const texture = this.textureSource[key]
        texture.dispose()
      }
    }

    /**
     *  Update function: animation
     */
    this.update = (delta: number) => {
      this.meshes.forEach((mesh) => {
        mesh.rotation.y += delta
      })
    }
  }
}
