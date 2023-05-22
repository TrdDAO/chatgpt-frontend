import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useMessage } from 'naive-ui'
import { t } from '@/locales';
import { useChatStore } from '@/store';
import { editHistoryEnabled } from '@/service/chat/index';

export function useUsingContext() {
  const route = useRoute();
  const ms = useMessage();
  const chatStore = useChatStore();
  const { conversationId } = route.params as { conversationId: string };
  const usingContext = computed<boolean>(() =>{
    const currentChatHistory = chatStore.getChatHistoryByCurrentActive;
    return currentChatHistory ? currentChatHistory.sendHistory : chatStore.sendHistory
  } );

  function toggleUsingContext() {
    if(!conversationId) {
      chatStore.setUsingContext(!usingContext.value);
      return
    }
    editHistoryEnabled(conversationId, {
      enabled: !usingContext.value
    }).then(() => {
      chatStore.setUsingContext(!usingContext.value);
      chatStore.updateHistory(conversationId, { sendHistory: !usingContext.value});
      if (usingContext.value) {
        ms.warning(t('chat.turnOnContext'));
      } else {
        ms.success(t('chat.turnOffContext'));
      }
    }).finally(() => {
      chatStore.updateHistory(conversationId, { isLoading: false })
    })
    
  }

  return {
    usingContext,
    toggleUsingContext,
  }
}
