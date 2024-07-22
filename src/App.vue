<script setup lang="ts">
import Designer from './components/Designer'
import Panel from './components/Panel'
import {ref} from "vue";
import {EmptyXml} from "./components/utils/BpmnElementHelper";


const xml = ref<string>(EmptyXml())
</script>

<template>
  <div style="display: flex;height: 95vh">
    <Designer v-model:xml="xml"/>
    <Panel/>
  </div>
</template>
<style scoped>

</style>
