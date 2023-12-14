import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { GalleryData, GalleryFormData, PlaceData } from './types'
import axiosInstance from '@/utils/axiosInstance'
import toastManager from '@/utils/toastManager/toastManager'

// 공간 목록 조회
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

export function useGalleryListQuery() {
  return useQuery<MessageResponse<GalleryData[]>, ErrorResponse, GalleryData[]>(
    ['gallery'],
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

export function useGalleryQuery(galleryId: number) {
  return useQuery<MessageResponse<GalleryData>, ErrorResponse, GalleryData>(
    ['gallery', galleryId],
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

export function useCreateGallery() {
  const queryClient = useQueryClient()
  return useMutation<MessageResponse, ErrorResponse, GalleryFormData>(
    (data) => axiosInstance.post(`/gallery`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['gallery'])
      },
      onError: (err) => {
        toastManager.addToast('error', err.message)
      },
    }
  )
}

export function useUpdateGallery(galleryId: number) {
  const queryClient = useQueryClient()
  return useMutation<MessageResponse, ErrorResponse, GalleryFormData>(
    (data) => axiosInstance.patch(`/gallery/${galleryId}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['gallery', galleryId])
      },
      onError: (err) => {
        toastManager.addToast('error', err.message)
      },
    }
  )
}

/**
 * Test 용
 */
export function useCreateArtwork() {
  return useMutation<MessageResponse, ErrorResponse, FormData>(
    (data) =>
      axiosInstance.patch(`/post/list`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    {
      onSuccess: () => {},
      onError: (err) => {
        toastManager.addToast('error', err.message)
      },
    }
  )
}
