type CallbackFunc<T extends unknown[]> = (...args: T) => void

export function throttle<T extends unknown[]>(
  func: CallbackFunc<T>,
  delay: number,
): (...args: T) => void {
	let preTime = Date.now()
  return (...args: T) => {
		const nowTime = Date.now();
		if(nowTime - preTime <= delay) return
		preTime = nowTime;
		setTimeout(()=>{
			func(...args);
		}, delay)
  }
}
