import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { routes } from '@/App'

// Create Axios Instance
export const axiosInstance = axios.create({
  baseURL: 'http://172.16.101.152:8000/',
  headers: {
    'Content-Type': 'application/json',
  },
})

// axiosInterceptor
function useAxiosInterceptor() {
  const navigate = useNavigate()

  useEffect(() => {
    const responseInterceptor = (response: AxiosResponse) => {
      console.log(response)
      return response
    }
    const responseErrorInterceptor = (error: AxiosError<ErrorData>) => {
      console.log(error)

      // logout
      if (error.response?.data?.code === '401') {
        navigate(routes['Home'].path)
      }
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
