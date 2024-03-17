export type CommentData = {
  commentId: number
  nickname: string
  content: string
  createdDate: string
}

export type CommentItemData = {
  commentId: number
  nickname: string
  content: string
  createdDate: string
}

export type CommentCreateFormData = {
  postId: number
  content: string
}

export type CommentUpdateFormData = {
  content: string
}
