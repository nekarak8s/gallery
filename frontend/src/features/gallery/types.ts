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
