import { MusicData } from '../music/types'

export type PostData = {
  postId: number
  order: number
  title: string
  content: string
  createdDate: string
  modifiedDate: string
  imageUrl: string
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
  imageUrl: string
  isActive: boolean
  music?: MusicData | undefined
}

export type PostFormData = {
  id: number
  order: number
  title: string
  content: string
  musicId: number
  image: File | null
  isActive: boolean
  music?: MusicData | undefined
}