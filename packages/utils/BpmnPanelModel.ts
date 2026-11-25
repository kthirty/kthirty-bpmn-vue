import type { Element } from 'bpmn-js/lib/model/Types'
import { getBusinessObject, is, isAny } from 'bpmn-js/lib/util/ModelUtil'
import { createModdleElement, getEventDefinition, getExPropValue, getExtensionElementsList, updateExPropValue } from './BpmnElementHelper'
import { getModeler, getModeling, getProcessEngine } from './BpmnHolder'

const engine = () => getProcessEngine()
const prefixed = (name: string) => `${engine()}:${name}`
const attr = (element: Element, name: string) => getExPropValue<string>(element, name) || ''
const flag = (element: Element, name: string) => !!getBusinessObject(element)?.get(prefixed(name))

const replaceTyped = (element: Element, typeName: string, next: any[]) => {
  const businessObject = getBusinessObject(element)
  const modeling = getModeling()
  if (!businessObject || !modeling) return
  let extensionElements = businessObject.get('extensionElements')
  if (!extensionElements) {
    extensionElements = createModdleElement('bpmn:ExtensionElements', { values: [] }, businessObject)
    modeling.updateModdleProperties(element, businessObject, { extensionElements })
  }
  const values = (extensionElements.get('values') || []).filter((item: any) => !is(item, prefixed(typeName)))
  next.forEach((item) => (item.$parent = extensionElements))
  modeling.updateModdleProperties(element, extensionElements, { values: [...values, ...next] })
}

const readTyped = (element: Element, typeName: string) => getExtensionElementsList(getBusinessObject(element), prefixed(typeName))

const definitionsOf = (element: Element) => {
  let current: any = getBusinessObject(element)
  while (current?.$parent) current = current.$parent
  return current
}

const listRoot = (element: Element, type: string) => (definitionsOf(element)?.get('rootElements') || []).filter((item: any) => is(item, type))

const addRoot = (element: Element, type: string, prefix: string, attrs: Record<string, any>) => {
  const definitions = definitionsOf(element)
  const created = createModdleElement(type, { id: `${prefix}_${Date.now().toString(36)}`, ...attrs }, definitions)
  getModeling()?.updateModdleProperties(element, definitions, { rootElements: [...(definitions.get('rootElements') || []), created] })
  return created
}

export const rootOptions = (element: Element, type: string, labelKey: string): Array<{ value: string; label: string; name: string }> =>
  listRoot(element, type).map((item: any) => ({ value: item.id as string, label: item.get(labelKey) || item.id, name: item.get(labelKey) || '' }))

export const activityOptions = (element: Element) => {
  const parent = getBusinessObject(element)?.$parent
  const registry = getModeler()?.get<any>('elementRegistry')
  return (registry?.filter(() => true) || [])
    .filter((item: Element) => is(item, 'bpmn:Activity') && getBusinessObject(item)?.$parent === parent)
    .map((item: Element) => ({ value: item.id, label: getBusinessObject(item).get('name') || item.id }))
}

const formal = (node: any, key: string) => {
  const value = node?.get?.(key)
  if (!value) return ''
  return typeof value === 'string' ? value : value.get?.('body') || ''
}

const expression = (body: string, parent: any) => (body ? createModdleElement('bpmn:FormalExpression', { body }, parent) : undefined)

const clearImplementation = (element: Element) => {
  updateExPropValue(element, 'class', undefined)
  updateExPropValue(element, 'expression', undefined)
  updateExPropValue(element, 'delegateExpression', undefined)
}

export const readImplementation = (element: Element) => {
  const current = (['class', 'expression', 'delegateExpression'] as const).find((key) => attr(element, key))
  return { serviceType: current || 'class', serviceValue: current ? attr(element, current) : '' }
}

export const writeImplementation = (element: Element, type: string, value: string) => {
  ;(['class', 'expression', 'delegateExpression'] as const).forEach((key) => updateExPropValue(element, key, key === type ? value : undefined))
}

export const readScript = (element: Element) => {
  const businessObject = getBusinessObject(element)
  return {
    scriptFormat: businessObject.get('scriptFormat') || '',
    script: businessObject.get('script') || '',
    resultVariable: attr(element, 'resultVariable'),
    resource: attr(element, 'resource')
  }
}

