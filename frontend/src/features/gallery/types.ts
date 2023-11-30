type Gallery = {
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

type GalleryForm = {
  placeId: number
  name: string
  content: string
}

type ArtworkForm = {
  name: string
  description: string
  frame: File
}

type Place = {
  placeId: number
  name: string
  maximumFrameNumber: number
  twoDimensionImageUrl: string
  threeDimensionImageUrl: string
}

type TFrame = {
  frameId: number
  order: number
  title: string
  content: string
  framePictureUrl: string
  createdDate: string
  modifiedDate: string
  music: {
    musicId: number
    title: string
    singer: string
    releasedDate: string
    videoUrl: string
    thumbnailUrl: string
  }
}

type GalleryTypeProps = {
  loadingManager: THREE.LoadingManager
  canvas: HTMLCanvasElement
  gallery: Gallery
  frameList: TFrame[]
}

type GalleryTypeReturns = {
  dispose: () => void
}
