<template>
  <svg class="bpmn-icon" aria-hidden="true">
    <use :xlink:href="`#${name}`" :fill="color" />
  </svg>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'BpmnIcon',
    inheritAttrs: false,
    props: {
      name: {
        type: String,
        default: 'bpmn-icon-process'
      },
      color: {
        type: String,
        default: '#1d1d1f'
      }
    }
  })
</script>
<style scoped>
  .bpmn-icon {
    width: 40px;
    height: 40px;
    grid-row-start: 1;
    grid-row-end: 3;
  }
</style>
