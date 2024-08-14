import type { Element, ModdleElement } from 'bpmn-js/lib/model/Types'
import type { Moddle } from 'bpmn-js/lib/model/Types'
import Modeler from 'bpmn-js/lib/Modeler'
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'
import { getModdle, getModeler, getModeling, getProcessEngine } from './BpmnHolder'
import { isArray } from 'ant-design-vue/es/_util/util'

// 创建元素
export function createElement(moddle: Moddle, elementType: string, properties: Record<string, any>, parent?: Element): Element {
  const element = moddle.create(elementType, properties)
  parent && (element.$parent = parent)
  return element
}

// 提示
export function message(method: String, errorMsg: String) {
  // @ts-ignore
  window.__messageBox[method](errorMsg)
}

// 获取节点事件定义
export function getEventDefinition(element: Element, eventType: string): Element {
  const businessObject = getBusinessObject(element)
  const eventDefinitions = businessObject.get('eventDefinitions') || []
  return find(eventDefinitions, function (definition: any) {
    return is(definition, eventType)
  })
}

// 获取空的Xml
export function EmptyXml(key?: string, name?: string): string {
  const timestamp = Date.now()
  key = key || `Process_${timestamp}`
  name = name || `业务流程_${timestamp}`
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
export async function createNewDiagram(modeler: Modeler, newXml?: string, settings?: any) {
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
  let timeout: ReturnType<typeof setTimeout> | null

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    const later = () => {
      timeout = null
      func.apply(this, args)
    }

    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

// 创建元素
export function createCategoryValue(definitions: any, bpmnFactory: any): Element {
  const categoryValue = bpmnFactory.create('bpmn:CategoryValue')
  const category = bpmnFactory.create('bpmn:Category', {
    categoryValue: [categoryValue]
  })
  const modeler = getModeler()
  const rootElements = modeler?.get<Moddle>('moddle').rootElements
  rootElements.push(category)
  // 更新模型
  const commandStack = modeler?.get('commandStack')
  // @ts-ignore
  commandStack?.execute('elements.add', {
    elements: [category]
  })
  getBusinessObject(category).$parent = definitions
  getBusinessObject(categoryValue).$parent = category
  return categoryValue
}

export function without<T>(array: T[], ...values: T[]): T[] {
  return array.filter((item) => !values.includes(item))
}

/**
 * 查找数组中第一个满足谓词函数的元素。
 * @param array - 要搜索的数组
 * @param predicate - 用于测试每个元素的函数
 * @returns 数组中第一个满足谓词函数的元素，如果没有找到则返回 undefined
 */
function find<T>(array: T[], predicate: (value: T, index: number, obj: T[]) => boolean): T | undefined {
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i], i, array)) {
      return array[i]
    }
  }
  return undefined
}

// 创建Moddle
export function createModdleElement(elementType: string, properties: Record<string, any>, parent?: Element): Element {
  const moddle = getModdle()
  const element = moddle.create(elementType, properties)
  parent && (element.$parent = parent)
  return element
}

// 获取节点属性
export function getExPropValue<T>(element: any, propKey: string): T {
  const exPropKey = `${getProcessEngine()}:${propKey}`
  return element && element.get ? element.get(exPropKey) : element ? element[exPropKey] : element
}

// 修改节点属性
export function updateExPropValue(element: Element, propKey: string, value: any) {
  const exPropKey = `${getProcessEngine()}:${propKey}`
  getModeling()?.updateModdleProperties(element, getBusinessObject(element), {
    [exPropKey]: value === '' ? undefined : value
  })
}

/**
 * Add one or more extension elements. Create bpmn:ExtensionElements if it doesn't exist.
 */
export function addExtensionElements(element: Element, businessObject: ModdleElement, extensionElementToAdd: ModdleElement) {
  const modeling = getModeling()
  let extensionElements = businessObject.get('extensionElements')

  // (1) create bpmn:ExtensionElements if it doesn't exist
  if (!extensionElements) {
    extensionElements = createModdleElement('bpmn:ExtensionElements', { values: [] }, businessObject)
    modeling!.updateModdleProperties(element, businessObject, { extensionElements })
  }
  extensionElementToAdd.$parent = extensionElements

  // (2) add extension element to list
  modeling!.updateModdleProperties(element, extensionElements, {
    values: [...extensionElements.get('values'), extensionElementToAdd]
  })
}

/**
 * Remove one or more extension elements. Remove bpmn:ExtensionElements afterwards if it's empty.
 */
export function removeExtensionElements(element: Element, businessObject: ModdleElement, extensionElementsToRemove: ModdleElement | ModdleElement[]) {
  if (!isArray(extensionElementsToRemove)) {
    extensionElementsToRemove = [extensionElementsToRemove]
  }
  const extensionElements = businessObject.get('extensionElements'),
    values = extensionElements.get('values').filter((value) => !extensionElementsToRemove.includes(value))
  const modeling = getModeling()
  modeling!.updateModdleProperties(element, extensionElements, { values })
}

/**
 * Get extension elements of business object. Optionally filter by type.
 */
export function getExtensionElementsList(businessObject: ModdleElement, type?: string): ModdleElement[] {
  const extensionElements = businessObject?.get('extensionElements')
  if (!extensionElements) return []

  const values = extensionElements.get('values')
  if (!values || !values.length) return []

  if (type) return values.filter((value) => is(value, type))

  return values
}

// 根据所需类型进行转码并返回下载地址
export function setEncoded(type: string, filename: string, data: string) {
  const encodedData: string = encodeURIComponent(data)
  return {
    filename: `${filename}.${type.toLowerCase()}`,
    href: `data:application/${type === 'svg' ? 'text/xml' : 'bpmn20-xml'};charset=UTF-8,${encodedData}`,
    data: data
  }
}

// 文件下载方法
export function downloadFile(href: string, filename: string) {
  if (href && filename) {
    const a: HTMLAnchorElement = document.createElement('a')
    a.download = filename //指定下载的文件名
    a.href = href //  URL对象
    a.click() // 模拟点击
    URL.revokeObjectURL(a.href) // 释放URL 对象
  }
}
// 字符串填充
export function format(template:string, params:any) {
  return template.replace(/{(\w+)}/g, function (match, key) {
    return typeof params[key] !== 'undefined' ? params[key] : match
  })
}