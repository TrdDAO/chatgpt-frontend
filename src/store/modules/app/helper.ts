import { cs } from '@/utils/storage'

const LOCAL_NAME = 'appSetting'

export type Theme = 'light' | 'dark' | 'auto'

export type Language = 'zh-CN' | 'zh-TW' | 'en-US'

export interface AppState {
  siderCollapsed: boolean
  theme: Theme
  language: Language
  temperature: number
}

export function defaultSetting(): AppState {
  return { siderCollapsed: false, theme: 'dark', language: 'zh-CN',temperature: 0.7 }
}

export function getLocalSetting(): AppState {
  const localSetting: AppState | undefined = cs.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalSetting(setting: AppState): void {
  cs.set(LOCAL_NAME, setting)
}
