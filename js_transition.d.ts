// proper .d.ts definition files for them.
declare var template:any;
// node's typings definitions currently break stuff, use this instead
declare var DEBUG:any;

interface Window {
  browserHistory:import('history').History<any>;
	$loadingBar: import('naive-ui').LoadingBarProviderInst;
	$dialog: import('naive-ui').DialogProviderInst;
  $message: import('naive-ui').MessageProviderInst;
  $notification: import('naive-ui').NotificationProviderInst;
}
interface ImportMetaEnv {
  readonly VITE_GLOB_API_URL: string;
	readonly VITE_APP_API_BASE_URL: string;
	readonly VITE_GLOB_OPEN_LONG_REPLY: string;
	readonly VITE_GLOB_APP_PWA: string;
}

declare namespace Chat {

	// 会话详情
	interface Message {
		content: string
		errorInfo: string | null
		messageId: string
		role: 'USER' | 'ASSISTANT'
		status: 'Succeeded' | 'Processing' | 'Failed'
		time: number
		timeString?:string
		loading?: boolean
	}

	interface Chat {
		dateTime: string
		text: string
		inversion?: boolean
		error?: boolean
		loading?: boolean
		conversationOptions?: ConversationRequest | null
		requestOptions: { prompt: string; options?: ConversationRequest | null }
	}

	interface History {
		isLoading?: boolean
		isEdit?: boolean
		originName?: string
		conversationId: string
		ownerUserId: string
		name: string
		model: 'GPT3_5'|'GPT4'
		sendHistory: boolean
		temperature: number
		topP: number
		maxTokens: number
	}

	interface ChatState {
		active: string | null
		sendHistory: boolean;
		modelVersion: 'GPT3_5' | 'GPT4',
		history: History[]
		chat: Map<string, Message[]>
	}

	interface ConversationRequest {
		conversationId?: string
		parentMessageId?: string
	}

	interface ConversationResponse {
		conversationId: string
		detail: {
			choices: { finish_reason: string; index: number; logprobs: any; text: string }[]
			created: number
			id: string
			model: string
			object: string
			usage: { completion_tokens: number; prompt_tokens: number; total_tokens: number }
		}
		id: string
		parentMessageId: string
		role: string
		text: string
	}
}
