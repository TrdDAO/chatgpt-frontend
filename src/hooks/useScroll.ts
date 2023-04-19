import type { Ref } from 'vue'
import { nextTick, ref } from 'vue'
import { throttle } from '@/utils/functions/throttle'

interface ScrollConfig {
  top?: number;
  bottom?: number;
  topTimeout?: number;
  bottomTimeout?: number;
}

type ScrollElement = HTMLDivElement | null

interface ScrollReturn {
  scrollRef: Ref<ScrollElement>
  scrollToBottom: () => Promise<void>
  scrollToTop: () => Promise<void>
  scrollToBottomIfAtBottom: () => Promise<void>
  onBottom: (fn:()=>void)=>void
  onTop: (fn:()=>void)=>void
}

export function useScroll(config?: ScrollConfig): ScrollReturn {
  const scrollRef = ref<ScrollElement>(null)
  const options = Object.assign({
    top: 0,
    bottom: 0,
    topTimeout: 600,
    bottomTimeout: 600,
  }, config)

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
      const threshold = options.bottom; // 阈值，表示滚动条到底部的距离阈值
      const distanceToBottom = scrollRef.value.scrollHeight - scrollRef.value.scrollTop - scrollRef.value.clientHeight
      if (distanceToBottom <= threshold)
        scrollRef.value.scrollTop = scrollRef.value.scrollHeight - scrollRef.value.clientHeight
    }
  }

  // 达底触发
  const onBottom = (fn:()=>void) => {
    return throttle((e:Event) => {
      if (scrollRef.value) {
        const threshold = options.bottom;
        const distanceToBottom = scrollRef.value.scrollHeight - scrollRef.value.scrollTop - scrollRef.value.clientHeight
        if (distanceToBottom <= threshold)
          fn && fn()
      }
    }, options.bottomTimeout)
  }

  // 达顶触发
  const onTop = (fn:()=>void) => {
    return throttle((e:Event) => {
      if (scrollRef.value) {
        const threshold = options.top;
        const distanceToTop = scrollRef.value.scrollTop;
        if (distanceToTop <= threshold)
          fn && fn()
      }
    }, options.topTimeout)
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