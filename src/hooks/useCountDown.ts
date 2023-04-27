import { computed, ref, watch } from 'vue'
import dayjs from 'dayjs'

/**
 * 
 * @param time 
 * @param options 
 * @returns {}
 */
interface Options {
	format?:string;
	beforeClearCallback?:Function;
	afterClearCallback?:Function;
	onCounting?:Function;
}

export const useCountDown = (time:number = 0, {
	format,
	beforeClearCallback,
	afterClearCallback,
	onCounting,
}: Options) => {
	const countDownTime = ref<number>(time)
	const isCounting = ref<boolean>(false)
	const timerFn = ref<NodeJS.Timer | null | number>(null);

	const resetTime = (newTime:number) => {
		time = newTime;
	}

	const startTimer = () => {
		countDownTime.value = time;
		timerFn.value = setInterval(() => {
			isCounting.value = true
			if (time <=0 ) {
				beforeClearCallback && beforeClearCallback();
				const num = clearTimer();
				afterClearCallback && afterClearCallback();
				return num
			}
			time = time - 1;
			countDownTime.value = time
			onCounting && onCounting(time);
		}, 1000)
	}

	const clearTimer = () => {
		isCounting.value = false;
		timerFn && timerFn.value && clearInterval(timerFn.value)
	}

	const countDownString = computed(() => {
		if(format){
			return dayjs(countDownTime.value*1000 ).format(format)
		} else {
			return countDownTime;
		}
	})

	return {
		startTimer,
		resetTime,
		clearTimer,
		countDownString,
		isCounting,
	}
}