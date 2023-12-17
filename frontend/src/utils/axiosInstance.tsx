import axios, { AxiosError, AxiosResponse, AxiosInstance } from 'axios'

// Base URL
const BASE_API_URL =
  process.env.REACT_APP_API_BASE_URL + '/'
    ? process.env.REACT_APP_API_BASE_URL
    : `${window.location.protocol}://${window.location.hostname}:${window.location.port}`

// Axios Instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Axios Interceptor
axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    console.log(res)
    return res.data
  },
  (err: AxiosError<ErrorResponse>) => {
    console.log(err)
    if (
      err.response?.data.errorCode === 'GATE002' ||
      err.response?.data.errorCode === 'GATE003' ||
      err.response?.data.errorCode === 'GATE004'
    ) {
      // 401 오류 (토큰 만료)에 대한 처리
      // 예를 들어, 로그인 페이지로 리다이렉트
      // window.location.href = '/login' // 로그인 페이지 경로로 변경
    }
    return Promise.reject(err.response?.data)
  }
)

export default axiosInstance
