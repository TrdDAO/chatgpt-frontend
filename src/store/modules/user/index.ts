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
        tokenUsage: {
          dayUsage: 0,
          hourUsage: 0,
          minuteUsage: 0,
          monthUsage: 0,
          totalUsage: 0,
        }
      },
    }
  },
  getters: {
    infoGetter(state) {
      return  { ...defaultInfo(), ...state.userInfo }
    },
    profileGetter(state) {
      return  { ...defualtProfile(), ...state.userInfo.profile }
    },
    tokenUsageGetter(state) {
      return  { ...defualtTokenUsage(), ...state.userInfo.tokenUsage }
    },
    availableEquities(state){
      return  state.userInfo.equities.filter((item:any) => {
        return item.status === 'AVAILABLE';
      }).map((item:any) => {
        for(let [key, value] of Object.entries(item.limitation)) {
          item['limitation.'+key] = value;
        }
        return item
      })
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