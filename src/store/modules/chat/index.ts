import { defineStore, acceptHMRUpdate } from 'pinia'
import { getLocalState, setLocalState } from './helper'
import { getConversationMessages } from '@/service/chat'
import { router } from '@/router'

export const useChatStore = defineStore('chat-store', {
  state: (): Chat.ChatState => {
    return {
      active: '',
      usingContext: true, // 携带上下文
      history: [], // 会话列表
      chat: new Map(),
    }
  },

  getters: {
    getChatHistoryByCurrentActive(state: Chat.ChatState) {
      const index = state.history.findIndex(item => item.conversationId === state.active)
      if (index !== -1)
        return state.history[index]
      return null
    },

    // 会话详情
    // getChatByUuid(state: Chat.ChatState) {
    //   return (conversationId?: string) => {
    //     if (conversationId)
    //       return state.chat.find(item => item.conversationId === conversationId)?.data ?? []
    //     return state.chat.find(item => item.conversationId === state.active)?.data ?? []
    //   }
    // },
    getMessagesByConversationId(state: Chat.ChatState) {
      return state.active ? state.chat.get(state.active) || [] : []
    }
  },

  actions: {
    async setActive(conversationId: string) {
      this.active = conversationId
      return await this.reloadRoute(conversationId)
    },

    // 设置会话列表
    setHistory(histories: Chat.History[]) {
      this.history = histories
    },

     // 新建聊天
    async addHistory(history: Chat.History) {
      this.history.unshift(history)
      this.active = history.conversationId
      return await this.reloadRoute(history.conversationId)
    },

    updateHistory(conversationId: string, key: Partial<Chat.History>) {
      const index = this.history.findIndex((item) => item.conversationId === conversationId);
      if(index !== -1) {
        this.history[index] = { ...this.history[index], ...key }
      }
    },

    deleteHistory(conversationId: string) {
      const index = this.history.findIndex((item) => item.conversationId === conversationId);
      if(index !== -1) {
        this.history.splice(index, 1);
        this.chat.delete(conversationId)
        console.log(this.history);
      }
    },
    
    // 往后加
    addChatMessages(conversationId: string, chats: Chat.Message[]) {
      // 重置
      if(!this.chat.has(conversationId)) {
        this.chat.set(conversationId, chats)
      } else {
        const messages = this.chat.get(conversationId) || [];
        // 历史记录在前
        this.chat.set(conversationId, [ ...messages, ...chats])
      }
    },

    // 往前加
    unShiftChatMessages(conversationId: string, chats: Chat.Message[]) {
      const messages = this.chat.get(conversationId) || [];
      // 历史记录在前
      this.chat.set(conversationId, [ ...chats, ...messages])
    },

    updateChatMessage(conversationId:string, index:number, chat: Chat.Message) {
      
    },

    setUsingContext(context: boolean) {
      this.usingContext = context
      // this.recordState()
    },

    // updateHistory(conversationId: string, edit: Partial<Chat.History>) {
    //   const index = this.history.findIndex(item => item.conversationId === conversationId)
    //   if (index !== -1) {
    //     this.history[index] = { ...this.history[index], ...edit }
    //     this.recordState()
    //   }
    // },

    // async deleteHistory(index: number) {
    //   this.history.splice(index, 1)
    //   this.chat.splice(index, 1)

    //   if (this.history.length === 0) {
    //     this.active = null
    //     this.reloadRoute()
    //     return
    //   }

    //   if (index > 0 && index <= this.history.length) {
    //     const uuid = this.history[index - 1].conversationId
    //     this.active = uuid
    //     this.reloadRoute(uuid)
    //     return
    //   }

    //   if (index === 0) {
    //     if (this.history.length > 0) {
    //       const uuid = this.history[0].conversationId
    //       this.active = uuid
    //       this.reloadRoute(uuid)
    //     }
    //   }

    //   if (index > this.history.length) {
    //     const uuid = this.history[this.history.length - 1].conversationId
    //     this.active = uuid
    //     this.reloadRoute(uuid)
    //   }
    // },

    

    // getChatByUuidAndIndex(uuid: number, index: number) {
    //   if (!uuid || uuid === 0) {
    //     if (this.chat.length)
    //       return this.chat[0].data[index]
    //     return null
    //   }
    //   const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
    //   if (chatIndex !== -1)
    //     return this.chat[chatIndex].data[index]
    //   return null
    // },

    // addChatByUuid(conversationId: string, chat: Chat.Chat) {
    //   if (!conversationId) {
    //     if (this.history.length === 0) {
    //       const uuid = Date.now()
    //       // this.history.push({ conversationId, name: chat.text, isEdit: false })
    //       this.chat.push({ uuid, data: [chat] })
    //       this.active = conversationId
    //       this.recordState()
    //     }
    //     else {
    //       this.chat[0].data.push(chat)
    //       if (this.history[0].name === 'New Chat')
    //         this.history[0].name = chat.text
    //       this.recordState()
    //     }
    //   }

    //   const index = this.chat.findIndex(item => item.conversationId === conversationId)
    //   if (index !== -1) {
    //     this.chat[index].data.push(chat)
    //     if (this.history[index].name === 'New Chat')
    //       this.history[index].name = chat.text
    //     this.recordState()
    //   }
    // },

    // updateChatByUuid(uuid: number, index: number, chat: Chat.Chat) {
    //   if (!uuid || uuid === 0) {
    //     if (this.chat.length) {
    //       this.chat[0].data[index] = chat
    //       this.recordState()
    //     }
    //     return
    //   }

    //   const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
    //   if (chatIndex !== -1) {
    //     this.chat[chatIndex].data[index] = chat
    //     this.recordState()
    //   }
    // },

    // updateChatSomeByUuid(uuid: number, index: number, chat: Partial<Chat.Chat>) {
    //   if (!uuid || uuid === 0) {
    //     if (this.chat.length) {
    //       this.chat[0].data[index] = { ...this.chat[0].data[index], ...chat }
    //       this.recordState()
    //     }
    //     return
    //   }

    //   const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
    //   if (chatIndex !== -1) {
    //     this.chat[chatIndex].data[index] = { ...this.chat[chatIndex].data[index], ...chat }
    //     this.recordState()
    //   }
    // },

    // deleteChatByUuid(uuid: number, index: number) {
    //   if (!uuid || uuid === 0) {
    //     if (this.chat.length) {
    //       this.chat[0].data.splice(index, 1)
    //       this.recordState()
    //     }
    //     return
    //   }

    //   const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
    //   if (chatIndex !== -1) {
    //     this.chat[chatIndex].data.splice(index, 1)
    //     this.recordState()
    //   }
    // },

    // clearChatByUuid(uuid: number) {
    //   if (!uuid || uuid === 0) {
    //     if (this.chat.length) {
    //       this.chat[0].data = []
    //       this.recordState()
    //     }
    //     return
    //   }

    //   const index = this.chat.findIndex(item => item.uuid === uuid)
    //   if (index !== -1) {
    //     this.chat[index].data = []
    //     this.recordState()
    //   }
    // },

    async reloadRoute(conversationId?: string) {
      // this.recordState()
      await router.replace({ name: 'Chat', params: { conversationId } })
    },

    recordState() {
      setLocalState(this.$state)
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChatStore as any, import.meta.hot))
}
