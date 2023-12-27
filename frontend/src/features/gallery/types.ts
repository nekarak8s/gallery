import { World } from 'cannon-es'
import { PostData } from '../post/types'
import { CannonKeypadControls } from '@/libs/three-custom/controls/CannonKeypadControls'
import { RaycasterControls } from '@/libs/three-custom/controls/RaycasterControls.ts'

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
    threeDimensionImageUri: string
    twoDimensionImageUri: string
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
    threeDimensionImageUri: string
    twoDimensionImageUri: string
  }
}

export type GallerySearchItemData = {
  galleryId: number
  title: string
  content: string
  nickname: string
  createdDate: string
}

export type PlaceData = {
  placeId: number
  name: string
  maximumFrameNumber: number
  twoDimensionImageUri: string
  threeDimensionImageUri: string
}

export type GalleryTypeProps = {
  canvas: HTMLCanvasElement
  loadingManager: THREE.LoadingManager
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  world: World
  controls: CannonKeypadControls
  rayControls: RaycasterControls
  postList: PostData[]
}

export type GalleryTypeReturns = {
  update: (delta: number) => void
  dispose: () => void
}
