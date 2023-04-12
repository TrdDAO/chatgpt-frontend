import type { Ref } from 'vue'
import { nextTick, ref } from 'vue'
import { throttle } from '@/utils/functions/throttle'

type ScrollElement = HTMLDivElement | null

interface ScrollReturn {
  scrollRef: Ref<ScrollElement>
  scrollToBottom: () => Promise<void>
  scrollToTop: () => Promise<void>
  scrollToBottomIfAtBottom: () => Promise<void>
  onBottom: (fn:()=>void)=>void
  onTop: (fn:()=>void)=>void
}

export function useScroll(top=200, bottom=100): ScrollReturn {
  const scrollRef = ref<ScrollElement>(null)

  const scrollToBottom = async () => {
    await nextTick()
    if (scrollRef.value)
      scrollRef.value.scrollTop = scrollRef.value.scrollHeight - scrollRef.value.clientHeight
  }

  const scrollToTop = async () => {
    await nextTick()
    if (scrollRef.value)
      scrollRef.value.scrollTop = 0
  }

  const scrollToBottomIfAtBottom = async () => {
    await nextTick()
    if (scrollRef.value) {
      const threshold = bottom // 阈值，表示滚动条到底部的距离阈值
      const distanceToBottom = scrollRef.value.scrollHeight - scrollRef.value.scrollTop - scrollRef.value.clientHeight
      if (distanceToBottom <= threshold)
        scrollRef.value.scrollTop = scrollRef.value.scrollHeight - scrollRef.value.clientHeight
    }
  }

  // 达底触发
  const onBottom = (fn:()=>void) => {
    return throttle((e:Event) => {
      if (scrollRef.value) {
        const threshold = bottom
        const distanceToBottom = scrollRef.value.scrollHeight - scrollRef.value.scrollTop - scrollRef.value.clientHeight
        if (distanceToBottom <= threshold)
          fn && fn()
      }
    }, 600) 
  }

  // 达顶触发
  const onTop = (fn:()=>void) => {
    return throttle((e:Event) => {
      if (scrollRef.value) {
        const threshold = top
        const distanceToTop = scrollRef.value.scrollTop
        if (distanceToTop <= threshold)
          fn && fn()
      }
    }, 600)
  }

  return {
    scrollRef,
    scrollToBottom,
    scrollToTop,
    scrollToBottomIfAtBottom,
    onBottom,
    onTop,
  }
}