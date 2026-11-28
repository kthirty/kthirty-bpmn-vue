import { getProcessEngine } from '../../../../utils/BpmnHolder'

const DEFAULT_ENGINE = 'flowable'

export function enginePrefix(): string {
  return getProcessEngine() || DEFAULT_ENGINE
}

export function exProp(node: any, propKey: string): string {
  const key = `${enginePrefix()}:${propKey}`
  const raw = node?.get ? node.get(key) : node?.[key]
  return typeof raw === 'string' ? raw.trim() : ''
}

export function stdProp(node: any, propKey: string): string {
  const raw = node?.get ? node.get(propKey) : node?.[propKey]
  return typeof raw === 'string' ? raw.trim() : ''
}

export function extensionValues(node: any): any[] {
  return node?.extensionElements?.values || node?.extensionElements?.get?.('values') || []
}

export function extensionsByLocalName(node: any, localName: string): any[] {
  const prefix = enginePrefix()
  const types = [`${prefix}:${localName}`, `activiti:${localName}`]
  return extensionValues(node).filter((item) => item && types.includes(item.$type))
}

export function hasServiceImplementation(node: any): boolean {
  return ['class', 'expression', 'delegateExpression'].some((key) => exProp(node, key) !== '')
}

export function conditionBody(flow: any): string {
  const expr = flow?.conditionExpression
  if (!expr) return ''
  if (typeof expr === 'string') return expr.trim()
  const body = expr.body ?? expr.get?.('body')
  return typeof body === 'string' ? body.trim() : ''
}

export function isDirectChildOfProcess(node: any): boolean {
  return node?.$parent?.$type === 'bpmn:Process'
}
