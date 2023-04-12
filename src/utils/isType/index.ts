/**
 * 获取数据类型
 * @param val
 * @returns
 */
export const getType = (val:any) => {
	return Object.prototype.toString.call(val).slice(8, -1);
}

/**
 * 判断类型
 * @param val 
 * @param type 
 * @returns true | false
 */
export const isType = (val:any, type:string) => {
	if(typeof type !== 'string') {
		return false;
	}
	return getType(val).toLowerCase() === type.toLowerCase();
}