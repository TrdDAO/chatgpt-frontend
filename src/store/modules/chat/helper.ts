import { cs } from '@/utils/storage'

const LOCAL_NAME = 'chatStorage';
interface ChatLocal {
  sendHistory: boolean,
  modelVersion: 'GPT3_5' | 'GPT4',
}

export function defaultState():ChatLocal {
  return {
    sendHistory: true,
    modelVersion: 'GPT3_5',
  }
}

export function getLocalState(): ChatLocal {
  const localState = cs.get(LOCAL_NAME)
  return { ...defaultState(), ...localState }
}

export function setLocalState(state: ChatLocal) {
  cs.set(LOCAL_NAME, state)
}
