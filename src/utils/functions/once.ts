export const once = (fn:()=> void) => {
	let called = false;
	return function(...args:any){
		if(!called) {
			called = true;
			fn.apply(this, args)
		}
	}
}