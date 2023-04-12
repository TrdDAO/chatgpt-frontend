<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NButton, NInput, NModal, useMessage } from 'naive-ui'
// import { fetchVerify } from '@/api'
import { useAuthStore } from '@/store'
import { useRouter } from 'vue-router'
import Icon401 from '@/assets/icons/401.vue'

interface Props {
  visible: boolean
}

const router = useRouter()

defineProps<Props>()

const authStore = useAuthStore()

const ms = useMessage()

const loading = ref(false)
const token = ref('')

const disabled = computed(() => !token.value.trim() || loading.value)

async function handleVerify() {
  const secretKey = token.value.trim()

  if (!secretKey)
    return

  try {
    loading.value = true
   //  await fetchVerify(secretKey)
    authStore.setToken(secretKey, 0)
    ms.success('success')
    window.location.reload()
  }
  catch (error: any) {
    ms.error(error.message ?? 'error')
    authStore.removeToken()
    token.value = ''
  }
  finally {
    loading.value = false
  }
}

function handlePress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleVerify()
  }
}

const handleLogin = () => {
  router.replace({ name: 'Login'})
}
</script>

<template>
  <NModal :show="visible" style="width: 90%; max-width: 640px">
    <div class="p-10 bg-white rounded dark:bg-slate-800">
      <div class="space-y-4">
        <header class="space-y-2">
          <h2 class="text-2xl font-bold text-center text-slate-800 dark:text-neutral-200">
            401
          </h2>
          <p class="text-base text-center text-slate-500 dark:text-slate-500">
            {{ $t('common.unauthorizedTips') }}
          </p>
          <Icon401 class="w-[200px] m-auto" />
        </header>
        <!-- <NInput v-model:value="token" type="password" placeholder="" @keypress="handlePress" />
        <NButton
          block
          type="primary"
          :disabled="disabled"
          :loading="loading"
          @click="handleVerify"
        >
          {{ $t('common.verify') }}
        </NButton> -->
        <NButton
          block
          type="primary"
          @click="handleLogin"
        >
          {{ $t('common.login') }}
        </NButton>
      </div>
    </div>
  </NModal>
</template>
