import { cs } from '@/utils/storage'

const LOCAL_NAME = 'settingsStorage'

export interface SettingsState {
  systemMessage: string
}

export function defaultSetting(): SettingsState {
  const currentDate = new Date().toISOString().split('T')[0]
  return {
    systemMessage: `You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible.\nKnowledge cutoff: 2021-09-01\nCurrent date: ${currentDate}`,
  }
}

export function getLocalState(): SettingsState {
  const localSetting: SettingsState | undefined = cs.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalState(setting: SettingsState): void {
  cs.set(LOCAL_NAME, setting)
}

export function removeLocalState() {
  cs.remove(LOCAL_NAME)
}
