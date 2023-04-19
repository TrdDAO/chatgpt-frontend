export const curry = (fn:()=>void) => {
	return function curried(...args:any) {
		if(args.length >= fn.length) {
			return fn.apply(this, args);
		} else {
			return function(...args2:any) {
				return curried.apply(this, args.concat(args2));
			}
		}
	}
}