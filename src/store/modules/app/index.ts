import { defineStore, acceptHMRUpdate } from 'pinia'
import { pinia } from '@/store'
import type { AppState, Language, Theme } from './helper'
import { getLocalSetting, setLocalSetting } from './helper'

export const useAppStore = defineStore('app-store', {
  state: (): AppState => getLocalSetting(),

  getters: {
    // 滑块10倍
    temperatureValue(state) {
      return state.temperature
    }
  },

  actions: {
    setSiderCollapsed(collapsed: boolean) {
      this.siderCollapsed = collapsed
      this.recordState()
    },

    setTheme(theme: Theme) {
      this.theme = theme
      this.recordState()
    },

    setLanguage(language: Language) {
      if (this.language !== language) {
        this.language = language
        this.recordState()
      }
    },

    setTemperature(temperature: number) {
      if (this.temperature !== temperature) {
        this.temperature = temperature;
        this.recordState();
      }
    },

    recordState() {
      setLocalSetting(this.$state)
    },
  },
})

export function useAppStoreWithOut() {
  return useAppStore(pinia)
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore as any, import.meta.hot))
}