<script setup lang="ts">
import Designer from './components/Designer'
import Panel from './components/Panel'
import {ref} from "vue";
import {EmptyXml} from "@/utils/ModelerUtil";
import {Row,Col} from 'ant-design-vue'


const xml = ref(EmptyXml())
</script>

<template>
  <div style="display: flex;height: 95vh">
    <Designer :xml="xml"/>
    <Panel/>
  </div>
</template>
<style scoped>

</style>
