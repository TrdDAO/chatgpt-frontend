import { defineStore } from 'pinia'
import { pinia } from '@/store'
import { getToken, removeToken, setToken } from './helper'

interface SessionResponse {
  usage: number | null;
  maxTokens: number | null;
  model: 'GPT3_5'|'GPT3_4';
}

export interface AuthState {
  token: string | undefined,
  tokenExpire: number | null,
  session: SessionResponse | null,
  model: string,
  maxTokens: number, // 单次最大token
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
        const data = {usage: 0, model: 'gpt-3.5-turbo', maxTokens: null};
        this.session = data;
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