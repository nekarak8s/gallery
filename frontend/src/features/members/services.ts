import { routes } from '@/App'
import axiosInstance from '@/hooks/useAxiosInterceptor'
import { expDateState } from '@/stores/auth.store'
import toastManager from '@/utils/toastManager'
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'

export function useLogin() {
  return useMutation<string, ErrorResponse, string>(
    (type) => axiosInstance.post(`/member/login?type=${type}`),
    {
      onSuccess: (data) => {
        const redirectURL = data
        window.location.href = redirectURL
      },
      onError: () => {
        //   toast.addMessage('error', err.data.message)
      },
    }
  )
}

export function useLogout() {
  return useMutation<MessageResponse<undefined>, ErrorResponse>(
    () => axiosInstance.post(`/member/logout`),
    {
      onSuccess: (res) => {
        toastManager.addToast('success', res.message)
      },
      onError: (err) => {
        toastManager.addToast('error', err.message)
      },
    }
  )
}

export function useWithdrawl() {
  return useMutation<MessageResponse<undefined>, ErrorResponse>(
    () => axiosInstance.delete(`/member`),
    {
      onSuccess: (res) => {
        toastManager.addToast('success', res.message)
      },
      onError: (err) => {
        toastManager.addToast('error', err.message)
      },
    }
  )
}

export function useLoginCallback(type: string, code: string) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const setExpDateState = useSetRecoilState(expDateState)
  return useMutation<MessageResponse<LoginCallbackData>, ErrorResponse>(
    () => axiosInstance.post(`/member/callback?type=${type}&code=${code}`),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['user'])
        setExpDateState(data.data.expirationDate)
        navigate(routes['MyPage'].path)
      },
      onError: () => {
        //   toast.addMessage('error', err.data.message)
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
      onError: () => {
        //   toast.addMessage('error', err.data.message)
      },
      select: (res) => {
        return res.data
      },
      staleTime: Infinity,
    }
  )
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation<MessageResponse, ErrorResponse, ProfileFormData>(
    (data) => axiosInstance.patch(`/member`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user'])
      },
      onError: (err) => {
        toastManager.addToast('error', err.message)
      },
    }
  )
}
