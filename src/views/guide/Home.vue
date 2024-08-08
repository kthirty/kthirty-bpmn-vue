<script setup lang="ts">
import pkg from '/package.json'
import { ref, computed } from 'vue'
import { routes } from '@/router'
import { useFps } from 'packages'
const { fps } = useFps()

// import.meta.glob 都支持以字符串形式导入文件，类似于 以字符串形式导入资源
const modules = import.meta.glob('../../../package.json', { eager: true })
const url = '../../../package.json'
// 字符串类型对象
type Recordable<T = any> = Record<string, T>
const dependencies = (modules as Recordable)[url].dependencies
console.log('dependencies', dependencies)

const toolFunctions = []
const collapseData = []
const activeKey = ref(0)
const sum = computed(() => {
  return (routes[0].children as Array<any>).length - 2
})
function onOpen() {
  // 打开一个新的窗口，并导航到指定的URL
  // 使用弹窗形式打开新的标签页，不指定left，top时，默认紧靠电脑桌面左上角
  let newWindow = window.open('http://localhost:9000/backtop', '_blank', 'popup,width=800,height=600')
}
</script>
<template>
  <div class="designer-div"><bpmn-designer /> </div>
</template>
<style lang="less">
.u-head {
  font-size: 16px;
}
.u-text {
  font-size: 16px;
}
.designer-div {
  height: 98vh;
}
</style>
