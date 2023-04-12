<script setup lang='ts'>
import type { Ref } from 'vue'
import { computed, watch, onMounted, onUnmounted, ref, reactive, nextTick, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { NAutoComplete, NButton, NInput, useDialog, useMessage } from 'naive-ui'
import html2canvas from 'html2canvas'
import { Message } from '..'
import { useScroll } from '@/hooks/useScroll'
import { useCopyCode } from '../../hooks/useCopyCode'
import { useUsingContext } from '../../hooks/useUsingContext'
import HeaderComponent from '../Header/index.vue'
import { HoverButton, SvgIcon } from '@/components'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useChatStore, usePromptStore } from '@/store'
import { getConversationMessages, postConversationMessages } from '@/service/chat'
import { usePagination } from '@/hooks/usePagination'
import { throttle } from '@/utils/functions/throttle'
import { t } from '@/locales'

let controller = new AbortController()

const openLongReply = import.meta.env.VITE_GLOB_OPEN_LONG_REPLY === 'true'

const route = useRoute()
const dialog = useDialog()
const ms = useMessage()

const chatStore = useChatStore()

useCopyCode()

const { isMobile } = useBasicLayout()
const { scrollRef, scrollToBottom, scrollToBottomIfAtBottom, onTop } = useScroll()
const { usingContext, toggleUsingContext } = useUsingContext()
// 会话记录分页数据
const { page, size, data, loading, noMore, resetPageData, getPageData } = usePagination<Chat.Message>(0, 40)

const { conversationId } = route.params as { conversationId: string }

const prompt = ref<string>('')
const pending = ref<boolean>(false)
const inputRef = ref<Ref | null>(null)
const renderData = reactive({
  content: '',
  errorInfo: null,
  messageId: 'assistant-chat-last',
  role: 'ASSISTANT',
  status: 'Processing',
  time: +new Date(),
  loading: false,
})

const dataSources = computed(() => {
  // console.log('computed：', scrollRef.value)
  return chatStore.getMessagesByConversationId
})

// 添加PromptStore
const promptStore = usePromptStore()

// 使用storeToRefs，保证store修改后，联想部分能够重新渲染
const { promptList: promptTemplate } = storeToRefs<any>(promptStore)

onMounted(() => {
  if(!conversationId) return
  if(chatStore.chat.has(conversationId)) {
    scrollToBottom()
    return
  }
  // 查询列表数据
  resetPageData(() => {
    return getConversationMessages(conversationId, {page: page.value, size: size.value})
  }, {
    success: async() => {
      chatStore.addChatMessages(conversationId, data.value)
      await nextTick()
      scrollToBottom()
    }
  })
})

function handleSubmit() {
  onConversation()
}

// 发送消息
async function onConversation() {
  let message = prompt.value

  if (pending.value)
    return

  if (!message || message.trim() === '')
    return

  controller = new AbortController()

  chatStore.addChatMessages(conversationId, [{
    content: prompt.value,
    errorInfo: null,
    messageId: 'user-chat-last',
    role: 'USER',
    status: 'Processing',
    time: +new Date(),
    loading: false,
  }])

  scrollToBottom()

  pending.value = true

  let options: Chat.ConversationRequest = {}
  let assistantTime:number|null = null
  try {
    let lastText = ''
    const fetchChatAPIOnce = async () => {
      await postConversationMessages(conversationId, {
        data: {content: prompt.value},
        signal: controller.signal,
        onDownloadProgress: ({ event }) => {
          if(!assistantTime) {
            assistantTime = +new Date()
          }
          prompt.value = ''
          const xhr = event.target
          const { responseText } = xhr
          
          try {
            // 返回的 content 个数不固定
            const lines = responseText.replace(lastText, '').split('\n\n')
            // console.log(responseText.replace(lastText, ''))
            lastText = responseText
            let currentIndex = 0;

            function showNextChar() {
              const line = lines[currentIndex]
              const index = line.indexOf('content":"')
              if (index > -1) {
                const dataString = line.substring(index + 10, line.length - 2)
                // 内容处理
                renderData.content += dataString.replace(/\\n/g, '\n').replace('`', '\`');
                renderData.loading = true
              }
              currentIndex++;
              if (currentIndex < lines.length) {
                window.requestAnimationFrame(showNextChar);
              }
            }

            window.requestAnimationFrame(showNextChar);

            scrollToBottomIfAtBottom()
          } catch(error) {
            console.log(error)
          }
        }
      })
    }
    await fetchChatAPIOnce()
  } catch (error: any) {
    console.log(error, error?.message)
    // 数据完成
    if(!error){
      console.log(renderData.content)
      chatStore.addChatMessages(conversationId, [{
        content: renderData.content,
        errorInfo: null,
        messageId: 'assistant-chat-last',
        role: 'ASSISTANT',
        status: 'Processing',
        time: assistantTime || +new Date(),
        loading: false,
      }])
      // 删除临时渲染的节点
      renderData.content = '';
      renderData.loading = false
    }
    // if (error.message === 'canceled') {
    //   updateChatSome(
    //     +uuid,
    //     dataSources.value.length - 1,
    //     {
    //       loading: false,
    //     },
    //   )
    //   scrollToBottomIfAtBottom()
    //   return
    // }
    return
  } finally {
    pending.value = false
  }
}

