import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TUseMutationOptions } from './../../@types/api'
import { GalleryData, GalleryFormData, GallerySearchItemData, PlaceData } from './types'
import { ErrorResponse, MessageResponse, TUseQueryOptions } from '@/@types/api'
import axiosInstance from '@/utils/axiosInstance'
import toastManager from '@/utils/toastManager/toastManager'

export function useGalleryListQuery(options?: TUseQueryOptions<GalleryData[]>) {
  return useQuery<MessageResponse<GalleryData[]>, ErrorResponse, GalleryData[]>(['gallery-list'], () => axiosInstance.get(`/gallery/list`), {
    onSuccess: () => {},
    onError: (err) => {
      toastManager.addToast('error', err.message)
    },
    select: (res) => {
      return res.data
    },
    staleTime: Infinity,
    ...options,
  })
}

export function useCreateGallery(options?: TUseMutationOptions<GalleryFormData>) {
  const queryClient = useQueryClient()
  return useMutation<MessageResponse, ErrorResponse, GalleryFormData>((data) => axiosInstance.post(`/gallery`, data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries(['gallery-list'])
      toastManager.addToast('success', res.message)
    },
    onError: (err) => {
      toastManager.addToast('error', err.message)
    },
    ...options,
  })
}

export function useGalleryQuery(galleryId: number, options?: TUseQueryOptions<GalleryData>) {
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
      ...options,
    }
  )
}

export function useUpdateGallery(galleryId: number, options?: TUseMutationOptions<GalleryFormData>) {
  const queryClient = useQueryClient()
  return useMutation<MessageResponse, ErrorResponse, GalleryFormData>((data) => axiosInstance.patch(`/gallery/${galleryId}`, data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries(['gallery-list'])
      queryClient.invalidateQueries(['gallery', { galleryId }])
      toastManager.addToast('success', res.message)
    },
    onError: (err) => {
      toastManager.addToast('error', err.message)
    },
    ...options,
  })
}

export function useDeleteGallery(galleryId: number, options?: TUseMutationOptions) {
  const queryClient = useQueryClient()
  return useMutation<MessageResponse, ErrorResponse>(() => axiosInstance.delete(`/gallery/${galleryId}`), {
    onSuccess: (res) => {
      queryClient.invalidateQueries(['gallery-list'])
      queryClient.invalidateQueries(['gallery', { galleryId }])
      toastManager.addToast('success', res.message)
    },
    onError: (err) => {
      toastManager.addToast('error', err.message)
    },
    ...options,
  })
}

export function useSearchGalleryQuery(type: string, query: string, options?: TUseQueryOptions<GallerySearchItemData[]>) {
  return useQuery<MessageResponse<GallerySearchItemData[]>, ErrorResponse, GallerySearchItemData[]>(
    ['gallery', { type, query }],
    () =>
      axiosInstance.get(`/gallery/search`, {
        params: {
          type,
          query,
          size: 5,
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
      ...options,
    }
  )
}

export function usePlaceListQuery(options?: TUseQueryOptions<PlaceData[]>) {
  return useQuery<MessageResponse<PlaceData[]>, ErrorResponse, PlaceData[]>(['place'], () => axiosInstance.get(`/gallery/place/list`), {
    onSuccess: () => {},
    onError: (err) => {
      toastManager.addToast('error', err.message)
    },
    select: (res) => {
      return res.data
    },
    staleTime: Infinity,
    ...options,
  })
}
