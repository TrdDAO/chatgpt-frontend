import lazyPlugin from 'vue3-lazy';
import { type App } from 'vue';

const setupLazy = (app:App) => {
	app.use(lazyPlugin, {
		loading: new URL('@/assets/images/image-loading.gif', import.meta.url).href, // 图片加载时默认图片
		// error: require('@/assets/images/error.png')// 图片加载失败时默认图片
	})
}

export default setupLazy