async function onRegenerate(index: number) {
  if (pending.value)
    return

  controller = new AbortController()

  const { requestOptions } = dataSources.value[index]

  let message = requestOptions?.prompt ?? ''

  let options: Chat.ConversationRequest = {}

  if (requestOptions.options)
    options = { ...requestOptions.options }

  pending.value = true

  try {
    let lastText = ''
    const fetchChatAPIOnce = async () => {
      // await fetchChatAPIProcess<Chat.ConversationResponse>({
      //   prompt: message,
      //   options,
      //   signal: controller.signal,
      //   onDownloadProgress: ({ event }) => {
      //     const xhr = event.target
      //     const { responseText } = xhr
      //     // Always process the final line
      //     const lastIndex = responseText.lastIndexOf('\n', responseText.length - 2)
      //     let chunk = responseText
      //     if (lastIndex !== -1)
      //       chunk = responseText.substring(lastIndex)
      //     try {
      //       const data = JSON.parse(chunk)
      //       updateChat(
      //         +uuid,
      //         index,
      //         {
      //           dateTime: new Date().toLocaleString(),
      //           text: lastText + data.text ?? '',
      //           inversion: false,
      //           error: false,
      //           loading: false,
      //           conversationOptions: { conversationId: data.conversationId, parentMessageId: data.id },
      //           requestOptions: { prompt: message, ...options },
      //         },
      //       )

      //       if (openLongReply && data.detail.choices[0].finish_reason === 'length') {
      //         options.parentMessageId = data.id
      //         lastText = data.text
      //         message = ''
      //         return fetchChatAPIOnce()
      //       }
      //     }
      //     catch (error) {
      //       //
      //     }
      //   },
      // })
    }
    await fetchChatAPIOnce()
  }
  catch (error: any) {
    if (error.message === 'canceled') {
      // updateChatSome(
      //   +conversationId,
      //   index,
      //   {
      //     loading: false,
      //   },
      // )
      return
    }

    const errorMessage = error?.message ?? t('common.wrong')

    // updateChat(
    //   +conversationId,
    //   index,
    //   {
    //     dateTime: new Date().toLocaleString(),
    //     text: errorMessage,
    //     inversion: false,
    //     error: true,
    //     loading: false,
    //     conversationOptions: null,
    //     requestOptions: { prompt: message, ...options },
    //   },
    // )
  }
  finally {
    pending.value = false
  }
}

