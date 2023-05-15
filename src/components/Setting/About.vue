<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { NSpin, NProgress } from 'naive-ui'
// import { fetchChatConfig } from '@/api'
import pkg from '@/../package.json'
import { useAuthStore, useUserStore } from '@/store';
import dayjs from 'dayjs';

interface ConfigState {
  timeoutMs?: number
  reverseProxy?: string
  apiModel?: string
  socksProxy?: string
  httpsProxy?: string
  balance?: string
}
const userStore = useUserStore();

const tokenUsages = computed(() => {
  return userStore.tokenUsagesGetter
});

const isPlus = computed(() => {
  return userStore.availableEquities.find((item) => {
    return item.limitation.chatModels.includes('GPT4')
  }) ? true : false
})

const equities = computed(() => {
  return userStore.availableEquities
});

const authStore = useAuthStore()

const loading = ref(false)

const config = ref<ConfigState>()

const model = computed(() => equities.value.map(item => item['limitation.chatModels']).join('、'))

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
      <div v-for="item in equities">
        <div class="whitespace-nowrap">
          <span>{{ item.equityName }}</span>
        </div>
        <div class="whitespace-nowrap">
          <span>{{ $t("setting.expiresTime") }}：</span>
          <span>{{ dayjs(item.expiresTime).format('YYYY-MM-DD') }}</span>
        </div>
        <div class="flex" v-if="item['limitation.maxTokensPerRequest']">
          <span class="whitespace-nowrap">{{ $t("setting.perRequest") }}：</span>
          <span>{{ item['limitation.maxTokensPerRequest'] }}</span>
        </div>
        <div class="flex" v-if="item['limitation.maxTokensPerDay']">
          <span class="whitespace-nowrap">{{ $t("setting.dayUsage") }}(GPT3_5)：</span>
          <NProgress
            type="line"
            status="success"
            :percentage="Number(((tokenUsages.GPT3_5.dayUsage * 100)/(item['limitation.maxTokensPerDay'])).toFixed(2))"
            :height="24"
            :border-radius="4"
          >
            {{ tokenUsages.GPT3_5.dayUsage }} / {{item['limitation.maxTokensPerDay']}}
          </NProgress>
        </div>
        <div class="flex" v-if="item['limitation.maxTokensPerMonth']">
          <span class="whitespace-nowrap">{{ $t("setting.monthUsage") }}(GPT3_5)：</span>
          <NProgress
            type="line"
            status="success"
            :percentage="Number(((tokenUsages.GPT3_5.monthUsage * 100)/(item['limitation.maxTokensPerMonth'])).toFixed(2))"
            :height="24"
            :border-radius="4"
          >
            {{ tokenUsages.GPT3_5.monthUsage }} / {{item['limitation.maxTokensPerMonth']}}
          </NProgress>
        </div>
        <div class="flex" v-if="isPlus && item['limitation.maxTokensPerDay']">
          <span class="whitespace-nowrap">{{ $t("setting.dayUsage") }}(GPT4)：</span>
          <NProgress
            type="line"
            status="success"
            :percentage="Number(((tokenUsages.GPT4.dayUsage * 100)/(item['limitation.maxTokensPerDay'])).toFixed(2))"
            :height="24"
            :border-radius="4"
          >
            {{ tokenUsages.GPT4.dayUsage }} / {{item['limitation.maxTokensPerDay']}}
          </NProgress>
        </div>
        <div class="flex" v-if="isPlus && item['limitation.maxTokensPerMonth']">
          <span class="whitespace-nowrap">{{ $t("setting.monthUsage") }}(GPT4)：</span>
          <NProgress
            type="line"
            status="success"
            :percentage="Number(((tokenUsages.GPT4.monthUsage * 100)/(item['limitation.maxTokensPerMonth'])).toFixed(2))"
            :height="24"
            :border-radius="4"
          >
            {{ tokenUsages.GPT4.monthUsage }} / {{item['limitation.maxTokensPerMonth']}}
          </NProgress>
        </div>
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
