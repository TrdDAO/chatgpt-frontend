<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { NSpin, NProgress } from 'naive-ui'
// import { fetchChatConfig } from '@/api'
import pkg from '@/../package.json'
import { useAuthStore } from '@/store'

interface ConfigState {
  timeoutMs?: number
  reverseProxy?: string
  apiModel?: string
  socksProxy?: string
  httpsProxy?: string
  balance?: string
}

const authStore = useAuthStore()

const loading = ref(false)

const config = ref<ConfigState>()

const model = computed(() => authStore.apiModel)

const isChatGPTAPI = computed<boolean>(() => !!authStore.isChatGPTAPI)

async function fetchConfig() {
  try {
    loading.value = true
    //await fetchChatConfig<ConfigState>()
    const data = {}
    config.value = data
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchConfig()
})
</script>

<template>
  <NSpin :show="loading">
    <div class="p-4 space-y-4">
      <h2 class="text-xl font-bold">
        Version - {{ pkg.version }}
      </h2>
      <p>{{ $t("setting.model") }}：{{ model ?? '-' }}</p>
      <div class="flex">
        <span class="whitespace-nowrap">{{ $t("setting.balance") }}：</span>
        <NProgress
          type="line"
          status="success"
          :show-indicator="false"
          :percentage="0"
          :height="24"
          :border-radius="4"
        >
          <span>0 / 无限量</span>
        </NProgress>
      </div>
      <p v-if="!isChatGPTAPI">
        {{ $t("setting.reverseProxy") }}：{{ config?.reverseProxy ?? '-' }}
      </p>
      <!-- <p>{{ $t("setting.timeout") }}：{{ config?.timeoutMs ?? '-' }}</p> -->
      <!-- <p>{{ $t("setting.socks") }}：{{ config?.socksProxy ?? '-' }}</p>
      <p>{{ $t("setting.httpsProxy") }}：{{ config?.httpsProxy ?? '-' }}</p> -->
    </div>
  </NSpin>
</template>
