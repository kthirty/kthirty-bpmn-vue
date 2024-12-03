## 快速上手

### 安装
`npm i --save kthirty-bpmn-vue`

### 使用
```ts
<script setup lang="ts">
import {BpmnDesigner} from 'kthirty-bpmn-vue3'
import 'kthirty-bpmn-vue3/dist/style.css'
import {ref} from "vue";

const xml = ref('')
</script>

<template>
  <div style="width: 100vw; height: 100vh">
    <BpmnDesigner :xml="xml"/>
  </div>
</template>
```