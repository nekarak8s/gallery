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
export function login(type: string) {
  const navigate = useNavigate()
  return useMutation<LoginResponse>(
    () => axiosInstance.post(`/login?type=${type}`),
    {
      onSuccess: (res) => {
        const redirectURL = res.data
        navigate(redirectURL)
      },
      onError: () => {
        //   toast.addMessage('error', err.data.message)
      },
    }
  )
}
