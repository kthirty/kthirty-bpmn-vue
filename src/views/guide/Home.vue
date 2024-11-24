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
    console.groupCollapsed('xml changed')
    console.log(xml.value)
    console.groupEnd()
  }
)
const listenerDataSource = [
  {
    value: {
      event: 'PROCESS_COMPLETED',
      type: 'class',
      value: 'top.kthirty.flow.listener.TableFieldEditer',
      field: [
        { name: 'tableName', type: 'string', value: '${tableName}' },
        { name: 'tableColumn', type: 'string', value: '${tableColumn}' },
        { name: 'columnValue', type: 'string', value: '${columnValue}' }
      ]
    },
    label: '表字段修改监听',
    description: '修改表字段为指定值',
    extraParam: [
      { value: 'tableName', label: '表名', required: true },
      { value: 'tableColumn', label: '表字段', required: true },
      { value: 'columnValue', label: '值', required: true, defaultValue: '1' }
    ]
  }
]
</script>
<template>
  <div class="designer-div">
    <bpmn-designer
      v-model:xml="xml"
      :option="{
        panel: {
          processEngine: 'flowable',
          Listener: {
            dataSource: () => {
              return listenerDataSource
            }
          }
        }
      }"
    />
  </div>
</template>
<style lang="less">
.designer-div {
  height: 100vh;
}
</style>
