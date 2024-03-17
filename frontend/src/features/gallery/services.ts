import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { GalleryData, GalleryFormData, GallerySearchItemData, PlaceData } from './types'
import axiosInstance from '@/utils/axiosInstance'
import toastManager from '@/utils/toastManager/toastManager'

export function useGalleryListQuery() {
  return useQuery<MessageResponse<GalleryData[]>, ErrorResponse, GalleryData[]>(
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
  return useMutation<MessageResponse, ErrorResponse, GalleryFormData>(
    (data) => axiosInstance.post(`/gallery`, data),
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(['gallery-list'])
        toastManager.addToast('success', res.message)
      },
      onError: (err) => {
        toastManager.addToast('error', err.message)
      },
    }
  )
}

export function useGalleryQuery(galleryId: number) {
  return useQuery<MessageResponse<GalleryData>, ErrorResponse, GalleryData>(
    ['gallery', { galleryId }],
    () => axiosInstance.get(`/gallery/${galleryId}`),
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

export function useUpdateGallery(galleryId: number) {
  const queryClient = useQueryClient()
  return useMutation<MessageResponse, ErrorResponse, GalleryFormData>(
    (data) => axiosInstance.patch(`/gallery/${galleryId}`, data),
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(['gallery-list'])
        queryClient.invalidateQueries(['gallery', { galleryId }])
        toastManager.addToast('success', res.message)
      },
      onError: (err) => {
        toastManager.addToast('error', err.message)
      },
    }
  )
}

export function useDeleteGallery(galleryId: number) {
  const queryClient = useQueryClient()
  return useMutation<MessageResponse, ErrorResponse>(
    () => axiosInstance.delete(`/gallery/${galleryId}`),
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(['gallery-list'])
        queryClient.invalidateQueries(['gallery', { galleryId }])
        toastManager.addToast('success', res.message)
      },
      onError: (err) => {
        toastManager.addToast('error', err.message)
      },
    }
  )
}

export function useSearchGalleryQuery(type: string, query: string) {
  return useQuery<MessageResponse<GallerySearchItemData[]>, ErrorResponse, GallerySearchItemData[]>(
    ['gallery', { type, query }],
    () =>
      axiosInstance.get(`/gallery/search`, {
        params: {
          type,
          query,
        },
      }),
    {
      onSuccess: () => {},
      onError: (err) => {
        toastManager.addToast('error', err.message)
      },
      select: (res) => {
        return res.data
      },
      enabled: false,
    }
  )
}

export function usePlaceListQuery() {
  return useQuery<MessageResponse<PlaceData[]>, ErrorResponse, PlaceData[]>(
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
