import type { BaseViewerOptions } from 'bpmn-js/lib/BaseViewer'
import type { JSX } from 'vue/jsx-runtime'

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
  language: 'zh',
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
export interface TaskListener {
  event: string
  class: string
  [key: string]: any
}
export type ListenerType = 'TaskListener' | 'ExecutionListener' | 'EventListener'
export interface ListenerConfig {
  event?: string | string[]
  type?: 'class' | 'expression' | 'delegateExpression'
  value?: string
  field?: ListenerFieldConfig[]
}
export interface ListenerFieldConfig {
  name: string
  type: 'string' | 'expression'
  value?: string
}

export type ToobarItem = 'Imports' | 'Exports' | 'Previews' | 'LintToggle' | 'Aligns' | 'Scales' | 'Commands'
export interface ToobarOption {
  items: ToobarItem[]
  extra?: () => JSX.Element
}
export const defaultToobarOption: ToobarOption = {
  items: ['Imports', 'Exports', 'Previews', 'LintToggle', 'Aligns', 'Scales', 'Commands']
}
export type PanelItem = 'BasicInfo' | 'Condition' | 'Listener' | 'StartInitiator' | 'UserTask'
export interface PanelOption {
  items: PanelItem[]
  extra?: (() => JSX.Element)[]
  UserTask?: {
    assigneeDataSource?: (type: string) => DataSourceItem[]
    dueDateDataSource?: () => DataSourceItem[]
    skipExpressionDataSource?: () => DataSourceItem[]
  }
  Listener?: {
    dataSource?: (type: ListenerType) => DataSourceItem[]
  }
}
export const defaultPanelOption: PanelOption = {
  items: ['BasicInfo', 'Condition', 'Listener', 'StartInitiator', 'UserTask']
}
export interface DesignerOption {
  configEnhance?: (config: BaseViewerOptions) => BaseViewerOptions
}
export interface BpmnDesignerOption {
  designer?: DesignerOption
  panel?: PanelOption
  toolbar?: ToobarOption
}

export interface DataSourceItem {
  value: string
  label: string
  description?: string
  extraParam?: DataSourceExtraParam[]
}
// 补充参数
export interface DataSourceExtraParam {
  value: string
  label: string
  description: string
  required?: boolean
  defaultValue?: string
}