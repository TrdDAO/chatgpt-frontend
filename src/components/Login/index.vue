<template>
	<NTabs size="large" :value="tabType" animated @update:value="(val:string) => tabType=val">
		<NTabPane name="phone" tab="验证码登录">
			<NForm
				ref="phoneRef"
				:model="phoneModel"
				:rules="{
					phoneNumber: [{required: true, message: '请输入手机号'}],
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
						<NButton @click="handleCode" style="width: 111px">{{ isCounting ? countDownString: '获取验证码'}}</NButton>
					</NInputGroup>
				</NFormItem>
				<NFormItem>
					<NButton block type="primary" @click="handleLogin">登录</NButton>
				</NFormItem>
			</NForm>
		</NTabPane>

		<NTabPane name="email" tab="邮箱登录">
			<NForm
				ref="emailRef"
				:model="emailModel"
				:rules="{
					emailAddress: [{required: true,  message: '请输入邮箱'}],
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
						<NButton  @click="handleCode" style="width: 111px">{{isCounting ? countDownString: '获取验证码'}}</NButton>
					</NInputGroup>
				</NFormItem>
				<NFormItem>
					<NButton block type="primary">登录</NButton>
				</NFormItem>
			</NForm>
		</NTabPane>
	</NTabs>
	
</template>

<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/store'
import { useCountDown } from '@/hooks/useCountDown'
import { aythByPhone, aythByEmail } from '@/service/auth'
import { useRouter } from 'vue-router'

const router = useRouter();
const authStore = useAuthStore();
const tabType = ref<string>('phone');
const time = 60;
const { startTimer, resetTime, isCounting, countDownString } = useCountDown(time, {
	format: 's[s]',
	afterClearCallback:() => {
		resetTime(time);
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

const handleCode = () => {
	if(isCounting) return
	startTimer()
}
const handleLogin = async() => {
	const formRef = tabType.value === 'phone' ? phoneRef.value : emailRef.value
	const result = await formRef?.validate()
	const requestFn = tabType.value === 'phone' ? aythByPhone : aythByEmail
	requestFn(tabType.value === 'phone' ? phoneModel.value : emailModel.value).then((res) => {
		authStore.setToken(res.token, res.expiresTime)
		router.replace({name: 'Root'})
	})
}
</script>