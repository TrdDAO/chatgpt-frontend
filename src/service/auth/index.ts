import { AUTH_URL, post } from '@/api/index';

export const aythByPhone = (bodyParams: {phoneArea:string;phoneNumber:string;authCode:string}) => {
	return post<{
		token: string,
		expiresTime: number,
	}>(`${AUTH_URL}/phone`,{
		data: {
			phoneArea: bodyParams.phoneArea,
			phoneNumber: bodyParams.phoneNumber,
			authCode: bodyParams.authCode,
		}
	})
}

export const aythByEmail = (bodyParams: {emailAddress:string;authCode:string}) => {
	return post<{
		token: string,
		expiresTime: string,
	}>(`${AUTH_URL}/email`, {
		data: {
			emailAddress: bodyParams.emailAddress,
			authCode: bodyParams.authCode,
		}
	})
}