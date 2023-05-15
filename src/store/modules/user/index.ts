import { defineStore, acceptHMRUpdate } from 'pinia';
import type { UserInfo, UserState, Profile } from './helper';
import { defaultInfo, defualtProfile, defualtTokenUsage } from './helper';
import { getUserInfo, getUserProfile, updateUserProfile } from '@/service/user';

export const useUserStore = defineStore('user-store', {
  state: (): UserState => {
    return {
      userInfo: {
        userId: '',
        username: '',
        role: '',
        email: '',
        phone: '',
        equities: [],
        registrations: [],
        profile: {
          avatarUrl: '',
          description: '',
          gender: null,
          nickname: '',
          settings: {},
        },
        tokenUsages: [],
      },
    }
  },
  getters: {
    infoGetter(state) {
      return { ...defaultInfo(), ...state.userInfo }
    },
    profileGetter(state) {
      return { ...defualtProfile(), ...state.userInfo.profile }
    },
    tokenUsagesGetter(state) {
      const data = state.userInfo.tokenUsages.reduce((result, current) => {
        if(!result[current.model]) {
          result[current.model] = current;
        }
        return result
      }, {} as any);
      return { ...defualtTokenUsage(), ...data}
    },
    availableEquities(state){
      return state.userInfo.equities.filter((item:any) => {
        return item.status === 'AVAILABLE';
      }).map((item:any) => {
        for(let [key, value] of Object.entries(item.limitation)) {
          item['limitation.'+key] = value;
        }
        return item
      })
    },
    maxTokensPerRequest(state) {
      const maxTokens = this.availableEquities.map((item) => {
        return item.limitation.maxTokensPerRequest
      }) as number[]
      return Math.max(...maxTokens)
    }
  },
  actions: {
    async getUserInfo() {
      const data = await getUserInfo();
      this.userInfo = data;
    },

    async updateProfile(profile: Profile) {
      const data = await updateUserProfile(profile);
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore as any, import.meta.hot))
}