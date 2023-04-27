import { AUTH_URL, post } from '@/api/index';

export const authByPsd = (bodyParams:{identity:string, password:string}) => {
	return post<{
		token: string,
		expiresTime: number,
	}>(`${AUTH_URL}/password`,{
		data: bodyParams
	})
}

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

export const sendPhoneCode = (bodyParams: {phoneArea:string;phoneNumber:string}) => {
	return post<any>(`${AUTH_URL}/phone/code`,{
		data: {
			phoneArea: bodyParams.phoneArea,
			phoneNumber: bodyParams.phoneNumber,
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

export const sendEmailCode = (bodyParams: {emailAddress:string, type: 'Register'}) => {
	return post<any>(`${AUTH_URL}/email/code`,{
		data: bodyParams
	})
}