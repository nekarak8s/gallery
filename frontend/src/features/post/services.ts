import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PostItemData } from './types'
import axiosInstance from '@/utils/axiosInstance'
import toastManager from '@/utils/toastManager/toastManager'

export function usePostListQuery(galleryId: number) {
  return useQuery<MessageResponse<PostItemData[]>, ErrorResponse, PostItemData[]>(
    ['post', { galleryId }],
    () => axiosInstance.get(`/post/list/${galleryId}`),
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

export function useUpdatePostList(galleryId: number) {
  const queryClient = useQueryClient()
  return useMutation<MessageResponse, ErrorResponse, FormData>(
    (data) =>
      axiosInstance.patch(`/post/list/${galleryId}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    {
      onSuccess: (res) => {
        toastManager.addToast('success', res.message)
        queryClient.invalidateQueries(['post', { galleryId }])
      },
      onError: (err) => {
        toastManager.addToast('error', err.message)
      },
    }
  )
}
