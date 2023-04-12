import { computed } from 'vue'
import { createLocale, enUS, zhCN, zhTW } from 'naive-ui'
import i18n_enUS from '@/locales/en-US'
import i18n_zhCN from '@/locales/zh-CN'
import i18n_zhTW from '@/locales/zh-TW'
import { useAppStore } from '@/store'
import { setLocale } from '@/locales'

export function useLanguage() {
  const appStore = useAppStore()

  const language = computed(() => {
    switch (appStore.language) {
      case 'en-US':
        setLocale('en-US')
        return createLocale(i18n_enUS as any, enUS)
      case 'zh-CN':
        setLocale('zh-CN')
        return createLocale(i18n_zhCN as any, zhCN)
      case 'zh-TW':
        setLocale('zh-TW')
        return createLocale(i18n_zhTW as any, zhTW)
      default:
        setLocale('zh-CN')
        return createLocale(i18n_zhCN as any, zhCN)
    }
  })

  return { language }
}
