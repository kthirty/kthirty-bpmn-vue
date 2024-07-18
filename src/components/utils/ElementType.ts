import { isAny,is } from 'bpmn-js/lib/util/ModelUtil'
import { BpmnElement } from '../types'
import { Element, Connection } from 'diagram-js/lib/model/Types'
import { getEventDefinition } from './BpmnImplementationType'

/**
 * 是否开始节点
 * @param element
 */
export function isStart(element: BpmnElement): boolean {
  return isAny(element,['bpmn:StartEvent']) && !is(element.parent, 'bpmn:SubProcess')
}

/**
 * 元素 是否符合 可以设置条件 的情况
 * @param element
 */
export function isCanSetConditional(element: BpmnElement): boolean {
  return (
    (is(element, 'bpmn:SequenceFlow') && isCanSetConditional((element as Connection)?.source)) ||
    isConditionEventDefinition(element)
  )
}

/**
 * 是否是 定义条件的事件 （ 控制变量 Variables 配置 ）
 * @param element
 */
export function isConditionEventDefinition(element: Element): boolean {
  return (
    is(element, 'bpmn:Event') && !!getEventDefinition(element, 'bpmn:ConditionalEventDefinition')
  )
}
