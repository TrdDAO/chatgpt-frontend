<script setup lang="ts">
import { ref, reactive } from 'vue';
import { updatePassword } from '@/service/user';
import { FormInst, useMessage } from 'naive-ui' ;
import { useAppStore } from '@/store'
import { t } from '@/locales'

const message = useMessage();
const appStore = useAppStore();


const psdDataModel = reactive({
	password: '',
	newPassword: '',
	temperature: appStore.temperatureValue,
})
const psdRef = ref<FormInst | null>(null)

const handleUpdatePsd = async() => {
	await psdRef.value?.validate((errors) => {
		if (errors) {
			// console.error(errors)
		}
	},(rule) => {
		return ['password-required', 'newPassword-required', 'newPassword-length'].includes(rule.key as string)
	});
	
	updatePassword({
		password: psdDataModel.password,
		newPassword: psdDataModel.newPassword,
	}).then(() => {
		message.success('修改成功');
		psdDataModel.password = '';
		psdDataModel.newPassword = '';
	})
}

const handleUpdateTemperature = async() => {
	appStore.setTemperature(psdDataModel.temperature);
	message.success('修改成功');
}
</script>

<template>
	<div class="p-4 space-y-5 min-h-[200px]">
		<NForm
			:model="psdDataModel"
			label-placement="left"
			label-align="left"
			:show-require-mark="false"
			:label-width="100"
			:rules="{
				password: [{key:'password-required', required: true, message: '请输入密码'}],
				newPassword: [
					{key:'newPassword-required', required: true, message: '请输入新密码'},
					{key:'newPassword-length', min: 6, message: '新密码需大于等于6位'},
				],
			}"
			ref="psdRef"
		>
			<NFormItem path="password" :label="t('setting.oldPassword')">
				<NInput v-model:value="psdDataModel.password"/>
			</NFormItem>

			<NFormItem path="newPassword" :label="t('setting.newPassword')">
				<NInput v-model:value="psdDataModel.newPassword"/>
				<NButton style="margin-left: 10px;" @click="handleUpdatePsd">修改密码</NButton>
			</NFormItem>
			
			<NFormItem path="temperature" :label="t('setting.temperature')">
				<NSlider
					v-model:value="psdDataModel.temperature"
					:step="0.1"
					:max="1"
					:min="0.1"
				>
				</NSlider>
				<NButton style="margin-left: 10px;" @click="handleUpdateTemperature">保存设置</NButton>
			</NFormItem>
		</NForm>
	</div>
</template>