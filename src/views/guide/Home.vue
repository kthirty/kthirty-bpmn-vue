<script setup lang="ts">
import Logger from '../../../packages/utils/Logger'
import { ref, watch } from 'vue'

// import.meta.glob 都支持以字符串形式导入文件，类似于 以字符串形式导入资源
const modules = import.meta.glob('../../../package.json', { eager: true })
const url = '../../../package.json'
type Recordable<T = any> = Record<string, T>
const dependencies = (modules as Recordable)[url].dependencies
console.log('dependencies', dependencies)

const xml = ref<string>('')
watch(
  () => xml.value,
  () => {
    Logger.prettyPrimary('xml changed', xml.value)
  }
)
</script>
<template>
  <div class="designer-div">
    <bpmn-designer v-model:xml="xml" />
  </div>
</template>
<style lang="less">
.designer-div {
  height: 100vh;
}
</style>
