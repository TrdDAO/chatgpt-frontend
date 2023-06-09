<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import mila from 'markdown-it-link-attributes'
import hljs from 'highlight.js'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { t } from '@/locales'

interface Props {
  inversion?: boolean
  error?: boolean
  text?: string
  loading?: boolean
  asRawText?: boolean
}

const props = defineProps<Props>()

const { isMobile } = useBasicLayout()

const textRef = ref<HTMLElement>()

const mdi = new MarkdownIt({
  linkify: true,
  highlight(code, language) {
    const validLang = !!(language && hljs.getLanguage(language))
    if (validLang) {
      const lang = language ?? ''
      return highlightBlock(hljs.highlight(code, { language: lang }).value, lang)
    }
    return highlightBlock(hljs.highlightAuto(code).value, '')
  },
})

mdi.use(mila, { attrs: { target: '_blank', rel: 'noopener' } })
mdi.use(mdKatex, { blockClass: 'katexmath-block rounded-md p-[10px]', errorColor: ' #cc0000' })

const wrapClass = computed(() => {
  return [
    'text-wrap',
    'min-w-[20px]',
    'rounded-md',
    isMobile.value ? 'p-2' : 'px-3 py-2',
    props.inversion ? 'bg-[#d2f9d1]' : 'bg-[#f4f6f8]',
    props.inversion ? 'dark:bg-[#a1dc95]' : 'dark:bg-[#1e1e20]',
    props.inversion ? 'message-request' : 'message-reply',
    props.inversion ? '' : 'w-full',
    { 'text-red-500': props.error },
  ]
})

const text = computed(() => {
  const value = props.text ?? ''
  if (!props.asRawText)
    return mdi.render(value)
  return value
})

function highlightBlock(str: string, lang?: string) {
  return '<pre class="code-block-wrapper">'+
    '<div class="code-block-header">'+
      '<!-- language -->'+
      '<span class="code-block-header__lang">'+lang+'</span>'+
      '<!-- copy -->'+
      '<span class="code-block-header__copy">'+t("chat.copyCode")+'</span>'+
    '</div>'+
    '<code class="hljs code-block-body '+lang+'">'+str+'</code>'+
  '</pre>'
}

defineExpose({ textRef })
</script>

<template>
  <div class="text-black" :class="wrapClass">
    <div ref="textRef" class="leading-relaxed break-words">
      <!-- assistant -->
      <template v-if="!inversion" class="assistant">
        <!-- 预览 -->
        <div v-if="!asRawText" class="markdown-body inline-block w-full" v-html="text" />
        <!-- 原文本 -->
        <div v-else class="whitespace-pre-wrap inline-block w-full" v-text="text" />
        <!-- 光标闪烁 -->
        <template v-if="loading">
          <span class="dark:text-white w-[2px] h-[20px] inline-block animate-blink align-text-bottom" />
        </template>
      </template>
      <!-- user -->
      <div v-else class="whitespace-pre-wrap" v-text="text"/>
    </div>
  </div>
</template>

<style lang="less">
@import url(./style.less);
</style>
