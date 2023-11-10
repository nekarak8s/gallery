import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/utils/axiosInstance'
import toastManager from '@/utils/toastManager/toastManager'

// 공간 목록 조회
export function usePlaceListQuery() {
  return useQuery<MessageResponse<Place[]>, ErrorResponse, Place[]>(
    ['place'],
    () => axiosInstance.get(`/gallery/place/list`),
    {
      onSuccess: () => {},
      onError: (err) => {
        toastManager.addToast('error', err.message)
      },
      select: (res) => {
        return res.data
      },
      staleTime: Infinity,
    }
  )
}

export function useGalleryListQuery() {
  return useQuery<MessageResponse<Gallery[]>, ErrorResponse, Gallery[]>(
    ['gallery-list'],
    () => axiosInstance.get(`/gallery/list`),
    {
      onSuccess: () => {},
      onError: (err) => {
        toastManager.addToast('error', err.message)
      },
      select: (res) => {
        return res.data
      },
      staleTime: Infinity,
    }
  )
}

export function useCreateGallery() {
  const queryClient = useQueryClient()
  return useMutation<MessageResponse, ErrorResponse, GalleryForm>(
    (data) => axiosInstance.post(`/gallery`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['gallery-list'])
      },
      onError: (err) => {
        toastManager.addToast('error', err.message)
      },
    }
  )
}
