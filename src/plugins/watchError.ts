const setupWatchError = () => {
	window.onerror = function(e) {
		console.log('watch:', e)
	}
}

export default setupWatchError