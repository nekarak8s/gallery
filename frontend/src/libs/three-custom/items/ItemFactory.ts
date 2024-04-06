import * as THREE from 'three'
import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh'
import { IItem, IItems } from './Item'

THREE.Mesh.prototype.raycast = acceleratedRaycast

type ItemFactoryProps = {
  container: THREE.Scene | THREE.Object3D
  [prop: string]: any // allow other properties
}

export interface IItemFactory {
  addItem: (props: ItemFactoryProps) => IItem
  createItem: (args: unknown) => IItem
}

export interface IItemsFactory {
  addItem: (props: ItemFactoryProps) => IItems
  createItem: (args: unknown) => IItems
}

export abstract class ItemFactory implements IItemFactory {
  addItem(props: ItemFactoryProps) {
    const item = this.createItem(props)

    // Post process 1 : add bounds tree to the object
    item.object.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.boundsTree = new MeshBVH(obj.geometry) // eslint-disable-line
      }
    })

    // Post process 2 : add the item to the container
    props.container.add(item.object)

    // Post process 3 : remove the item from the container when it is disposed
    const originalDispose = item.dispose.bind(item)
    item.dispose = () => {
      props.container.remove(item.object)
      originalDispose()
    }

    return item
  }

  abstract createItem(args: unknown): IItem
}

export abstract class ItemsFactory implements IItemsFactory {
  addItem(props: ItemFactoryProps) {
    const items = this.createItem(props)

    items.objects.forEach((object) => {
      // Post process 1 : add bounds tree to the object
      object.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.boundsTree = new MeshBVH(obj.geometry) // eslint-disable-line
        }
      })
      // Post process 2 : add the items to the container
      props.container.add(object)
    })

    // Post process 3 : remove the items from the container when it is disposed
    const originalDispose = items.dispose.bind(items)
    items.dispose = () => {
      items.objects.forEach((object) => {
        props.container.remove(object)
      })
      originalDispose()
    }

    return items
  }

  abstract createItem(args: unknown): IItems
}