export const writeScript = (element: Element, form: ReturnType<typeof readScript>) => {
  getModeling()?.updateModdleProperties(element, getBusinessObject(element), {
    scriptFormat: form.scriptFormat || undefined,
    script: form.script || undefined
  })
  updateExPropValue(element, 'resultVariable', form.resultVariable)
  updateExPropValue(element, 'resource', form.resource)
}

export const readBusinessRule = (element: Element) => {
  const implementation = readImplementation(element)
  const decisionRef = attr(element, 'decisionRef')
  return {
    mode: decisionRef ? 'dmn' : implementation.serviceType,
    value: decisionRef || implementation.serviceValue,
    binding: attr(element, 'decisionRefBinding') || 'latest',
    version: attr(element, 'decisionRefVersion'),
    tenantId: attr(element, 'decisionRefTenantId'),
    mapDecisionResult: attr(element, 'mapDecisionResult') || 'resultList',
    resultVariable: attr(element, 'resultVariable')
  }
}

export const writeBusinessRule = (element: Element, form: ReturnType<typeof readBusinessRule>) => {
  clearImplementation(element)
  updateExPropValue(element, 'decisionRef', undefined)
  if (form.mode === 'dmn') updateExPropValue(element, 'decisionRef', form.value)
  else updateExPropValue(element, form.mode, form.value)
  updateExPropValue(element, 'decisionRefBinding', form.mode === 'dmn' ? form.binding : undefined)
  updateExPropValue(element, 'decisionRefVersion', form.mode === 'dmn' ? form.version : undefined)
  updateExPropValue(element, 'decisionRefTenantId', form.mode === 'dmn' ? form.tenantId : undefined)
  updateExPropValue(element, 'mapDecisionResult', form.mode === 'dmn' ? form.mapDecisionResult : undefined)
  updateExPropValue(element, 'resultVariable', form.resultVariable)
}

const readMessage = (owner: any) => {
  const ref = owner?.get?.('messageRef')
  return { messageId: ref?.id || '', messageName: ref?.get?.('name') || '' }
}

const writeMessage = (element: Element, owner: any, id: string, name: string) => {
  if (!owner) return ''
  if (id) {
    const target = listRoot(element, 'bpmn:Message').find((item: any) => item.id === id)
    if (target) {
      getModeling()?.updateModdleProperties(element, target, { name: name || undefined })
      getModeling()?.updateModdleProperties(element, owner, { messageRef: target })
      return target.id as string
    }
  }
  if (!name) {
    getModeling()?.updateModdleProperties(element, owner, { messageRef: undefined })
    return ''
  }
  const created = addRoot(element, 'bpmn:Message', 'Message', { name })
  getModeling()?.updateModdleProperties(element, owner, { messageRef: created })
  return created.id as string
}

export const readSend = (element: Element) => ({
  ...readImplementation(element),
  resultVariable: attr(element, 'resultVariable'),
  type: attr(element, 'type'),
  topic: attr(element, 'topic'),
  ...readMessage(getBusinessObject(element))
})

export const writeSend = (element: Element, form: ReturnType<typeof readSend>) => {
  writeImplementation(element, form.serviceType, form.serviceValue)
  updateExPropValue(element, 'resultVariable', form.resultVariable)
  updateExPropValue(element, 'type', form.type)
  updateExPropValue(element, 'topic', form.topic)
  return writeMessage(element, getBusinessObject(element), form.messageId, form.messageName)
}

export const readReceive = (element: Element) => ({
  ...readMessage(getBusinessObject(element)),
  instantiate: !!getBusinessObject(element).get('instantiate')
})

export const writeReceive = (element: Element, form: ReturnType<typeof readReceive>) => {
  getModeling()?.updateModdleProperties(element, getBusinessObject(element), { instantiate: form.instantiate })
  return writeMessage(element, getBusinessObject(element), form.messageId, form.messageName)
}

export const readCall = (element: Element) => ({
  calledElement: getBusinessObject(element).get('calledElement') || '',
  binding: attr(element, 'calledElementBinding') || 'latest',
  version: attr(element, 'calledElementVersion'),
  versionTag: attr(element, 'calledElementVersionTag'),
  tenantId: attr(element, 'calledElementTenantId'),
  mappings: [
    ...readTyped(element, 'In').map((item: any) => ({ direction: 'in', source: item.get('sourceExpression') || item.get('source') || '', target: item.get('target') || '' })),
    ...readTyped(element, 'Out').map((item: any) => ({ direction: 'out', source: item.get('sourceExpression') || item.get('source') || '', target: item.get('target') || '' }))
  ]
})

