/// <reference types="vite/client" />
// declare module '*.vue' {
//   import type { DefineComponent } from 'vue'
//   const vueComponent: DefineComponent<{}, {}, any>
//   export default vueComponent
// }

declare module '*.js'
declare module '*.tsx'
declare module '*.gz'
declare module '*.json'
declare module 'minimist'
declare module 'bpmn-js'
declare module 'bpmn-js-create-append-anything';
declare module 'bpmn-js-color-picker';
declare module 'bpmn-js-bpmnlint';
declare module 'bpmn-moddle';
declare module 'bpmnlint';

interface Window {
  rafTimeout: Function
}