// proper .d.ts definition files for them.
declare var template:any;
// node's typings definitions currently break stuff, use this instead
declare var DEBUG:any;

interface Window {
  browserHistory:import('history').History<any>;
	$loadingBar?: import('naive-ui').LoadingBarProviderInst;
	$dialog?: import('naive-ui').DialogProviderInst;
  $message?: import('naive-ui').MessageProviderInst;
  $notification?: import('naive-ui').NotificationProviderInst;
}
interface ImportMetaEnv {
  readonly VITE_GLOB_API_URL: string;
	readonly VITE_APP_API_BASE_URL: string;
	readonly VITE_GLOB_OPEN_LONG_REPLY: string;
	readonly VITE_GLOB_APP_PWA: string;
}

declare namespace Chat {

	interface Message {
		content: string
		errorInfo: string | null
		messageId: string
		role: 'USER' | 'ASSISTANT'
		status: 'Succeeded' | 'Processing' | 'Failed'
		time: number
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
		conversationId: string
		ownerUserId: string
		name: string
		originName?: string
		model: string
		temperature: string
		topP: string
		maxTokens: string
	}

	interface ChatState {
		active: string | null
		usingContext: boolean;
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