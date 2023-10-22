import { routes } from '@/App'
import axiosInstance from '@/utils/axiosInstance'
import { expDateState } from '@/stores/auth.store'
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
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
    (data) => axiosInstance.patch(`/member`, data),
    {
      onSuccess: (res) => {
        console.log(1, res)
        queryClient.invalidateQueries(['gallery-list'])
      },
      onError: (err) => {
        toastManager.addToast('error', err.message)
      },
    }
  )
}
