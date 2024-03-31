import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { acceleratedRaycast } from 'three-mesh-bvh'
import { IAnimal } from './Animal'

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
    const animal = await this.createAnimal(props.gltfLoader)

    // Post process 1 : add the animal to the scene
    props.scene.add(animal.species.object)

    // Post process 2 : set the animal's position
    animal.species.object.position.set(props.position.x, props.position.y, props.position.z)
    animal.species.object.rotation.set(props.rotation.x, props.rotation.y, props.rotation.z)

    // Post process 3 : remove the animal from the scene when it is disposed
    const originalDispose = animal.dispose.bind(animal)
    animal.dispose = () => {
      props.scene.remove(animal.species.object)
      originalDispose()
    }

    return animal
  }

  abstract createAnimal(gltfLoader: GLTFLoader): Promise<IAnimal>
}
