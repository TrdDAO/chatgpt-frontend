<script setup lang='ts'>
import { computed } from 'vue'
import type { PopoverPlacement } from 'naive-ui'
import { NTooltip } from 'naive-ui'
import Button from './Button.vue'

interface Props {
  style?:Object,
  trigger?:'hover' | 'click' | 'focus' | 'manual',
  tooltip?: string|boolean
  placement?: PopoverPlacement
}

interface Emit {
  (e: 'click'): void
}

const props = withDefaults(defineProps<Props>(), {
  trigger: 'hover',
  tooltip: '',
  placement: 'bottom',
})

const emit = defineEmits<Emit>()

const showTooltip = computed(() => {
  return Boolean(props.tooltip)
})

function handleClick() {
  emit('click')
}
</script>

<template>
  <div v-if="showTooltip">
    <NTooltip :placement="placement" :trigger="trigger" :style="style">
      <template #trigger>
        <Button @click="handleClick">
          <slot />
        </Button>
      </template>
      <slot name="tooltip">{{ tooltip }}</slot>
    </NTooltip>
  </div>
  <div v-else>
    <Button @click="handleClick">
      <slot />
    </Button>
  </div>
</template>
