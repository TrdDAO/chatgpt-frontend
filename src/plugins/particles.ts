import Particles from "particles.vue3";
import type { App } from 'vue';

const setUpParticles = (app:App) => {
	app.use(Particles,{})
}

export default setUpParticles