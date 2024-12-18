import type { Element, Connection } from 'bpmn-js/lib/model/Types'
import { is, isAny } from 'bpmn-js/lib/util/ModelUtil'
import { getEventDefinition } from './BpmnElementHelper'
// 是否开始节点
export function isStartEvent(element: Element): boolean {
  return is(element, 'bpmn:StartEvent')
}
// 元素 是否符合 可以设置条件 的情况
export function isCanSetConditional(element: Element): boolean {
  return (
    // @ts-ignore
    (is(element, 'bpmn:SequenceFlow') && isConditionalSource((element as Connection)?.source)) || isConditionEventDefinition(element)
  )
}
// 元素是否符合可以设置Initiator的条件
export function isCanSetInitiator(element: Element): boolean {
  return isAny(element, ['bpmn:StartEvent', 'flowable:Initiator']) && !is(element.parent, 'bpmn:SubProcess')
}

// 父节点符合条件的连线
export function isConditionalSource(element: Element | undefined) {
  return isAny(element, ['bpmn:Activity', 'bpmn:ExclusiveGateway', 'bpmn:InclusiveGateway', 'bpmn:ComplexGateway'])
}
// 是否是 定义条件的事件 （ 控制变量 Variables 配置 ）
export function isConditionEventDefinition(element: Element): boolean {
  return is(element, 'bpmn:Event') && !!getEventDefinition(element, 'bpmn:ConditionalEventDefinition')
}
// 是否为流程
export function isProcess(element: Element): boolean {
  return is(element, 'bpmn:Process')
}
// 是否支持选择任务人
export function isUserTask(element: Element): boolean {
  return is(element, 'bpmn:UserTask')
}
// 是否服务节点
export function isServiceTask(element: Element): boolean {
  return is(element, 'bpmn:ServiceTask')
}
// 是否支持设置监听器
export function isExecutable(element: Element): boolean {
  const LISTENER_ALLOWED_TYPES = ['bpmn:Activity', 'bpmn:Event', 'bpmn:Gateway', 'bpmn:SequenceFlow', 'bpmn:Process', 'bpmn:Participant']
  if (isAny(element, LISTENER_ALLOWED_TYPES)) return true
  if (is(element, 'bpmn:Participant')) {
    return !!element.businessObject.processRef
  }
  return false
}