export const writeCall = (element: Element, form: ReturnType<typeof readCall>) => {
  getModeling()?.updateModdleProperties(element, getBusinessObject(element), { calledElement: form.calledElement || undefined })
  updateExPropValue(element, 'calledElementBinding', form.binding)
  updateExPropValue(element, 'calledElementVersion', form.version)
  updateExPropValue(element, 'calledElementVersionTag', form.versionTag)
  updateExPropValue(element, 'calledElementTenantId', form.tenantId)
  const build = (direction: string) =>
    form.mappings
      .filter((item) => item.direction === direction && (item.source || item.target))
      .map((item) => {
        const expressionValue = /^\s*[#$]\{/.test(item.source)
        return createModdleElement(prefixed(direction === 'out' ? 'Out' : 'In'), {
          source: expressionValue ? undefined : item.source || undefined,
          sourceExpression: expressionValue ? item.source : undefined,
          target: item.target || undefined
        })
      })
  replaceTyped(element, 'In', build('in'))
  replaceTyped(element, 'Out', build('out'))
}

const eventKinds = [
  ['timer', 'bpmn:TimerEventDefinition'],
  ['message', 'bpmn:MessageEventDefinition'],
  ['signal', 'bpmn:SignalEventDefinition'],
  ['error', 'bpmn:ErrorEventDefinition'],
  ['escalation', 'bpmn:EscalationEventDefinition'],
  ['link', 'bpmn:LinkEventDefinition'],
  ['compensation', 'bpmn:CompensateEventDefinition'],
  ['conditional', 'bpmn:ConditionalEventDefinition']
] as const

const emptyEvent = () => ({
  kind: '',
  timerType: 'timeDuration',
  timerValue: '',
  refId: '',
  refName: '',
  errorMessage: '',
  errorCodeVariable: '',
  errorMessageVariable: '',
  escalationCodeVariable: '',
  variableName: '',
  variableEvent: '',
  linkName: '',
  activityId: '',
  waitForCompletion: true
})

const syncCoded = (element: Element, owner: any, prop: string, type: string, prefix: string, codeKey: string, id: string, code: string) => {
  if (id) {
    const target = listRoot(element, type).find((item: any) => item.id === id)
    if (target) {
      getModeling()?.updateModdleProperties(element, target, { [codeKey]: code || undefined })
      getModeling()?.updateModdleProperties(element, owner, { [prop]: target })
      return target.id as string
    }
  }
  if (!code) {
    getModeling()?.updateModdleProperties(element, owner, { [prop]: undefined })
    return ''
  }
  const created = addRoot(element, type, prefix, { [codeKey]: code })
  getModeling()?.updateModdleProperties(element, owner, { [prop]: created })
  return created.id as string
}

export const readEvent = (element: Element) => {
  for (const [kind, type] of eventKinds) {
    const definition = getEventDefinition(element, type) as any
    if (!definition) continue
    const form = emptyEvent()
    form.kind = kind
    if (kind === 'timer') {
      const timerType = (['timeDate', 'timeDuration', 'timeCycle'] as const).find((key) => formal(definition, key)) || 'timeDuration'
      form.timerType = timerType
      form.timerValue = formal(definition, timerType)
    }
    if (kind === 'message') Object.assign(form, { refId: readMessage(definition).messageId, refName: readMessage(definition).messageName })
    if (kind === 'signal') {
      const ref = definition.get('signalRef')
      form.refId = ref?.id || ''
      form.refName = ref?.get?.('name') || ''
    }
    if (kind === 'error') {
      const ref = definition.get('errorRef')
      form.refId = ref?.id || ''
      form.refName = ref?.get?.('errorCode') || ''
      form.errorMessage = ref?.get?.(prefixed('errorMessage')) || ref?.get?.('flowable:errorMessage') || ''
      form.errorCodeVariable = definition.get(prefixed('errorCodeVariable')) || ''
      form.errorMessageVariable = definition.get(prefixed('errorMessageVariable')) || ''
    }
    if (kind === 'escalation') {
      const ref = definition.get('escalationRef')
      form.refId = ref?.id || ''
      form.refName = ref?.get?.('escalationCode') || ''
      form.escalationCodeVariable = definition.get(prefixed('escalationCodeVariable')) || ''
    }
    if (kind === 'link') form.linkName = definition.get('name') || ''
    if (kind === 'compensation') {
      form.activityId = definition.get('activityRef')?.id || ''
      form.waitForCompletion = definition.get('waitForCompletion') !== false
    }
    if (kind === 'conditional') {
      form.variableName = definition.get(prefixed('variableName')) || definition.get('variableName') || ''
      form.variableEvent = definition.get(prefixed('variableEvent')) || definition.get('variableEvents') || ''
    }
    return form
  }
  return emptyEvent()
}

export const writeEvent = (element: Element, form: ReturnType<typeof readEvent>) => {
  const definition = getEventDefinition(element, eventKinds.find(([kind]) => kind === form.kind)?.[1] || '') as any
  if (!definition) return form.refId
  const modeling = getModeling()
  if (form.kind === 'timer') {
    modeling?.updateModdleProperties(element, definition, {
      timeDate: form.timerType === 'timeDate' ? expression(form.timerValue, definition) : undefined,
      timeDuration: form.timerType === 'timeDuration' ? expression(form.timerValue, definition) : undefined,
      timeCycle: form.timerType === 'timeCycle' ? expression(form.timerValue, definition) : undefined
    })
  }
  if (form.kind === 'message') return writeMessage(element, definition, form.refId, form.refName)
  if (form.kind === 'signal') return syncCoded(element, definition, 'signalRef', 'bpmn:Signal', 'Signal', 'name', form.refId, form.refName)
  if (form.kind === 'error') {
    const id = syncCoded(element, definition, 'errorRef', 'bpmn:Error', 'Error', 'errorCode', form.refId, form.refName)
    const target = listRoot(element, 'bpmn:Error').find((item: any) => item.id === id)
    if (target && engine() === 'flowable') modeling?.updateModdleProperties(element, target, { 'flowable:errorMessage': form.errorMessage || undefined })
    modeling?.updateModdleProperties(element, definition, {
      [prefixed('errorCodeVariable')]: form.errorCodeVariable || undefined,
      [prefixed('errorMessageVariable')]: form.errorMessageVariable || undefined
    })
    return id
  }
  if (form.kind === 'escalation') {
    const id = syncCoded(element, definition, 'escalationRef', 'bpmn:Escalation', 'Escalation', 'escalationCode', form.refId, form.refName)
    modeling?.updateModdleProperties(element, definition, { [prefixed('escalationCodeVariable')]: form.escalationCodeVariable || undefined })
    return id
  }
  if (form.kind === 'link') modeling?.updateModdleProperties(element, definition, { name: form.linkName || undefined })
  if (form.kind === 'compensation') {
    const registry = getModeler()?.get<any>('elementRegistry')
    const activity = registry?.get?.(form.activityId)
    modeling?.updateModdleProperties(element, definition, {
      activityRef: activity ? getBusinessObject(activity) : undefined,
      waitForCompletion: form.waitForCompletion
    })
  }
  if (form.kind === 'conditional') {
    modeling?.updateModdleProperties(element, definition, {
      [prefixed('variableName')]: form.variableName || undefined,
      [prefixed('variableEvent')]: form.variableEvent || undefined
    })
  }
  return form.refId
}

export const hasEventConfig = (element: Element) => eventKinds.some(([, type]) => !!getEventDefinition(element, type))

export const readMulti = (element: Element) => {
  const loop = getBusinessObject(element).get('loopCharacteristics')
  if (!loop || !is(loop, 'bpmn:MultiInstanceLoopCharacteristics')) {
    return { enabled: false, sequential: false, collection: '', elementVariable: '', cardinality: '', completion: '' }
  }
  return {
    enabled: true,
    sequential: !!loop.get('isSequential'),
    collection: loop.get(prefixed('collection')) || '',
    elementVariable: loop.get(prefixed('elementVariable')) || '',
    cardinality: formal(loop, 'loopCardinality'),
    completion: formal(loop, 'completionCondition')
  }
}

export const writeMulti = (element: Element, form: ReturnType<typeof readMulti>) => {
  const businessObject = getBusinessObject(element)
  const modeling = getModeling()
  if (!form.enabled) {
    modeling?.updateModdleProperties(element, businessObject, { loopCharacteristics: undefined })
    return
  }
  let loop = businessObject.get('loopCharacteristics')
  if (!loop || !is(loop, 'bpmn:MultiInstanceLoopCharacteristics')) {
    loop = createModdleElement('bpmn:MultiInstanceLoopCharacteristics', {}, businessObject)
    modeling?.updateModdleProperties(element, businessObject, { loopCharacteristics: loop })
  }
  modeling?.updateModdleProperties(element, loop, {
    isSequential: !!form.sequential,
    [prefixed('collection')]: form.collection || undefined,
    [prefixed('elementVariable')]: form.elementVariable || undefined,
    loopCardinality: expression(form.cardinality, loop),
    completionCondition: expression(form.completion, loop)
  })
}

export const readAsync = (element: Element) => {
  const businessObject = getBusinessObject(element)
  const retry = readTyped(element, 'FailedJobRetryTimeCycle')[0]
  return {
    asyncBefore: !!(businessObject.get(prefixed('asyncBefore')) || businessObject.get(prefixed('async'))),
    asyncAfter: !!businessObject.get(prefixed('asyncAfter')),
    exclusive: businessObject.get(prefixed('exclusive')) !== false,
    jobPriority: businessObject.get(prefixed('jobPriority')) || '',
    retry: retry?.get?.('body') || ''
  }
}

export const writeAsync = (element: Element, form: ReturnType<typeof readAsync>) => {
  updateExPropValue(element, 'async', form.asyncBefore)
  updateExPropValue(element, 'exclusive', form.exclusive)
  updateExPropValue(element, 'jobPriority', form.jobPriority)
  if (engine() === 'flowable') {
    updateExPropValue(element, 'asyncBefore', form.asyncBefore)
    updateExPropValue(element, 'asyncAfter', form.asyncAfter)
  }
  replaceTyped(element, 'FailedJobRetryTimeCycle', form.retry ? [createModdleElement(prefixed('FailedJobRetryTimeCycle'), { body: form.retry })] : [])
}

export const canAsync = (element: Element) => isAny(element, ['bpmn:Activity', 'bpmn:Gateway', 'bpmn:Event'])

export const readProperties = (element: Element) => {
  const container = readTyped(element, 'Properties')[0]
  return ((container?.get('values') || []) as any[]).map((item) => ({ name: item.get('name') || '', value: item.get('value') || '' }))
}

export const writeProperties = (element: Element, rows: Array<{ name: string; value: string }>) => {
  const values = rows.filter((item) => item.name).map((item) => createModdleElement(prefixed('Property'), { name: item.name, value: item.value }))
  replaceTyped(element, 'Properties', values.length ? [createModdleElement(prefixed('Properties'), { values })] : [])
}

const parameterValue = (item: any) => item?.get?.('value') || item?.body || ''

export const readIo = (element: Element) => {
  const container = readTyped(element, 'InputOutput')[0]
  if (!container) return [] as Array<{ direction: string; name: string; value: string }>
  const map = (list: any[], direction: string) => (list || []).map((item) => ({ direction, name: item.get('name') || '', value: parameterValue(item) }))
  return [...map(container.get('inputParameters'), 'in'), ...map(container.get('outputParameters'), 'out')]
}

export const writeIo = (element: Element, rows: Array<{ direction: string; name: string; value: string }>) => {
  const build = (direction: string) =>
    rows
      .filter((item) => item.direction === direction && item.name)
      .map((item) => createModdleElement(prefixed(direction === 'out' ? 'OutputParameter' : 'InputParameter'), { name: item.name, value: item.value }))
  const container = createModdleElement(prefixed('InputOutput'), { inputParameters: build('in'), outputParameters: build('out') })
  replaceTyped(element, 'InputOutput', rows.some((item) => item.name) ? [container] : [])
}

export const readFormProperties = (element: Element) =>
  readTyped(element, 'FormProperty').map((item: any) => ({
    id: item.get('id') || '',
    name: item.get('name') || '',
    type: item.get('type') || 'string',
    required: String(item.get('required') ?? 'false'),
    variable: item.get('variable') || '',
    default: item.get('default') || ''
  }))

export const writeFormProperties = (element: Element, rows: ReturnType<typeof readFormProperties>) => {
  replaceTyped(
    element,
    'FormProperty',
    rows
      .filter((item) => item.id)
      .map((item) =>
        createModdleElement(prefixed('FormProperty'), { id: item.id, name: item.name, type: item.type, required: item.required, variable: item.variable, default: item.default })
      )
  )
}

export const isFlowable = () => engine() === 'flowable'
export const canExtend = (element: Element) => isAny(element, ['bpmn:FlowElement', 'bpmn:Process'])
export const canMapIo = (element: Element) => is(element, 'bpmn:FlowNode') && !is(element, 'bpmn:CallActivity')
export const canEditForm = (element: Element) => isAny(element, ['bpmn:StartEvent', 'bpmn:UserTask'])
