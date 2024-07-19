<script setup lang="ts">
import Designer from './components/Designer'
import Panel from './components/Panel'
import {ref} from "vue";
import {EmptyXml} from "@/utils/ModelerUtil";
import {Button} from 'ant-design-vue'
import Logger from '@/utils/Logger'


const xml = ref<string>(EmptyXml())
const logXml = () => Logger.prettySuccess('Current Xml',xml.value)
</script>

<template>
  <Button @click="logXml">Console</Button>
  <div style="display: flex;height: 95vh">
    <Designer v-model:xml="xml"/>
    <Panel/>
  </div>
</template>
<style scoped>

</style>
