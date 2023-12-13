import { World } from 'cannon-es'
import { CannonKeypadControls } from './components/GalleryCanvas/three-custom/controls/CannonKeypadControls'
import { RaycasterControls } from './components/GalleryCanvas/three-custom/controls/RaycasterControls.ts'
import { PostData } from '../post/types'

export type GalleryFormData = {
  name: string
  content: string
  placeId: number
}

export type GalleryData = {
  galleryId: number
  name: string
  content: string
  createdDate: string
  modifiedDate: string
  place: {
    placeId: number
    name: string
    maximumFrameNumber: number
    threeDimensionImageUrl: string
    twoDimensionImageUrl: string
  }
}

export type GalleryItemData = {
  galleryId: number
  name: string
  content: string
  createdDate: string
  modifiedDate: string
  place: {
    placeId: number
    name: string
    maximumFrameNumber: number
    threeDimensionImageUrl: string
    twoDimensionImageUrl: string
  }
}

export type PlaceData = {
  placeId: number
  name: string
  maximumFrameNumber: number
  twoDimensionImageUrl: string
  threeDimensionImageUrl: string
}

export type GalleryTypeProps = {
  canvas: HTMLCanvasElement
  loadingManager: THREE.LoadingManager
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.Camera
  world: World
  controls: CannonKeypadControls
  rayControls: RaycasterControls
  postList: PostData[]
}

export type GalleryTypeReturns = {
  update: (delta: number) => void
  dispose: () => void
}
