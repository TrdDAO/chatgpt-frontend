import { USER_URL, post, get, put } from '@/api/index';

export const getUserInfo = () => {
	return get<{
		email: string|null;
		equities: [];
		phone: string;
		profile: {
			avatarUrl:string|null;
			description:string|null;
			gender:string|null;
			nickname:string|null;
			settings:string|null;
		},
		registrations: [];
		role: string;
		userId: string;
		username: string;
	}>(`${USER_URL}/info`, {})
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
	return put<{
		token: string,
		expiresTime: number,
	}>(`${USER_URL}/profile`,{
		data: bodyParams
	})
}