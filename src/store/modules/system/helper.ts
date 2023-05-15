export interface SystemState {
	name: string,
	announcement: string,
	wechatGroupQRDarkImage?: {
		fileId: string;
		url: string;
	},
	wechatGroupQRLightImage?: {
		fileId: string;
		url: string;
	},
}