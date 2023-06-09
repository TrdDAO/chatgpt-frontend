import type { AxiosProgressEvent, GenericAbortSignal } from 'axios';
import { CHAT_URL, get, post, put, delet, sse } from '@/api/index';
import type { Pagination } from '@/api/http';
import { baseURL } from '@/api/axios'

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
export const newConversation = async(
	bodyParams: {
		name: string,
		model: 'GPT3_5'|'GPT4',
		temperature:number,
		topP:number,
		maxTokens:number,
		sendHistory: boolean,
	}
) => {
	const data = await post<{
		conversationId: string,
		ownerUserId: string,
		name: string,
		model: string,
		temperature: string,
		topP: string,
		maxTokens: string,
		sendHistory: boolean,
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
		model: 'GPT3_5',
		temperature:number,
		topP:number,
		maxTokens:number,
		sendHistory: boolean,
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

// 是否发送历史
export const editHistoryEnabled = async(
	conversationId:string, 
	bodyParams: {
		enabled: boolean,
	}
) => {
	const data = await put<{
		
	}>(`${CHAT_URL}/${conversationId}/send-history`,{
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


// 发送提问
export const postMessageWithSSE = (
	conversationId:string,
	data: {content: string},
):any => {
	return sse(`${CHAT_URL}/${conversationId}/messages`, {
		data,
		method: 'POST',
	})
}