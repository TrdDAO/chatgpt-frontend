import type { AxiosProgressEvent, AxiosResponse, GenericAbortSignal } from 'axios';
import axiosInstance from './axios';
import { baseURL } from '@/api/axios';
import { obj2UrlString } from '@/utils/format/index';
import { useAuthStoreWithout } from '@/store';
import SSE from './sse.js';

export interface HttpOption {
  method?: string
  params?:{[key:string]: string|number}
  data?: any
  headers?: any
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  signal?: GenericAbortSignal
  beforeRequest?: () => void
  afterRequest?: () => void
}

export interface SSEOption {
  method?: string
  params?:object
  data?: any
  headers?: any
  beforeRequest?: () => void
  afterRequest?: () => void
}

export interface Pagination<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  sort: any
  numberOfElements: number
  pageable: any
  first: boolean
  last: boolean
  empty: boolean
}

export interface Response<T = any> {
  data: T
  message: string | null
  code: string
}

function http<T = any>(
  { url, params, data, method, headers, onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption & {url: string},
) {
  // 业务状态处理
  // res直接为 AxiosResponse.data 业务数据，但axios强制是 AxiosResponse，这里用any，其实为 Response<T>
  const successHandler = (res: any): Promise<T> => {
    const authStore = useAuthStoreWithout()
    // 某些方法没有返回值
    if(!res) {
      return Promise.resolve(res)
    }

    if (res.code === '200')
      return Promise.resolve(res.data)

    if (res.code === 'Unauthorized') {
      authStore.removeToken()
      window.location.reload()
    }

    return Promise.reject(res.data)
  }

  const failHandler = (error: Response<Error>) => {
    afterRequest?.()
    return Promise.reject(error)
    //throw new Error(error?.message || 'Error')
  }

  beforeRequest?.()

  method = method || 'GET'

  return axiosInstance.request({
		url,
		method,
		params,
		data,
    signal,
		headers,
		onDownloadProgress
	}).then(successHandler, failHandler)
}

export function get<T = any>(
  url:string,
  { params, method = 'GET',onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
): Promise<T> {
  return http<T>({
    url, 
    method,
    params,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
  })
}

export function post<T = any>(
  url: string,
  { params, data, method = 'POST', headers, onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
): Promise<T> {
  return http<T>({
    url,
    method,
    params,
    data,
    headers,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
  })
}

export function put<T = any>(
  url:string,
  { params, data, method = 'PUT', headers, onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
): Promise<T> {
  return http<T>({
    url,
    method,
    params,
    data,
    headers,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
  })
}

export function delet<T = any>(
  url:string,
  { params, data, method = 'DELETE', headers, onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
): Promise<T> {
  return http<T>({
    url,
    method,
    params,
    data,
    headers,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
  })
}

export function sse(
  url:string,
  { params, data, method='GET', headers, }: SSEOption) {
    const authStore = useAuthStoreWithout()
    return new SSE(`${baseURL}${url}?${obj2UrlString(params)}`, {
      method,
      headers: Object.assign({
        'Content-Type': 'application/json',
        Authorization: authStore.token,
      }, headers),
      withCredentials: true,
      payload: JSON.stringify(data)
    })
}