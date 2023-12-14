import { MusicData } from '../music/types'

export type PostData = {
  postId: number
  order: number
  title: string
  content: string
  imageUrl: string
  createdDate: string
  modifiedDate: string
  music: MusicData
}

export type PostFormData = {
  name: string
  description: string
  frame: File
}
