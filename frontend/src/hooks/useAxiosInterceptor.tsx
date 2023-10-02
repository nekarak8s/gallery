import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { routes } from '@/App'

// Create Axios Instance
const BASE_API_URL = process.env.REACT_APP_API_BASE_URL
  ? process.env.REACT_APP_API_BASE_URL
  : `http://${window.location.hostname}:${window.location.port}`

export const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// axiosInterceptor
function useAxiosInterceptor() {
  const navigate = useNavigate()

  useEffect(() => {
    const responseInterceptor = (response: AxiosResponse<MessageResponse>) => {
      console.log('res', response)

      return response
    }
    const responseErrorInterceptor = (error: AxiosError<ErrorResponse>) => {
      console.log('err', error)

      // logout
      // if (error.response?.data?.code === '401') {
      //   navigate(routes['Home'].path)
      // }
      return Promise.reject(error.response)
    }

    const myResponseInterceptor = axiosInstance.interceptors.response.use(
      responseInterceptor,
      responseErrorInterceptor
    )

    return () => {
      axiosInstance.interceptors.response.eject(myResponseInterceptor)
    }
  }, [])
}

export default useAxiosInterceptor
