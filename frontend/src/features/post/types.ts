import { MusicData } from '../music/types'

export type PostData = {
  postId: number
  order: number
  title: string
  content: string
  createdDate: string
  modifiedDate: string
  imageURL: string
  isActive: boolean
  music?: MusicData | undefined
}

export type PostItemData = {
  postId: number
  order: number
  title: string
  content: string
  createdDate: string
  modifiedDate: string
  imageURL: string
  isActive: boolean
  music?: MusicData | undefined
}

export type PostFormData = {
  postId: number
  order: number
  title: string
  content: string
  musicId: number | null
  image: File | null
  isActive: boolean
}

export type PostListFormData = {
  posts: PostFormData[]
}
