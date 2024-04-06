import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh'
import { MeshoptDecoder } from '../../decoder/MeshoptDecoder'
import { toLambert } from '../../utils/changeMaterial'
import { IItem } from '../Item'

THREE.Mesh.prototype.raycast = acceleratedRaycast

type AsyncItemFacotryProps = {
  container: THREE.Scene | THREE.Object3D
  gltfLoader: GLTFLoader
  [prop: string]: any // allow other properties
}

export interface IAsyncItemFactory {
  addItem: (props: AsyncItemFacotryProps) => Promise<IItem>
  createItem: (args: unknown) => Promise<IItem>
}

export abstract class AsyncItemFactory implements IAsyncItemFactory {
  async addItem(props: AsyncItemFacotryProps) {
    // Pre process : set meshopt decoder
    props.gltfLoader.setMeshoptDecoder(MeshoptDecoder)

    const item = await this.createItem(props)

    // Post process 1 : add bounds tree to the object
    item.object.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        // post.process 1 : StnadardMaterial -> MeshLambertMaterial
        toLambert(obj) // eslint-disable-line

        // Post process 2 : add bounds tree to the object
        obj.geometry.boundsTree = new MeshBVH(obj.geometry) // eslint-disable-line
      }
    })

    // Post process 3 : add the item to the container
    props.container.add(item.object)

    // Post process 4 : remove the item from the container when it is disposed
    const originalDispose = item.dispose.bind(item)
    item.dispose = () => {
      props.container.remove(item.object)
      originalDispose()
    }

    return item
  }

  abstract createItem(args: unknown): Promise<IItem>
}
