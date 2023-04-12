/**
 * Promise + 防抖
 * 注意：Promise.race 状态跟随第一个 Promise 状态变化而变化，但是其他的 Promise 还是会继续执行
 * @param {!function} fn
 * @param {?number} wait - 防抖时间最好设置上，没有的话服务器返回太快还是会请求次数过多
 * @param {?number} options.maxWait - 超时
 * @param {?number} options.immediate - 先立即执行一次，不用等 wait 时间之后
 */
interface Options {
	maxWait?:number;
	immediate?:boolean;
}
export const debouncePromise = (fn:Function, wait?:number, options?:Options):Function => {
	let prePromiseReject: any;
	let timeout: any;
	return function(...args: any){
		const res = new Promise((resolve, reject) => {
			// 第一种情况：用缓存的Promise，促使整个 Promise.race 为 rejected状态
			if(prePromiseReject) {
				prePromiseReject('too many requests, last request has been rejected, please wait the request response...');
			}
			// 第二种情况：延迟器还在，清除延迟器重新赋值
			if(timeout){
				clearTimeout(timeout);
			}
			const callNow = options?.immediate && !timeout;
			if(callNow) {
				fn.apply(this, args).then((res:any) => {
					resolve(res);
				}).catch((e:any) => {
					reject(e);
				}).finally(() => {
					prePromiseReject = null;
				});
			}
			timeout = setTimeout(() => {
				fn.apply(this, args).then((res:any) => {
					resolve(res);
				}).catch((e:any) => {
					reject(e);
				}).finally(() => {
					prePromiseReject = null;
					timeout = null;
				});
			}, wait);
		})
		// 缓存的 Promise 用于控制重复请求
		const fakePromise = new Promise((resolve, reject) => {
			prePromiseReject = reject;
			options?.maxWait && setTimeout(() => {
				reject(new Error('request timeout'));
			}, options.maxWait);
		});
		return Promise.race([res, fakePromise])
	}
}