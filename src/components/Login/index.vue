<template>
	<NTabs size="large" :value="tabType" animated @update:value="(val:string) => tabType=val">
		<NTabPane name="phone" tab="验证码登录">
			<NForm
				ref="phoneRef"
				:model="phoneModel"
				:rules="{
					phoneNumber: [
						{key: 'phoneNumber', required: true, message: '请输入手机号'},
						{key: 'phoneNumber', validator: phoneNumberValidator},
					],
					authCode: [{required: true, message: '请输入验证码'}]
				}"
				:show-feedback="false"
				:show-require-mark="false"
				size="large"
			>
				<NFormItem label="手机号" path="phoneNumber" class="mb-4">
					<NInputGroup>
						<NSelect
							:style="{ width: '120px' }"
							v-model:value="phoneModel.phoneArea"
							:options="[{label: '中国 +86', value:'86'}]"
						/>
						<NInput placeholder="手机号" v-model:value="phoneModel.phoneNumber"/>
					</NInputGroup>
				</NFormItem>
				<NFormItem label="验证码" path="authCode">
					<NInputGroup>
						<NInput placeholder="请输入6位短信验证码" v-model:value="phoneModel.authCode"/>
						<NButton @click="handleSendCode('phone')" style="width: 111px">{{ isCounting ? countDownString: '获取验证码'}}</NButton>
					</NInputGroup>
				</NFormItem>
				<NFormItem>
					<NButton block type="primary" @click="handleLogin" :disabled="loding">登录</NButton>
				</NFormItem>
			</NForm>
		</NTabPane>

		<NTabPane name="email" tab="邮箱登录">
			<NForm
				ref="emailRef"
				:model="emailModel"
				:rules="{
					emailAddress: [
						{key: 'emailAddress', required: true,  message: '请输入邮箱'},
						{key: 'emailAddress', validator: emailAddressValidator},
					],
					authCode: [{required: true, message: '请输入验证码'}]
				}"
				:show-feedback="false"
				:show-require-mark="false"
				size="large"
			>
				<NFormItem label="邮箱" path="emailAddress" class="mb-4">
					<NInput placeholder="邮箱" v-model:value="emailModel.emailAddress"/>
				</NFormItem>
				<NFormItem label="验证码" path="authCode">
					<NInputGroup>
						<NInput placeholder="请输入6位邮箱证码"  v-model:value="emailModel.authCode"/>
						<NButton  @click="handleSendCode('email')" style="width: 111px">{{isCounting ? countDownString: '获取验证码'}}</NButton>
					</NInputGroup>
				</NFormItem>
				<NFormItem>
					<NButton block type="primary" :disabled="loding">登录</NButton>
				</NFormItem>
			</NForm>
		</NTabPane>
	</NTabs>
	
</template>

<script setup lang="ts">
import { useMessage, type FormInst, type FormItemRule } from 'naive-ui'
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/store'
import { useCountDown } from '@/hooks/useCountDown'
import { aythByPhone, aythByEmail, sendPhoneCode, sendEmailCode } from '@/service/auth'
import { useRouter } from 'vue-router'
import { t } from '@/locales';

const router = useRouter();
const authStore = useAuthStore();
const message = useMessage()
const tabType = ref<string>('phone');
const time = ref(60);
const { startTimer, resetTime, isCounting, countDownString } = useCountDown(time.value, {
	format: 's[s]',
	afterClearCallback:() => {
		resetTime(time.value);
	}
})
const phoneRef = ref<FormInst|null>(null)
const emailRef = ref<FormInst|null>(null)
const phoneModel = ref({
	phoneArea: '86',
	phoneNumber: '',
	authCode: '',
})
const emailModel = ref({
	emailAddress: '',
	authCode: '',
})
const loding = ref(false)

const phoneNumberValidator = (rule: FormItemRule, value: string) => {
	return /^1\d{10}$/.test(value)
}

const emailAddressValidator = (rule: FormItemRule, value: string) => {
	return /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value)
}

const handleSendCode = async(type:string) => {
	if(isCounting.value) return
	const formRef = tabType.value === 'phone' ? phoneRef.value : emailRef.value;
	const result = await formRef?.validate((errors) => {
		if (errors) {
			// console.error(errors)
		}
	},(rule) => {
		return rule?.key === 'phoneNumber' || rule?.key === 'emailAddress'
	});

	const requestFn = tabType.value === 'phone' ? sendPhoneCode : sendEmailCode;
	await requestFn(type === 'phone' ? {
		phoneArea: phoneModel.value.phoneArea,
		phoneNumber: phoneModel.value.phoneNumber} : {
			emailAddress: emailModel.value.emailAddress
		} as any).then(() => {
	}).catch((e) => {
		message.error(t('common.authCodeError'));
		return Promise.reject(e);
	})
	startTimer();
}
const handleLogin = async() => {
	const formRef = tabType.value === 'phone' ? phoneRef.value : emailRef.value;
	const result = await formRef?.validate();
	const requestFn = tabType.value === 'phone' ? aythByPhone : aythByEmail;
	loding.value = true;
	requestFn(tabType.value === 'phone' ? phoneModel.value : emailModel.value as any).then(async (res) => {
		authStore.setToken(res.token, res.expiresTime)
		await router.replace({name: 'Root'})
	}).finally(() => {
		loding.value = false;
	})
}
</script>