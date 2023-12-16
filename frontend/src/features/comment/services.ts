import { useQueryClient } from 'react-query'
import { useQuery, useMutation } from '@tanstack/react-query'
import { CommentCreateFormData, CommentItemData, CommentUpdateFormData } from './types'
import axiosInstance from '@/utils/axiosInstance'
import toastManager from '@/utils/toastManager'

export function useCommentListQuery(postId: number) {
  return useQuery<MessageResponse<CommentItemData[]>, ErrorResponse, CommentItemData[]>(
    ['comment-list', { postId }],
    () => axiosInstance.get(`/post/comment/list/${postId}`),
    {
      onSuccess: () => {},
      onError: (err) => {
        toastManager.addToast('error', err.message)
      },
      select: (res) => {
        return res.data
      },
    }
  )
}

export function useCreateComment(postId: number) {
  const queryClient = useQueryClient()
  return useMutation<MessageResponse<undefined>, ErrorResponse, CommentCreateFormData>(
    (data) => axiosInstance.post(`/post/comment`, data),
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(['comment-list', { postId }])
        toastManager.addToast('success', res.message)
      },
      onError: (err) => {
        toastManager.addToast('error', err.message)
      },
    }
  )
}

export function useUpdateComment(postId: number, commentId: number) {
  const queryClient = useQueryClient()
  return useMutation<MessageResponse<undefined>, ErrorResponse, CommentUpdateFormData>(
    (data) => axiosInstance.patch(`/post/comment/${commentId}`, data),
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(['comment-list', { postId }])
        toastManager.addToast('success', res.message)
      },
      onError: (err) => {
        toastManager.addToast('error', err.message)
      },
    }
  )
}

export function useDeleteComment(postId: number, commentId: number) {
  const queryClient = useQueryClient()
  return useMutation<MessageResponse<undefined>, ErrorResponse>(
    () => axiosInstance.delete(`/post/comment/${commentId}`),
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(['comment-list', { postId }])
        toastManager.addToast('success', res.message)
      },
      onError: (err) => {
        toastManager.addToast('error', err.message)
      },
    }
  )
}
