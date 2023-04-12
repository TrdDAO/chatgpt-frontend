<script setup lang='ts'>
import { computed, ref, onMounted } from 'vue'
import { SvgIcon } from '@/components'
import { useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { debounce } from '@/utils/functions/debounce'
import { throttle } from '@/utils/functions/throttle'
import { getConversations } from '@/service/chat'
import { usePagination } from '@/hooks/usePagination'
import { editConversation, deleteConversation } from '@/service/chat/index'

const { isMobile } = useBasicLayout()

const { page, size, data, loading, noMore, getPageData, loadMore } = usePagination<Chat.History>(0, 23);

const appStore = useAppStore()
const chatStore = useChatStore()

const scrollContainerRef = ref<HTMLDivElement|null>(null)

const dataSources = computed(() => {
  return chatStore.history
})

// 选中
async function handleSelect({ conversationId }: Chat.History) {
  if (isActive(conversationId))
    return

  // if (chatStore.active)
  //   chatStore.updateHistory(chatStore.active, { isEdit: false })
  await chatStore.setActive(conversationId)

  if (isMobile.value)
    appStore.setSiderCollapsed(true)
}

// 编辑
function handleEdit({ conversationId, }: Chat.History, isEdit: boolean, event?: MouseEvent) {
  event?.stopPropagation()
  chatStore.updateHistory(conversationId, { isEdit })
}

// 保存编辑
function handleSave({conversationId, name}: Chat.History, event?: MouseEvent) {
  event?.stopPropagation()
  chatStore.updateHistory(conversationId, {isLoading: true})
  editConversation(conversationId, {
    name,
		model: 'gpt-3.5-turbo',
		temperature: 0.7,
		topP: 1,
		maxTokens: 2000
  }).then(() => {
    chatStore.updateHistory(conversationId, { name, isEdit: false})
  }).finally(() => {
    chatStore.updateHistory(conversationId, { isLoading: false })
  })
}

// 取消
function handleCancel({conversationId, originName}: Chat.History, event?: MouseEvent) {
  event?.stopPropagation()
  chatStore.updateHistory(conversationId, {name: originName, isEdit: false})
}

// 删除
async function handleDelete({conversationId}: Chat.History, event?: MouseEvent | TouchEvent) {
  event?.stopPropagation()
  chatStore.updateHistory(conversationId, {isLoading: true})
  await deleteConversation(conversationId)
  chatStore.deleteHistory(conversationId)
  chatStore.setActive('')
  if (isMobile.value)
    appStore.setSiderCollapsed(true)
}

const handleDeleteDebounce = debounce(handleDelete, 600)

// 会车确认
function handleEnter(item: Chat.History, event: KeyboardEvent) {
  event?.stopPropagation()
  if (event.key === 'Enter')
    handleSave(item)
}

function handleScroll(e:Event) {
  if(noMore.value) return
  const clientHeight = scrollContainerRef.value?.clientHeight
  const target: EventTarget = e.target as EventTarget
  const { scrollHeight, scrollTop } = target as HTMLDivElement
  const distanceToBottom = scrollHeight - scrollTop - Number(clientHeight)
  if(distanceToBottom <= 100) {
    !loading.value && loadMore(() => {
      return getConversations({page: page.value, size: size.value}).then((res) => {
        res.content = res.content.map(item => {
          item.originName = item.name
          return item
        })
        return Promise.resolve(res)
      })
    }, {
      success: () => {
        chatStore.setHistory([...data.value])
      }
    })
  }
}

const handleScrollThrottle = throttle(handleScroll, 600)

function isActive(conversationId: string) {
  return chatStore.active === conversationId
}

onMounted(() => {
  // 查询列表数据
  getPageData(() => {
    return getConversations({page: page.value, size: size.value}).then((res) => {
      res.content = res.content.map(item => {
        item.originName = item.name;
        return item
      })
      return Promise.resolve(res)
    })
  }, {
    success: () => {
      chatStore.setHistory([...data.value])
    }
  })
})

</script>

<template>
  <div class="h-full" ref="scrollContainerRef">
    <NScrollbar class="px-4" trigger="none" @scroll="handleScrollThrottle">
      <div class="flex flex-col gap-2 text-sm">
        <template v-if="!dataSources.length">
          <template v-if="loading">
            <NSpin size="large" />
          </template>
          <template v-else>
            <div class="flex flex-col items-center mt-4 text-center text-neutral-300">
              <SvgIcon icon="ri:inbox-line" class="mb-2 text-3xl" />
              <span>{{ $t('common.noData') }}</span>
            </div>
          </template>
          
        </template>
        <template v-else>
          <div v-for="(item, index) of dataSources" :key="item.conversationId" class="mb-[10px]">
            <a
              class="relative flex items-center gap-3 px-3 py-3 break-all border rounded-md cursor-pointer hover:bg-neutral-100 group dark:border-neutral-800 dark:hover:bg-[#24272e]"
              :class="isActive(item.conversationId) && ['border-[#4b9e5f]', 'bg-neutral-100', 'text-[#4b9e5f]', 'dark:bg-[#24272e]', 'dark:border-[#4b9e5f]', 'pr-14']"
              @click="handleSelect(item)"
            >
              <span>
                <SvgIcon v-if="item.isLoading" icon="eos-icons:bubble-loading" />
                <SvgIcon v-else icon="ri:message-3-line" />
              </span>
              <div class="relative flex-1 overflow-hidden break-all text-ellipsis whitespace-nowrap">
                <NInput
                  v-if="item.isEdit"
                  :disabled="item.isLoading"
                  v-model:value="item.name" size="tiny"
                  @keypress="handleEnter(item, $event)"
                />
                <span v-else>{{ item.name }}</span>
              </div>
              <div v-if="isActive(item.conversationId)" class="absolute z-10 flex visible right-1">
                <template v-if="item.isEdit">
                  <button class="p-1" @click="handleSave(item, $event)">
                    <SvgIcon icon="ri:save-line" />
                  </button>
                  <button class="p-1" @click="handleCancel(item, $event)">
                    <SvgIcon icon="system-uicons:backward" />
                  </button>
                </template>
                <template v-else>
                  <button class="p-1">
                    <SvgIcon icon="ri:edit-line" @click="handleEdit(item, true, $event)" />
                  </button>
                  <NPopconfirm placement="bottom" @positive-click="handleDeleteDebounce(item, $event)">
                    <template #trigger>
                      <button class="p-1">
                        <SvgIcon icon="ri:delete-bin-line" />
                      </button>
                    </template>
                    {{ $t('chat.deleteHistoryConfirm') }}
                  </NPopconfirm>
                </template>
              </div>
            </a>
          </div>
          <template v-if="loading">
            <NSpin size="large" />
          </template>
        </template>
      </div>
    </NScrollbar>
  </div>
</template>
