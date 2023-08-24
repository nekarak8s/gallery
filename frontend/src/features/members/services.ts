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

// import apiRequest from '../axiosInterceptor'

// export function health() {
//   return apiRequest.get('/member/health')
// }

// export function login(type) {
//   return apiRequest
//     .post(`/member/login?type=${type}`)
//     .then((response) => {
//       console.log(response.data)
//       const redirectUrl = response.data
//       window.location.href = redirectUrl // 브라우저 리다이렉트
//     })
//     .catch((error) => {
//       console.log(2)
//       console.error('Error:', error)
//     })
// }

// export function loginCallback(type, code) {
//   return apiRequest.post(`/member/callback?type=${type}&code=${code}`)
// }
