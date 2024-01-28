import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CommentCreateFormData, CommentItemData, CommentUpdateFormData } from './types'
import { ErrorResponse, MessageResponse, TUseMutationOptions, TUseQueryOptions } from '@/@types/api'
import axiosInstance from '@/utils/axiosInstance'
import toastManager from '@/utils/toastManager'

export function useCommentListQuery(postId: number, options?: TUseQueryOptions<CommentItemData[]>) {
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
      ...options,
    }
  )
}

export function useCreateComment(
  postId: number,
  options?: TUseMutationOptions<CommentCreateFormData>
) {
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
      ...options,
    }
  )
}

export function useUpdateComment(
  postId: number,
  commentId: number,
  options?: TUseMutationOptions<CommentUpdateFormData>
) {
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
      ...options,
    }
  )
}

export function useDeleteComment(postId: number, commentId: number, options?: TUseMutationOptions) {
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
      ...options,
    }
  )
}
