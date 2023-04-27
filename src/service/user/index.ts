import { USER_URL, post, get, put } from '@/api/index';
import { UserInfo } from '@/store/modules/user/helper'

export const getUserInfo = () => {
	return get<UserInfo>(`${USER_URL}/info`, {})
}

export const getUserProfile = (bodyParams: {phoneArea:string;phoneNumber:string;authCode:string}) => {
	return get<{
		token: string,
		expiresTime: number,
	}>(`${USER_URL}/profile`,{
		data: {
			phoneArea: bodyParams.phoneArea,
			phoneNumber: bodyParams.phoneNumber,
			authCode: bodyParams.authCode,
		}
	})
}

export const updateUserProfile = (
	bodyParams: {
		avatarUrl?:string,
		description?:string,
		gender?:string,
		language?: string,
		nickname?: string,
		theme?: string,
	}
) => {
	return put<any>(`${USER_URL}/profile`,{
		data: bodyParams
	})
}