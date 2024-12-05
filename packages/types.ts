import type { BaseViewerOptions } from 'bpmn-js/lib/BaseViewer'
import type { JSX } from 'vue/jsx-runtime'

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
export type ListenerType = 'TaskListener' | 'ExecutionListener' | 'EventListener'
export type ValueType = 'class' | 'expression' | 'delegateExpression'
export interface ListenerConfig {
  event?: string | string[]
  type?: 'class' | 'expression' | 'delegateExpression'
  value?: string
  onTransaction?: 'before-commit' | 'committed' | 'rolled-back'
  field?: ListenerFieldConfig[]
}
export interface ListenerFieldConfig {
  name: string
  type: 'string' | 'expression'
  value?: string
}

export type ToolbarItem = 'Imports' | 'Exports' | 'Previews' | 'LintToggle' | 'Aligns' | 'Scales' | 'Commands'
export interface ToolbarOption {
  items: ToolbarItem[]
  extra?: () => JSX.Element
}
export const defaultToolbarOption: ToolbarOption = {
  items: ['Imports', 'Exports', 'Previews', 'LintToggle', 'Aligns', 'Scales', 'Commands']
}
export type PanelItem = 'BasicInfo' | 'Condition' | 'Listener' | 'StartInitiator' | 'UserTask' | 'UserTaskButtons' | 'ServiceTask'
export interface PanelOption {
  items: PanelItem[]
  extra?: (() => JSX.Element)[]
  UserTask?: {
    assigneeDataSource?: (type: string) => DataSourceItem[]
    dueDateDataSource?: () => DataSourceItem[]
    skipExpressionDataSource?: () => DataSourceItem[]
    formKeyDateDataSource: () => DataSourceItem[]
  }
  StartInitiator?: {
    formKeyDateDataSource: () => DataSourceItem[]
  }
  Listener?: {
    dataSource?: (type: ListenerType) => DataSourceItem[]
  }
  ServiceTask?: {
    serviceDataSource?: (type: ValueType) => DataSourceItem[]
  }
}
export const defaultPanelOption: PanelOption = {
  items: ['BasicInfo', 'Condition', 'Listener', 'StartInitiator', 'UserTask', 'UserTaskButtons', 'ServiceTask']
}
export interface DesignerOption {
  processEngine?: 'flowable' | 'activiti'
  configEnhance?: (config: BaseViewerOptions) => BaseViewerOptions
}
export interface BpmnDesignerOption {
  designer?: DesignerOption
  panel?: PanelOption
  toolbar?: ToolbarOption
}

export interface DataSourceItem {
  value: any
  label: string
  description?: string
  // 需要补充的参数
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
// 任务按钮
export interface ButtonInfo {
  code?: string
  name?: string
  resultCode?: string
  description?: string
  commentRequired?: boolean
}