// 导出
function handleExport() {
  if (pending.value)
    return

  const d = dialog.warning({
    title: t('chat.exportImage'),
    content: t('chat.exportImageConfirm'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: async () => {
      try {
        d.loading = true
        const ele = document.getElementById('image-wrapper')
        const canvas = await html2canvas(ele as HTMLDivElement, {
          useCORS: true,
        })
        const imgUrl = canvas.toDataURL('image/png')
        const tempLink = document.createElement('a')
        tempLink.style.display = 'none'
        tempLink.href = imgUrl
        tempLink.setAttribute('download', 'chat-shot.png')
        if (typeof tempLink.download === 'undefined')
          tempLink.setAttribute('target', '_blank')

        document.body.appendChild(tempLink)
        tempLink.click()
        document.body.removeChild(tempLink)
        window.URL.revokeObjectURL(imgUrl)
        d.loading = false
        ms.success(t('chat.exportSuccess'))
        Promise.resolve()
      }
      catch (error: any) {
        ms.error(t('chat.exportFailed'))
      }
      finally {
        d.loading = false
      }
    },
  })
}

const handleScrollThrottle = onTop(() => {
  if(!conversationId) return
  // 查询列表数据
  getPageData(() => {
    return getConversationMessages(conversationId, {page: page.value, size: size.value})
  }, {
    success: async() => {
      chatStore.unShiftChatMessages(conversationId, data.value)
    }
  })
})

// 删除
function handleDelete(index: number) {
  if (pending.value)
    return

  dialog.warning({
    title: t('chat.deleteMessage'),
    content: t('chat.deleteMessageConfirm'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: () => {
      
    },
  })
}

function handleClear() {
  if (pending.value)
    return

  dialog.warning({
    title: t('chat.clearChat'),
    content: t('chat.clearChatConfirm'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: () => {
      
    },
  })
}

// 会车
function handleEnter(event: KeyboardEvent) {
  if (!isMobile.value) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  } else {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault()
      handleSubmit()
    }
  }
}

// 取消请求
function handleStop() {
  if (pending.value) {
    controller.abort()
    pending.value = false
  }
}

// 可优化部分
// 搜索选项计算，这里使用value作为索引项，所以当出现重复value时渲染异常(多项同时出现选中效果)
// 理想状态下其实应该是key作为索引项,但官方的renderOption会出现问题，所以就需要value反renderLabel实现
const searchOptions = computed(() => {
  if (prompt.value.startsWith('/')) {
    return promptTemplate.value.filter((item: { key: string }) => item.key.toLowerCase().includes(prompt.value.substring(1).toLowerCase())).map((obj: { value: any }) => {
      return {
        label: obj.value,
        value: obj.value,
      }
    })
  }
  else {
    return []
  }
})

// value反渲染key
const renderOption = (option: { label: string }) => {
  for (const i of promptTemplate.value) {
    if (i.value === option.label)
      return [i.key]
  }
  return []
}

const placeholder = computed(() => {
  if (isMobile.value)
    return t('chat.placeholderMobile')
  return t('chat.placeholder')
})

const buttonDisabled = computed(() => {
  return pending.value || !prompt.value || prompt.value.trim() === ''
})

const footerClass = computed(() => {
  let classes = ['p-4']
  if (isMobile.value)
    classes = ['sticky', 'left-0', 'bottom-0', 'right-0', 'p-2', 'pr-3', 'overflow-hidden']
  return classes
})

onMounted(() => {
  scrollToBottom()
  if (inputRef.value && !isMobile.value)
    inputRef.value?.focus()
})

onUnmounted(() => {
  if (pending.value)
    controller.abort()
})
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <HeaderComponent
      v-if="isMobile"
      :using-context="usingContext"
      @export="handleExport"
      @toggle-using-context="toggleUsingContext"
    />
    <main class="flex-1 overflow-hidden">
      <div
        id="scrollRef"
        ref="scrollRef"
        class="h-full overflow-hidden overflow-y-auto"
        @scroll="handleScrollThrottle"
      >
        <div
          id="image-wrapper"
          class="w-full max-w-screen-xl m-auto dark:bg-[#101014] flex flex-col"
          :class="[isMobile ? 'p-2' : 'p-4']"
        >
          <template v-if="!conversationId">
            <div class="flex flex-1 items-center justify-center mt-14 text-center text-neutral-300">
              <SvgIcon icon="ri:bubble-chart-fill" class="mr-2 text-3xl" />
              <span>{{ $t('chat.chooseConversation') }}</span>
            </div>
          </template>
          <template v-else>
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
              <template v-if="loading">
                <NSpin size="large" />
              </template>
              <Message
                v-for="(item, index) of dataSources"
                :key="index"
                :date-time="String(item.time)"
                :text="item.content"
                :inversion="item.role === 'USER' ? true : false"
                :error="item.errorInfo ? true : false"
                :loading="item.loading"
                @regenerate="onRegenerate(index)"
                @delete="handleDelete(index)"
              />
              <Message
                v-if="renderData.content"
                :key="'render'"
                :date-time="String(renderData.time)"
                :text="renderData.content"
                :inversion="renderData.role === 'USER' ? true : false"
                :error="renderData.errorInfo ? true : false"
                :loading="renderData.loading"
              />
              <div class="sticky bottom-0 left-0 flex justify-center">
                <NButton v-if="pending" type="warning" @click="handleStop">
                  <template #icon>
                    <SvgIcon icon="ri:stop-circle-line" />
                  </template>
                  Stop Responding
                </NButton>
              </div>
            </template>
          </template>
        </div>
      </div>
    </main>
    <footer :class="footerClass">
      <div class="w-full max-w-screen-xl m-auto">
        <div class="flex items-center justify-between space-x-2">
          <!-- <HoverButton @click="handleClear" tooltip="清空会话">
            <span class="text-xl text-[#4f555e] dark:text-white">
              <SvgIcon icon="ri:delete-bin-line" />
            </span>
          </HoverButton> -->
          <HoverButton v-if="!isMobile" @click="handleExport" tooltip="保存为图片">
            <span class="text-xl text-[#4f555e] dark:text-white">
              <SvgIcon icon="ri:download-2-line" />
            </span>
          </HoverButton>
          <!-- <HoverButton v-if="!isMobile" @click="toggleUsingContext" tooltip="携带记录">
            <span class="text-xl" :class="{ 'text-[#4b9e5f]': usingContext, 'text-[#a8071a]': !usingContext }">
              <SvgIcon icon="ri:chat-history-line" />
            </span>
          </HoverButton> -->
          <NAutoComplete v-model:value="prompt" :options="searchOptions" :render-label="renderOption">
            <template #default="{ handleInput, handleBlur, handleFocus }">
              <NInput
                ref="inputRef"
                v-model:value="prompt"
                type="textarea"
                :placeholder="placeholder"
                :autosize="{ minRows: 1, maxRows: isMobile ? 4 : 8 }"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
                @keypress="handleEnter"
              />
            </template>
          </NAutoComplete>
          <NButton type="primary" :disabled="buttonDisabled" @click="handleSubmit">
            <template #icon>
              <span class="dark:text-black">
                <SvgIcon icon="ri:send-plane-fill" />
              </span>
            </template>
          </NButton>
        </div>
      </div>
    </footer>
  </div>
</template>