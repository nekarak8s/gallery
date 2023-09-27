import { routes } from '@/App'
import { axiosInstance } from '@/hooks/useAxiosInterceptor'
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'

// 로그인
export function useLogin(type: string) {
  return useMutation<LoginResponse>(
    () => axiosInstance.post(`/member/login?type=${type}`),
    {
      onSuccess: (res) => {
        const redirectURL = res.data
        window.location.href = redirectURL
      },
      onError: () => {
        //   toast.addMessage('error', err.data.message)
      },
    }
  )
}

export function useLoginCallback(type: string, code: string) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation<LoginResponse>(
    () => axiosInstance.post(`/member/callback?type=${type}&code=${code}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user'])
        navigate(routes['Home'].path)
      },
      onError: () => {
        //   toast.addMessage('error', err.data.message)
      },
    }
  )
}

export function useUserQuery() {
  return useQuery<LoginResponse>(['user'], () => axiosInstance.get(`/member`), {
    onSuccess: () => {},
    onError: () => {
      //   toast.addMessage('error', err.data.message)
    },
    select: (res) => res.data,
    staleTime: Infinity,
  })
}
