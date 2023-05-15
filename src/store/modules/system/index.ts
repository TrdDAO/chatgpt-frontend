import { defineStore, acceptHMRUpdate } from 'pinia';
import { getSystemProfile } from '@/service/common';
import type { SystemState } from './helper';

export const useSystemStore = defineStore('system-store', {
	state: (): SystemState =>{
		return {
			name: '',
			announcement: '',
			wechatGroupQRDarkImage: {
				fileId: '',
				url: '',
			},
			wechatGroupQRLightImage: {
				fileId: '',
				url: '',
			},
		}
	},
	getters: {
		getSystemWechatGroupQRDarkImage: (state: SystemState) => state.wechatGroupQRDarkImage?.url,
		getSystemWechatGroupQRLightImage: (state: SystemState) => state.wechatGroupQRLightImage?.url,
	},
  actions: {
		async getSystemProfile () {
			const data = await getSystemProfile();
			this.$state = data;
		}
	}
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSystemStore as any, import.meta.hot))
}