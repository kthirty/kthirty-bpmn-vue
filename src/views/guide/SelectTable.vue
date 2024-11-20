<script lang="ts" setup>
import { ref } from 'vue'
defineOptions({ name: 'SelectTable' })

const val = ref('5')
const dataSource = ref<any[]>([])

for (let index = 0; index < 10; index++) {
  dataSource.value.push({ value: index + '', label: 'label' + index })
}
</script>
<template>
  <div>
    <div>当前值为：{{ val }}</div>

  </div>
</template>
