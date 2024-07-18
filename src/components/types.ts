import { ElementLike } from 'diagram-js/lib/core'
import { ViewerOptions } from 'diagram-js/lib/model/Types'
import { ModuleDeclaration } from 'didi'
import { defaultLang } from '@/i18n'

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


export type ModelerOptions<E extends Element> = ViewerOptions<E> & {
  additionalModules: ModuleDeclaration[]
  moddleExtensions: Object
}

// bpmn.js 事件参数
// 1. canvas 事件
export type CanvasEventParams = {
  svg: SVGElement
  viewport: SVGElement
}

export interface ConditionalForm {
  conditionType?: string
  expression?: string
  scriptType?: string
  language?: string
  body?: string
  resource?: string
}
