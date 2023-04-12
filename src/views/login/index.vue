<template>
	<div class="h-full bg-login-background">
		<div :class=getMobileNameClass>{{appName}}</div>>
		<div :class="getMobileContainer">
			<Login>
			
			</Login>
		</div>
		
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import Login from '@/components/Login/index.vue'

const { isMobile } = useBasicLayout()
const appName = ref(import.meta.env.VITE_APP_NAME)

const getMobileNameClass = computed(() => {
	const common = ['fixed', 'text-white', 'font-medium', 'text-4xl', 'tracking-normal']
	if (isMobile.value)
		return [...common, 'top-5', 'left-5']
	return [...common, 'top-20', 'left-20', ]
})

const getMobileContainer = computed(() => {
	const common = ['fixed','top-1/2', 'left-1/2', 'p-10', 'border', 'shadow-xl', 'rounded', '-translate-x-1/2', '-translate-y-1/2', 'bg-white']
	if (isMobile.value)
		return [...common, 'w-full']
	return [...common, 'w-2/12']
})
</script>