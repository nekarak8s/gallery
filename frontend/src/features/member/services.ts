import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { LoginCallbackData, ProfileFormData, UserData } from './types'
import { useLoginStore } from '@/stores/auth.store'
import axiosInstance from '@/utils/axiosInstance'
import toastManager from '@/utils/toastManager'

export function useLogin() {
  return useMutation<MessageResponse<string>, ErrorResponse, string>(
    (type) => axiosInstance.post(`/member/login?type=${type}`),
    {
      onSuccess: (res) => {
        const redirectURL = res.data
        window.location.href = redirectURL
      },
      onError: (err) => {
        toastManager.addToast('error', err.message)
      },
    }
  )
}

export function useLoginCallback(type: string, code: string) {
  const queryClient = useQueryClient()
  const setExpDate = useLoginStore((state) => state.setExpDate)
  return useMutation<MessageResponse<LoginCallbackData>, ErrorResponse>(
    () => axiosInstance.post(`/member/callback?type=${type}&code=${code}`),
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(['user'])
        setExpDate(res.data.expirationDate)
      },
      onError: (err) => {
        toastManager.addToast('error', err.message)
      },
    }
  )
}

export function useLogout() {
  const resetExpDate = useLoginStore((state) => state.resetExpDate)
  return useMutation<MessageResponse<undefined>, ErrorResponse>(
    () => axiosInstance.post(`/member/logout`),
    {
      onSuccess: (res) => {
        toastManager.addToast('success', res.message)
        resetExpDate()
      },
      onError: (err) => {
        toastManager.addToast('error', err.message)
      },
    }
  )
}

export function useUserQuery() {
  return useQuery<MessageResponse<UserData>, ErrorResponse, UserData>(
    ['user'],
    () => axiosInstance.get(`/member`),
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

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation<MessageResponse, ErrorResponse, ProfileFormData>(
    (data) => axiosInstance.patch(`/member`, data),
    {
      onSuccess: (res) => {
        toastManager.addToast('success', res.message)
        queryClient.invalidateQueries(['user'])
      },
      onError: (err) => {
        toastManager.addToast('error', err.message)
      },
    }
  )
}

export function useWithdrawl() {
  const resetExpDate = useLoginStore((state) => state.resetExpDate)
  return useMutation<MessageResponse<undefined>, ErrorResponse>(
    () => axiosInstance.delete(`/member`),
    {
      onSuccess: (res) => {
        toastManager.addToast('success', res.message)
        resetExpDate()
      },
      onError: (err) => {
        toastManager.addToast('error', err.message)
      },
    }
  )
}
