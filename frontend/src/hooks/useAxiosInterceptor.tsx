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
  withCredentials: true,
})

// axiosInterceptor
function useAxiosInterceptor() {
  const navigate = useNavigate()
  console.log(process.env.REACT_APP_API_BASE_URL)
  useEffect(() => {
    const responseInterceptor = (response: AxiosResponse) => {
      console.log('res', response)
      console.log('response-data', response.data)
      return response.data
    }
    const responseErrorInterceptor = (error: AxiosError) => {
      console.log('err', error)

      // logout
      // if (error.response?.data?.code === '401') {
      //   navigate(routes['Home'].path)
      // }
      return Promise.reject(error.response)
    }

    // eslint-disable-next-line
    const myResponseInterceptor = axiosInstance.interceptors.response.use(
      responseInterceptor, // eslint-disable-line
      responseErrorInterceptor
    )

    return () => {
      axiosInstance.interceptors.response.eject(myResponseInterceptor)
    }
  }, [])
}

export default useAxiosInterceptor
