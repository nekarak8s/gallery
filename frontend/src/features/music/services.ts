import { useQuery, useMutation } from '@tanstack/react-query'
import { MusicData, MusicSearchData } from './types'
import { ErrorResponse, MessageResponse, TUseMutationOptions, TUseQueryOptions } from '@/@types/api'
import axiosInstance from '@/utils/axiosInstance'
import toastManager from '@/utils/toastManager'

export function useMusicListQuery(query: string, options?: TUseQueryOptions<MusicSearchData[]>) {
  return useQuery<MessageResponse<MusicSearchData[]>, ErrorResponse, MusicSearchData[]>(
    ['music', { query }],
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
      ...options,
    }
  )
}

export function useCreateMusic(options?: TUseMutationOptions<MusicSearchData>) {
  return useMutation<MessageResponse<MusicData>, ErrorResponse, MusicSearchData>(
    (data) => axiosInstance.post(`/post/music`, data),
    {
      onSuccess: () => {},
      onError: (err) => {
        toastManager.addToast('error', err.message)
      },
      ...options,
    }
  )
}
