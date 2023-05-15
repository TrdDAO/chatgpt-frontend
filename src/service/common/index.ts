import type { AxiosProgressEvent, GenericAbortSignal } from 'axios';
import { COMMON_URL, get, post, put, delet } from '@/api/index';
import type { Pagination } from '@/api/http';

// 会话列表
export const getSystemProfile = async() => {
	const data = await get<{
		announcement: string,
		name: string,
		wechatGroupQRDarkImage?: {
			fileId: string;
			url: string;
		},
		wechatGroupQRLightImage?: {
			fileId: string;
			url: string;
		},
	}>(`${COMMON_URL}/system/profile`, {})
	return data
}