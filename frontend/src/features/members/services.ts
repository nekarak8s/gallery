import { routes } from '@/App'
import { axiosInstance } from '@/hooks/useAxiosInterceptor'
import { expDateState } from '@/stores/auth.store'
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
  return useMutation<MessageResponse<LoginData>, ErrorResponse>(
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
  const setExpDateState = useSetRecoilState(expDateState)
  return useMutation<MessageResponse<LoginCallbackData>, ErrorResponse>(
    () => axiosInstance.post(`/member/callback?type=${type}&code=${code}`),
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(['user'])
        setExpDateState(res.data.expirationDate)

        console.log(1, res)
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
      select: (res) => res.data,
      staleTime: Infinity,
    }
  )
}

// export function useUpdateProfile(form: ProfileFormData) {
//   const [result, message] = validateProfile(form)
//   if (!result) return

//   return useMutation<MessageResponse<UserData>, ErrorResponse, UserData>(
//     ['user'],
//     () => axiosInstance.get(`/member`),
//     {
//       onSuccess: () => {},
//       onError: () => {
//         //   toast.addMessage('error', err.data.message)
//       },
//       select: (res) => res.data,
//       staleTime: Infinity,
//     }
//   )
// }
