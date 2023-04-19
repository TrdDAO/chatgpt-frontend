import { defineStore } from 'pinia';
import type { UserInfo, UserState, Profile } from './helper';
import { defaultInfo, defualtProfile } from './helper';
import { getUserInfo, getUserProfile, updateUserProfile } from '@/service/user';

export const useUserStore = defineStore('user-store', {
  state: (): UserState => {
    return {
      userInfo: {
        userId: '',
        username: '',
        role: '',
        email: '',
        equities: [],
        phone: '',
        registrations: [],
      },
      profile: {
        avatarUrl: '',
        description: '',
        gender: '',
        nickname: '',
        settings: {},
      },
    }
  },
  getters: {
    infoGetter(state) {
      return  { ...defaultInfo(), ...state.userInfo }
    },
    profileGetter(state) {
      return  { ...defualtProfile(), ...state.profile }
    }
  },
  actions: {
    async getUserInfo() {
      const data = await getUserInfo();
      for(let [key, value] of Object.entries(data)) {
        if(value !== null) {
          this.userInfo[key] = value;
        }
      }
      for(let [key, value] of Object.entries(data.profile)) {
        if(value !== null) {
          this.profile[key] = value;
        }
      }
    },

    async updateProfile(profile: Profile) {
      const data = await updateUserProfile(profile);
    },

    resetUserInfo() {
      this.userInfo = { ...defaultSetting().userInfo }
    },
  },
})
