<template>
<div>
	<!-- <NTabs size="large" :value="tabType" animated @update:value="(val:'login'|'regist') => tabType=val"> -->
		<!-- <NTabPane name="login" tab="登录"> -->
			<h2 class="text-3xl text-black dark:text-white text-center">{{ tabType === 'login' ? '登录' :'注册'}} </h2>
			<NForm
				ref="loginRef"
				:model="loginModel"
				:rules="{
					identity: [
						{key: 'identity', required: true, message: '请输入手机号'},
					],
					password: [{required: true, message: '请输入验证码'}]
				}"
				:show-feedback="false"
				:show-require-mark="false"
				size="large"
			>
				<!-- <NFormItem label="手机号" path="phoneNumber" class="mb-4">
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
				</NFormItem> -->
				<NFormItem label="账号" path="identity" class="mb-4">
					<NInput placeholder="请输入手机号 / 邮箱 / 用户名" v-model:value="loginModel.identity"/>
				</NFormItem>
				<NFormItem label="密码" path="password">
					<NInput placeholder="请输入密码" v-model:value="loginModel.password" type="password"/>
				</NFormItem>
				<NFormItem>
					<NButton block type="primary" @click="handleLogin" :disabled="loding" :loading="loding">登录</NButton>
				</NFormItem>
			</NForm>
		
		<!-- </NTabPane> -->
		<!-- <NTabPane name="regist" tab="邮箱注册">
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
					<NButton block type="primary" @click="handleLogin" :disabled="loding">注册</NButton>
				</NFormItem>
			</NForm>
		</NTabPane> -->
	<!-- </NTabs> -->
</div>
</template>

<script setup lang="ts">
import { useMessage, type FormInst, type FormItemRule } from 'naive-ui'
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/store'
import { useCountDown } from '@/hooks/useCountDown'
import { aythByPhone, aythByEmail, sendPhoneCode, sendEmailCode, authByPsd } from '@/service/auth'
import { useRouter } from 'vue-router'
import { t } from '@/locales';

const router = useRouter();
const authStore = useAuthStore();
const message = useMessage()
const tabType = ref<'login'|'regist'>('login');
const time = ref(60);
const { startTimer, resetTime, isCounting, countDownString } = useCountDown(time.value, {
	format: 's[s]',
	afterClearCallback:() => {
		resetTime(time.value);
	},
	onCounting:(num:number) => {
		// console.log(num)
	}
})
const loginRef = ref<FormInst|null>(null)
const emailRef = ref<FormInst|null>(null)
const loginModel = ref({
	identity: '',
	password: '',
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

// 发送验证码
const handleSendCode = async(type:string) => {
	if(isCounting.value) return
	const result = await emailRef.value?.validate((errors) => {
		if (errors) {
			// console.error(errors)
		}
	},(rule) => {
		return rule?.key === 'emailAddress'
	});

	await sendEmailCode({
		emailAddress: emailModel.value.emailAddress,
		type: 'Register',
	}).then(() => {

	}).catch((error) => {
		return Promise.reject(error);
	})
	startTimer();
}

const handleLogin = async() => {
	const formRef = tabType.value === 'login' ? loginRef.value : emailRef.value;
	const result = await formRef?.validate();
	const requestFn = authByPsd;
	// const requestFn = tabType.value === 'login' ? authByPsd : aythByEmail;
	loding.value = true;
	requestFn(tabType.value === 'login' ? loginModel.value : {
		identity: emailModel.value.emailAddress,
		password: emailModel.value.authCode
	}).then(async (res) => {
		authStore.setToken(res.token, res.expiresTime)
		await router.replace({name: 'Root'})
	}).finally(() => {
		loding.value = false;
	})
}
</script>