import { Element ,Connection} from 'bpmn-js/lib/model/Types'
import { is,isAny } from 'bpmn-js/lib/util/ModelUtil'
import {BpmnElement} from '../types'
import {getEventDefinition} from './BpmnElementHelper'
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
export function isCanSetInitiator(element: BpmnElement): boolean {
  return isAny(element,['bpmn:StartEvent','flowable:Initiator']) && !is(element.parent, 'bpmn:SubProcess')
}

// 父节点符合条件的连线
export function isConditionalSource(element:  Element|  undefined) {
  return isAny(element, [
    'bpmn:Activity',
    'bpmn:ExclusiveGateway',
    'bpmn:InclusiveGateway',
    'bpmn:ComplexGateway'
  ])
}
// 是否是 定义条件的事件 （ 控制变量 Variables 配置 ）
export function isConditionEventDefinition(element: Element): boolean {
  return (
    is(element, 'bpmn:Event') && !!getEventDefinition(element, 'bpmn:ConditionalEventDefinition')
  )
}
// 是否为流程
export function isProcess(element: BpmnElement): boolean {
  return is(element, 'bpmn:Process')
}
