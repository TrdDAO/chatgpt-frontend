<template>
	<div class="h-full bg-login-background">
		<div :class=getMobileNameClass>{{appName}}</div>
		<div :class="getMobileContainer">
			<Login/>
		</div>
		<Particles
			id="tsparticles"
			:particlesInit="particlesInit"
			:options="options"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import Login from '@/components/Login/index.vue'
import { loadFull } from "tsparticles";
import { type Engine } from 'tsparticles-engine';

const { isMobile } = useBasicLayout()
const appName = ref(import.meta.env.VITE_APP_NAME)

const getMobileNameClass = computed(() => {
	const common = ['fixed', 'text-white', 'font-medium', 'text-4xl', 'tracking-normal']
	if (isMobile.value)
		return [...common, 'top-5', 'left-5']
	return [...common, 'top-20', 'left-20', ]
})

const getMobileContainer = computed(() => {
	const common = ['fixed','top-1/2', 'left-1/2', 'p-10', 'border', 'shadow-xl', 'rounded', '-translate-x-1/2', '-translate-y-1/2', 'bg-white', 'min-w-[300px]', 'dark:border-transparent','dark:bg-[#24272e]']
	if (isMobile.value)
		return [...common, 'w-full']
	return [...common, 'w-2/12']
})

const particlesInit = async (engine:Engine) => {
	await loadFull(engine)
}

const options = reactive({
	background: {
		color: {
			value: '#000'
		}
	},
	fpsLimit: 120,
	interactivity: {
		detectsOn: 'window',
		resize: true,
		events: {
			onClick: {
				enable: false,
				mode: 'push'
			},
			onHover: {
				enable: true,
				mode: 'repulse'
			},
			resize: true
		},
		modes: {
			bubble: {
				distance: 400,
				duration: 2,
				opacity: 0.8,
				size: 40,
				speed: 3
			},
			push: {
				quantity: 4
			},
			repulse: {
				distance: 200,
				duration: 0.4
			}
		}
	},
	particles: {
		shape: {
			type: 'char', //"circle","edge","triangle", "polygon","star", 'image'
			character: {
				value: ['0', '1'],
				font: 24,
				weight: 400
			},
		},
		color: {
			value: '#18a058',
			animation: {
				enable: false,
				speed: 1
			},
		},
		// links: {
		// 	color: '#ffffff',
		// 	distance: 150,
		// 	enable: true,
		// 	opacity: 0.5,
		// 	width: 1,
		// 	blink: true
		// },
		// 撞击
		collisions: {
			enable: false
		},
		// 移动效果
		move: {
			direction: 'none',
			enable: true,
			outMode: 'bounce',
			random: false,
			speed: 2,
			straight: true,
		},
		number: {
			// density: {
			// 	enable: true,
			// 	value_area: 10
			// },
			value: isMobile.value ? 100 :400 // 个数
		},
		opacity: {
			value: 0.7
		},
		size: {
			animation: {
				enable: true,
				speed: 1
			},
			random: {
				enable: true,
			},
			value: 24 // 大小
		}
	},
	detectRetina: true,
})
</script>

<style>
#tsparticles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000000;
  z-index: -10;
}
</style>