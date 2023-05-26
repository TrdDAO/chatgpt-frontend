import axios, { type AxiosResponse } from 'axios'
import { useAuthStore } from '@/store'
import { useAuthStoreWithout } from '@/store/modules/auth'

export const baseURL = import.meta.env.DEV ? import.meta.env.VITE_APP_API_LOCAL_URL: location.origin;

export const axiosInstance = axios.create({
  baseURL,
  timeout: 0,
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore().token
    if (token)
      config.headers.Authorization = `${token}`
    return config
  },
  (error) => {
    return Promise.reject(error.response)
  },
)

axiosInstance.interceptors.response.use(
  // 默认状态处理
  (response: AxiosResponse): AxiosResponse => {
    if (response.status === 200)
      return response.data

    throw new Error(response.status.toString())
  },
  (error) => {
    console.log(error)
    const { response } = error
    if(response && response.status === 401 || response.statusText === 'Unauthorized') {
      const authStore = useAuthStoreWithout();
      authStore.removeToken();
    }
    return Promise.reject(response.data ? response.data : error)
  },
)

export default axiosInstance