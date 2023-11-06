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

type Place = {
  placeId: number
  name: string
  maximumFrameNumber: number
  twoDimensionImageUrl: string
  threeDimensionImageUrl: string
}

type Frame = {
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
