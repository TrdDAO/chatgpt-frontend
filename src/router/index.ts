import {defineComponent, h, type App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStoreWithout } from '@/store'
import ChatLayout from '@/views/chat/index.vue'

const routes: RouteRecordRaw[] = [
	{
		path: '/',
    name: 'Root',
    component: ChatLayout,
    redirect: '/chat',
    children: [
			{
				path: '/chat/:conversationId?',
        name: 'Chat',
        component: () => import('@/views/chat/components/Main/index.vue'),
			}
		],
	},
	{
		path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
	},
  {
    path: '/404',
    name: '404',
    component: () => import('@/components/404/index.vue'),
  },

  {
    path: '/500',
    name: '500',
    component: () => import('@/components/500/index.vue'),
  },

  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'notFound',
  //   redirect: '/404',
  // },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

router.beforeEach(async (to, from, next) => {
	const authStore = useAuthStoreWithout()
	
	// if (!authStore.session) {
	// 	try {
	// 		const data = await authStore.getSession()
	// 		if (String(data.auth) === 'false' && authStore.token)
	// 			// authStore.removeToken()
	// 		if (to.path === '/500')
	// 			next({ name: 'Root' })
	// 		else
	// 			next()
	// 	}
	// 	catch (error) {
	// 		if (to.path !== '/500')
	// 			next({ name: '500' })
	// 		else
	// 			next()
	// 	}
	// } else {
	// 	next()
	// }
	if(!authStore.token) {
		// to.path === '/login'
		// next({ name: '500' })
		next()
	} else {
		next()
	}
})


export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}