import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh'
import { IAnimal } from './Animal'
import { MeshoptDecoder } from '../../decoder/MeshoptDecoder'
import { toLambert } from '../../utils/changeMaterial'

THREE.Mesh.prototype.raycast = acceleratedRaycast

type AnimalFactoryProps = {
  scene: THREE.Scene
  gltfLoader: GLTFLoader
  position: {
    x: number
    y: number
    z: number
  }
  rotation: {
    x: number
    y: number
    z: number
  }
}

export interface IAnimalFactory {
  addAnimal: (props: AnimalFactoryProps) => Promise<IAnimal>
  createAnimal: (gltfLoader: GLTFLoader) => Promise<IAnimal>
}

export abstract class AnimalFactory implements IAnimalFactory {
  async addAnimal(props: AnimalFactoryProps) {
    // Pre process : set meshopt decoder
    props.gltfLoader.setMeshoptDecoder(MeshoptDecoder)

    const animal = await this.createAnimal(props.gltfLoader)

    animal.species.object.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        // post.process 1 : StnadardMaterial -> MeshLambertMaterial
        toLambert(obj) // eslint-disable-line

        // Post process 2 : add bounds tree to the object
        obj.geometry.boundsTree = new MeshBVH(obj.geometry) // eslint-disable-line
      }
    })

    // Post process 3 : add the animal to the scene
    props.scene.add(animal.species.object)

    // Post process 4 : set the animal's position
    animal.species.object.position.set(props.position.x, props.position.y, props.position.z)
    animal.species.object.rotation.set(props.rotation.x, props.rotation.y, props.rotation.z)

    // Post process 5 : remove the animal from the scene when it is disposed
    const originalDispose = animal.dispose.bind(animal)
    animal.dispose = () => {
      props.scene.remove(animal.species.object)
      originalDispose()
    }

    return animal
  }

  abstract createAnimal(gltfLoader: GLTFLoader): Promise<IAnimal>
}
