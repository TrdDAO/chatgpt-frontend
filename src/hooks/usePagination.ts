import { reactive, ref, nextTick, type Ref } from 'vue'
import type { Pagination } from '@/api/http'

interface Options {
	success?:( )=> void
	error?:() => void
}

export const usePagination = <T>(pageNumber:number, sizeNumber: number) => {
	const page = ref<number>(pageNumber);
	const size = ref<number>(sizeNumber);
	const data = ref([]) as Ref<T[]>;
	const loading = ref<boolean>(false);
	const noMore = ref<boolean>(false);

	// 首页 or 下一页
	const getPageData = (fn: () => Promise<Pagination<T>>, options?: Options) => {
		if(noMore.value || loading.value) return
		loading.value = true;
		fn().then((res) => {
			page.value +=1
			data.value = res.content
			noMore.value = res.content.length < sizeNumber ? true : false
			options && options.success && options?.success()
		}).catch((e:Error) => {
			console.error(e)
			options && options.error && options.error()
		}).finally(() => {
			loading.value = false
		})
	}

	// 上一页
	const getPrevData = (fn: () => Promise<Pagination<T>>) => {
		if(noMore.value || loading.value) return
		page.value -=1
		loading.value = true
		fn().then((res:any) => {
			data.value = res.content
		}).catch((e:Error) => {
			console.log(e)
		}).finally(() => {
			loading.value = false
		})
	}

	// 下拉刷新重置
	const resetPageData = (fn: () => Promise<Pagination<T>>, options?: Options) => {
		noMore.value = false
		page.value = pageNumber
		loading.value = true
		fn().then((res) => {
			page.value +=1
			data.value = res.content
			noMore.value = res.content.length < sizeNumber ? true : false
			options && options.success && options.success()
		}).catch((e:Error) => {
			console.log(e)
			options && options.error && options.error()
		}).finally(() => {
			loading.value = false
		})
	}

	// 上拉加载更多
	const loadMore = (fn: () => Promise<Pagination<T>>, options?: Options) => {
		if(noMore.value || loading.value) return
		loading.value = true
		fn().then((res) => {
			page.value +=1
			data.value = [...data.value, ...res.content]
			noMore.value = res.content.length < sizeNumber ? true : false
			options && options.success && options.success()
		}).catch((e:Error) => {
			console.log(e)
			options && options.error && options.error()
		}).finally(() => {
			loading.value = false
		})
	}

	return {
		page,
		size,
		loading,
		data,
		noMore,
		resetPageData,
		getPageData,
		getPrevData,
		loadMore,
	}
}