import { defineStore } from 'pinia'
import { pinia } from '@/store'
import { getToken, removeToken, setToken } from './helper'

interface SessionResponse {
  auth: boolean
}

export interface AuthState {
  token: string | undefined,
  tokenExpire: number | null,
  session: SessionResponse | null,
  model: string,
  maxTokens: number,
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    token: getToken(),
    tokenExpire: null,
    session: null,
    model: 'gpt-3.5-turbo',
    maxTokens: 2000,
  }),

  getters: {
    isChatGPTAPI(state): boolean {
      return state.model === 'gpt-3.5-turbo'
    },

    apiModel(state) {
      return state.model
    }
  },

  actions: {
    async getSession() {
      try {
        const data = {auth: false, model: 'gpt-3.5-turbo'}
        this.session = { ...data } as any
        return Promise.resolve(data)
      }
      catch (error) {
        return Promise.reject(error)
      }
    },

    setToken(token: string, expire: number|string) {
      this.token = token;
      this.tokenExpire = Number(expire);
      setToken(token, Number(expire))
    },

    removeToken() {
      this.token = undefined
      removeToken()
    },
  },
})

export function useAuthStoreWithout() {
  return useAuthStore(pinia)
}