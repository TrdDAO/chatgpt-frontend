import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { CHAT_URL, get, post, put, delet } from '@/api/index'
import type { Pagination } from '@/api/http'

// 会话列表
export const getConversations = async(queryParams: {page: number,size: number,sort?:string}) => {
	const data = await get<Pagination<{
		conversationId: string,
		ownerUserId: string,
		name: string,
		originName?: string,
		model: string,
		temperature: string,
		topP: string,
		maxTokens: string
	}>>(`${CHAT_URL}`,{
		params: queryParams
	})
	return data
}

// 新增会话
export const newConversation = async(bodyParams: {name: string,model: 'gpt-3.5-turbo',temperature:number, topP:number,maxTokens:number}) => {
	const data = await post<{
		conversationId: string,
		ownerUserId: string,
		name: string,
		model: string,
		temperature: string,
		topP: string,
		maxTokens: string
	}>(`${CHAT_URL}`,{
		data: bodyParams
	})
	return data
}

// 修改信息
export const editConversation = async(
	conversationId:string, 
	bodyParams: {
		name: string,
		model: 'gpt-3.5-turbo',
		temperature:number,
		topP:number,
		maxTokens:number
	}
) => {
	const data = await put<{
		conversationId: string,
		ownerUserId: string,
		name: string,
		model: string,
		temperature: string,
		topP: string,
		maxTokens: string
	}>(`${CHAT_URL}/${conversationId}`,{
		data: bodyParams
	})
	return data
}

// 删除会话
export const deleteConversation = async(
	conversationId:string
) => {
	const data = await delet<{
		conversationId: string,
		ownerUserId: string,
		name: string,
		model: string,
		temperature: string,
		topP: string,
		maxTokens: string
	}>(`${CHAT_URL}/${conversationId}`, {})
	return data
}

// 会话历史消息
export const getConversationMessages = async(conversationId:string, queryParams: {page: number,size: number,sort?:string}) => {
	const data = await get<Pagination<Chat.Message>>(`${CHAT_URL}/${conversationId}/messages`,{
		params: queryParams
	})
	return data
}

// 发送提问
export const postConversationMessages = async(
	conversationId:string,
	options: {
		data: {content: string},
		signal?: GenericAbortSignal,
		onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void,
	}	
) => {
	const data = await post<{
		content: string,
	}>(`${CHAT_URL}/${conversationId}/messages`,options)
	return data
}