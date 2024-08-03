<template>
  <div id="app" style="height: 100vh">
    <BpmnDesigner/>
  </div>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import BpmnDesigner from '@/components/BpmnDesigner';

export default defineComponent({
  name: 'App',
  components: {
    BpmnDesigner,
  },
});
</script>
