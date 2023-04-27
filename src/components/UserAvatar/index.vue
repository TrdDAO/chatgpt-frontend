<script setup lang='ts'>
import { computed } from 'vue'
import { NAvatar } from 'naive-ui'
import { useUserStore } from '@/store'
import defaultAvatar from '@/assets/images/avatar.jpg'
import { isType } from '@/utils/isType'

const userStore = useUserStore()

userStore.getUserInfo();
const userInfo = computed(() => userStore.infoGetter);
const profile = computed(() => userStore.profileGetter);
</script>

<template>
  <div class="flex items-center overflow-hidden">
    <div class="w-10 h-10 overflow-hidden rounded-full shrink-0">
      <template v-if="isType(profile.avatarUrl, 'string')">
        <NAvatar
          size="large"
          round
          :src="profile.avatarUrl"
          :fallback-src="defaultAvatar"
        />
      </template>
      <template v-else>
        <NAvatar size="large" round :src="defaultAvatar" />
      </template>
    </div>
    <div class="flex-1 min-w-0 ml-2">
      <h2 class="overflow-hidden font-bold text-md text-ellipsis whitespace-nowrap">
        {{ userInfo.username ?? 'vistor' }}
      </h2>
      <p class="overflow-hidden text-xs text-gray-500 text-ellipsis whitespace-nowrap">
        <span
          v-if="isType(profile.description, 'string') && profile.description !== ''"
          v-html="profile.description"
        />
      </p>
    </div>
  </div>
</template>
