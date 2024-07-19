import { Element } from 'diagram-js/lib/model/Types'
import { Moddle } from 'bpmn-js/lib/model/Types'
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'
import Modeler from 'bpmn-js/lib/Modeler'
// 创建元素
export function createElement(
  moddle: Moddle,
  elementType: string,
  properties: Record<string, any>,
  parent?: Element
): Element {
  const element = moddle.create(elementType, properties)
  parent && (element.$parent = parent)
  return element
}
// 提示
export function message(method:String,errorMsg: String){
  // @ts-ignore
  window.__messageBox[method](errorMsg)
}
// 获取节点事件定义
export function getEventDefinition(
  element: Element ,
  eventType: string
): Element {
  const businessObject = getBusinessObject(element)
  const eventDefinitions = businessObject.get('eventDefinitions') || []
  return eventDefinitions.find(eventDefinitions, function (definition:any) {
    return is(definition, eventType)
  })
}
// 获取空的Xml
export function EmptyXml (key?: string, name?: string): string {
  const timestamp = Date.now()
  key = key || `Process_${timestamp}`;
  name = name || `业务流程_${timestamp}`;
  return `<?xml version="1.0" encoding="UTF-8"?>
  <bpmn:definitions 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
    xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
    xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
    targetNamespace="http://bpmn.io/schema/bpmn"
    id="Definitions_${key}">
    <bpmn:process id="${key}" name="${name}" isExecutable="true"></bpmn:process>
    <bpmndi:BPMNDiagram id="BPMNDiagram_1">
      <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${key}"></bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
  </bpmn:definitions>`
}
// 创建一个新的图表
export async function createNewDiagram(modeler: Modeler,newXml?: string, settings?: any) {
  try {
    const timestamp = Date.now()
    const { processId, processName } = settings || {}
    const newId: string = processId ? processId : `Process_${timestamp}`
    const newName: string = processName || `业务流程_${timestamp}`
    const xmlString = newXml || EmptyXml(newId, newName)
    const { warnings } = await modeler!.importXML(xmlString)
    if (warnings && warnings.length) {
      warnings.forEach((warn) => console.warn(warn))
    }
  } catch (e) {
    message['error'](`[Process Designer Warn]: ${typeof e === 'string' ? e : (e as Error)?.message}`)
  }
}

/**
 * Creates a debounced function that delays invoking the provided function until
 * after `wait` milliseconds have elapsed since the last time the debounced function was invoked.
 * @param func - The function to debounce.
 * @param wait - The number of milliseconds to delay.
 * @returns A new debounced function.
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null;

  return function(this: ThisParameterType<T>, ...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func.apply(this, args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
