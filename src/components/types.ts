import { defaultLang } from '@/i18n'
import { ElementLike } from 'diagram-js/lib/model/Types'

export type BpmnElement = ElementLike & { type: string }

export interface EditorSettings {
  language: string
  processName: string
  processId: string
  processEngine: 'flowable' | 'activiti' | 'camunda'
  paletteMode: 'default' | 'custom' | 'rewrite' | 'enhancement'
  penalMode: 'default' | 'custom' | 'rewrite'
  contextPadMode: 'default' | 'rewrite' | 'enhancement'
  rendererMode: 'default' | 'rewrite' | 'enhancement'
  bg: string
  toolbar: boolean
  miniMap: boolean
  contextmenu: boolean
  customContextmenu: boolean
  otherModule: boolean
  templateChooser: boolean
  useLint: boolean
  customTheme: Record<string, string | number>
}

export const defaultSettings: EditorSettings = {
  language: defaultLang,
  processId: `Process_${new Date().getTime()}`,
  processName: `业务流程`,
  processEngine: 'flowable',
  paletteMode: 'enhancement',
  penalMode: 'custom',
  contextPadMode: 'enhancement',
  rendererMode: 'rewrite',
  bg: 'grid-image',
  toolbar: true,
  miniMap: true,
  contextmenu: true,
  customContextmenu: true,
  otherModule: true,
  templateChooser: true,
  useLint: false,
  customTheme: {}
}



// bpmn.js 事件参数
// 1. canvas 事件
export type CanvasEventParams = {
  svg: SVGElement
  viewport: SVGElement
}
// 连线条件相关
export interface ConditionalForm {
  conditionType?: string
  expression?: string
  scriptType?: string
  language?: string
  body?: string
  resource?: string
}

export interface ScriptForm extends BpmnScript {
  scriptType?: string
}
export interface BpmnScript {
  scriptFormat?: string
  resource?: string
  value?: string
  scriptType?: string
}

export interface BpmnListenerField {
  name: string
  expression?: string
  stringValue?: string
  string?: string
  htmlVar?: string
}
export interface BpmnExecutionListener {
  event: string
  expression?: string
  class?: string
  delegateExpression?: string
  script?: BpmnScript
  fields?: BpmnListenerField[]
}
export interface ExecutionListenerForm extends BpmnExecutionListener {
  type: string
  script?: BpmnScript
}
export interface FormItemVisible {
  listenerType: string
  scriptType: string
}