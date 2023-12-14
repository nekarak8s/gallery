import { useQuery, useMutation } from '@tanstack/react-query'
import { MusicData, MusicSearchData } from './types'
import axiosInstance from '@/utils/axiosInstance'
import toastManager from '@/utils/toastManager'

// 음악 목록 조회
export function useMusicListQuery(query: string) {
  return useQuery<MessageResponse<MusicSearchData[]>, ErrorResponse, MusicSearchData[]>(
    ['music'],
    () =>
      axiosInstance.get(`/post/music/list`, {
        params: {
          q: query,
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

// 음악 단일 조회
export function useCreateMusic() {
  return useMutation<MessageResponse<MusicData>, ErrorResponse, MusicSearchData>(
    (data) => axiosInstance.post(`/post/music`, data),
    {
      onSuccess: () => {},
      onError: (err) => {
        toastManager.addToast('error', err.message)
      },
    }
  )
}
