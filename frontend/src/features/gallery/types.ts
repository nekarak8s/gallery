import { PostData } from '../post/types'
import { IControls } from '@/libs/three-custom/controls'

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
  controls: IControls
  rayControls: IControls
  postList: PostData[]
}

export type GalleryTypeReturns = {
  update: (delta: number) => void
  dispose: () => void
}
