import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useMessage } from 'naive-ui'
import { t } from '@/locales';
import { useChatStore, useUserStore } from '@/store';
import { editConversation, deleteConversation } from '@/service/chat/index';

export function useUsingContext() {
  const route = useRoute();
  const ms = useMessage();
  const chatStore = useChatStore();
  const userStore = useUserStore();
  const { conversationId } = route.params as { conversationId: string };
  const usingContext = computed<boolean>(() => chatStore.sendHistory);
  const equities = computed(() => {
    return userStore.availableEquities
  });
  const maxTokensPerRequest = computed(() => {
    const maxTokens = equities.value.map((item) => {
      return item.limitation.maxTokensPerRequest
    }) as number[]
    return Math.max(...maxTokens)
  })

  function toggleUsingContext() {
    const conversationData = chatStore.getHistory(conversationId);
    if(!conversationData) return
    console.log(conversationData)
    editConversation(conversationId, {
      name: conversationData.name,
      sendHistory: usingContext.value,
      model: conversationData.model,
      temperature: 0.7,
      topP: 1,
      maxTokens: maxTokensPerRequest.value
    }).then(() => {
      chatStore.setUsingContext(!usingContext.value);
      chatStore.updateHistory(conversationId, { sendHistory: usingContext.value});
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
