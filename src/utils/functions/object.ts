// 添加默认值，没有直接报错
const required = (name:string):any => {
	throw new Error(`This function requires this parameter: ${name}`)
}

/**
 * 获取对象属性
 * @param object 解析的对象
 * @param path 支持a.b.c或者['a', 'b', 'c']
 * @param defalut 
 */
export const get = (
	object=required('object') as {[objKey:string]: any},
	path=required('path') as string | string[],
	defalut?:string
):any => {
	const parts = typeof path === 'object' ? path : path.split(".");
	const key = parts.shift() as string;
	if(typeof object[key] !== 'undefined') {
		return parts.length > 0 ? get(object[key], parts.join("."), defalut) : object[key];
	}
	return defalut;
}