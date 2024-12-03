<h1 align="center">
    KThirty Bpmn Vue Process UI
</h1>
<p align="center">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/kthirty/kthirty-bpmn-vue?style=flat&logo=github" />
    <img alt="GitHub stars" src="https://img.shields.io/github/forks/kthirty/kthirty-bpmn-vue?style=flat&logo=github" />
</p>

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

### 相关文档
- [在线预览](https://blog.kthirty.top/kthirty-bpmn-vue/)
- [使用文档](https://blog.kthirty.top/kthirty-bpmn-vue/docs/)
- [bpmn-js](https://bpmn.io/)
- [我的博客](https://blog.kthirty.top)