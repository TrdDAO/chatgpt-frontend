import { createApp } from 'vue'
import App from './App.vue'
import { setupAssets, setupScrollbarStyle, setupWatchError } from './plugins'
import { setupStore } from './store'
import { setupRouter } from './router'
import { setupI18n } from './locales'

async function bootstrap() {
	const app = createApp(App)

	setupAssets()

  setupScrollbarStyle()

	setupWatchError()

	setupStore(app)

	setupRouter(app)

	setupI18n(app)

	app.mount('#app')
}
bootstrap()