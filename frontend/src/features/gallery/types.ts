type GalleryItemData = {
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
