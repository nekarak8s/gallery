import axios, { AxiosError, AxiosResponse, AxiosInstance } from 'axios'
import toastManager from './toastManager'
import { ErrorResponse } from '@/@types/api'

// Base URL
const BASE_API_URL = (process.env.REACT_APP_API_BASE_URL ?? window.location.origin) + '/api'

// Axios Instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Axios Interceptor
axiosInstance.interceptors.request.use((config) => {
  console.log('config', config)
  return config
})

axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    console.log('res', res)
    return res.data
  },
  (err: AxiosError<ErrorResponse>) => {
    console.log('err', err)

    /*eslint-disable*/
    // for (const key of err.config!.data!.keys()) {
    //   console.log(key, ':', err.config?.data.get(key))
    // }

    // Test
    if (err.response?.status === 429) {
      toastManager.addToast('error', err.response?.data.message)
    }

    if (err.response?.data.errorCode === 'GATE002' || err.response?.data.errorCode === 'GATE003' || err.response?.data.errorCode === 'GATE004') {
      // Token Error: Redirect to login page
      window.location.href = (process.env.REACT_APP_API_BASE_URL ?? window.location.origin) + '/login'
    }
    return Promise.reject(err.response?.data)
  }
)

export default axiosInstance
