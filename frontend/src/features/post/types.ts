export type PostData = {
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

export type PostFormData = {
  name: string
  description: string
  frame: File
}
