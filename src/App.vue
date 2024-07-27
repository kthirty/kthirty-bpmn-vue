<script setup lang="ts">
import Designer from './components/Designer'
import Panel from './components/Panel'
import Toolbar from './components/Toolbar'
import {ref} from "vue";
import {EmptyXml} from "./components/utils/BpmnElementHelper";


const xml = ref<string>(EmptyXml())
</script>

<template>
  <div style="height: 98vh;width: 100%">
    <Toolbar/>
    <div style='display: flex;height: 97%;'>
      <Designer v-model:xml="xml"/>
      <Panel/>
    </div>
  </div>
</template>
<style scoped>

</style>
