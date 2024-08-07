import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'
import { Connection, Element, ModdleElement } from 'bpmn-js/lib/model/Types'
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil'
import BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
import {
  createElement,
  message,
  getEventDefinition,
  createCategoryValue,
  without,
  createModdleElement,
  addExtensionElements, removeExtensionElements, getExtensionElementsList
} from './BpmnElementHelper'
import { getCanvas, getModdle, getModeler, getModeling, getProcessEngine } from './BpmnHolder'
import { BpmnElement, BpmnScript, ExecutionListenerForm, ScriptForm, TaskListener } from '../types'
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry'
import { isUserTask } from '@/components/utils/BpmnElementType'


/**
 * Conditional 工具类，包含处理 BPMN 条件相关的方法
 */
export class Conditional {
  /**
   * 设置默认条件
   * @param element - 连接元素
   * @param isDefault - 是否为默认条件
   */
  static setDefaultCondition(element: Connection, isDefault: boolean) {
    // @ts-ignore
    getModeling()?.updateProperties(element.source, { default: isDefault ? element : undefined });
  }

  /**
   * 获取条件事件定义
   * @param element - BPMN 元素
   * @returns 条件事件定义或 false
   */
  static getConditionalEventDefinition(element: Element): Element | false | undefined {
    if (!is(element, 'bpmn:Event')) return false;
    return getEventDefinition(element, 'bpmn:ConditionalEventDefinition');
  }

  /**
   * 修改条件属性
   * @param element - BPMN 元素
   * @param condition - 条件表达式（可选）
   */
  static updateCondition(element: Element, condition?: string | Element) {
    const modeling = getModeling()
    if (is(element, 'bpmn:SequenceFlow')) {
      modeling?.updateProperties(element, { conditionExpression: condition });
    } else {
      modeling?.updateModdleProperties(element, this.getConditionalEventDefinition(element), { condition });
    }
  }

  /**
   * 获取元素条件类型值
   * @param element - BPMN 元素
   * @returns 条件类型值
   */
  static getConditionTypeValue(element: Element): string {
    const conditionExpression = this.getConditionExpression(element);
    if (conditionExpression) {
      return conditionExpression.get('language') === undefined ? 'expression' : 'script';
    }
    if (element.source?.businessObject?.default === element.businessObject) return 'default';
    return 'none';
  }

  /**
   * 设置元素条件类型值
   * @param element - BPMN 元素
   * @param value - 条件类型值
   */
  static setConditionTypeValue(element: Element, value: string) {
    if (!value || value === 'none' || value === 'default') {
      this.updateCondition(element);
      return this.setDefaultCondition(element as Connection, value === 'default');
    }
    const attributes = {
      language: value === 'script' ? '' : undefined
    };
    const parent = is(element, 'bpmn:SequenceFlow')
      ? getBusinessObject(element)
      : (this.getConditionalEventDefinition(element) as Element);
    const moddle = getModdle()
    const formalExpressionElement = createElement(moddle, 'bpmn:FormalExpression', attributes, parent);
    this.updateCondition(element, formalExpressionElement);
  }

  /**
   * 获取给定元素的条件表达式的值
   * @param element - BPMN 元素
   * @returns 条件表达式元素
   */
  static getConditionExpression(element: Element): Element | undefined {
    const businessObject = getBusinessObject(element);
    if (is(businessObject, 'bpmn:SequenceFlow')) {
      return businessObject.get('conditionExpression');
    }
    const eventDefinition = this.getConditionalEventDefinition(businessObject);
    if (eventDefinition) {
      return (eventDefinition as Element).get('condition');
    }
  }

  /**
   * 获取条件变量名称的值
   * @param element - BPMN 元素
   * @returns 变量名称值
   */
  static getVariableNameValue(element: Element): string | undefined {
    const eventDefinition = this.getConditionalEventDefinition(element);
    if (eventDefinition) {
      return (eventDefinition as Element).get('variableName');
    }
  }

  /**
   * 设置条件变量名称的值
   * @param element - BPMN 元素
   * @param value - 变量名称值
   */
  static setVariableNameValue(element: Element, value: string | undefined) {
    const modeling = getModeling();
    const eventDefinition = this.getConditionalEventDefinition(element);
    if (eventDefinition) {
      modeling?.updateModdleProperties(element, eventDefinition, { variableName: value || '' });
    }
  }

  /**
   * 获取条件变量事件的值
   * @param element - BPMN 元素
   * @returns 变量事件值
   */
  static getVariableEventsValue(element: Element): string | undefined {
    const eventDefinition = this.getConditionalEventDefinition(element);
    if (eventDefinition) {
      return (eventDefinition as Element).get('variableEvents');
    }
  }

  /**
   * 设置条件变量事件的值
   * @param element - BPMN 元素
   * @param value - 变量事件值
   */
  static setVariableEventsValue(element: Element, value: string | undefined) {
    const modeling = getModeling();
    const eventDefinition = this.getConditionalEventDefinition(element);
    if (eventDefinition) {
      modeling?.updateModdleProperties(element, eventDefinition, { variableEvents: value || '' });
    }
  }

// 4. 元素条件表达式
  static getConditionExpressionValue(element: Element): string | undefined {
    const conditionExpression = this.getConditionExpression(element)
    if (conditionExpression) {
      return conditionExpression.get('body')
    }
  }
  static setConditionExpressionValue(element: Element, body: string | undefined) {
    const parent = is(element, 'bpmn:SequenceFlow')
      ? getBusinessObject(element)
      : (this.getConditionalEventDefinition(element) as ModdleElement)
    const formalExpressionElement = createModdleElement('bpmn:FormalExpression', { body }, parent)
    this.updateCondition(element, formalExpressionElement)
  }

// 5. 元素脚本来源类型
  static getConditionScriptTypeValue(element: Element): string | undefined {
    const prefix = getProcessEngine()
    const conditionExpression = this.getConditionExpression(element)!
    if (conditionExpression.get('body') !== undefined) return 'inline'
    if (conditionExpression.get(`${prefix}:resource`) !== undefined) return 'external'
    return 'none'
  }
  static setConditionScriptTypeValue(element: Element, value: string | undefined) {
    const prefix = getProcessEngine()
    const modeling = getModeling()
    let props:any = undefined
    if (!value || value === 'none') {
      props = { body: undefined, [`${prefix}:resource`]: undefined }
    }
    if (value === 'inline') {
      props = { body: '', [`${prefix}:resource`]: undefined }
    }
    if (value === 'external') {
      props = { body: undefined, [`${prefix}:resource`]: '' }
    }
    modeling?.updateModdleProperties(element, this.getConditionExpression(element)!, props)
  }

// 6. 元素脚本 语言类型
  static getConditionScriptLanguageValue(element: Element): string | undefined {
    return this.getConditionExpression(element)?.get('language')
  }
  static setConditionScriptLanguageValue(element: Element, value: string | undefined) {
    const modeling = getModeling()
    modeling?.updateModdleProperties(element, this.getConditionExpression(element)!, { language: value })
  }

// 7. 元素脚本 body
  static getConditionScriptBodyValue(element: Element): string | undefined {
    return this.getConditionExpression(element)?.get('body')
  }
  static setConditionScriptBodyValue(element: Element, value: string | undefined) {
    const modeling = getModeling()
    modeling?.updateModdleProperties(element, this.getConditionExpression(element)!, { body: value })
  }

// 8. 元素脚本 source
  static getConditionScriptResourceValue(element: Element): string | undefined {
    const prefix = getProcessEngine()
    return this.getConditionExpression(element)?.get(`${prefix}:resource`)
  }
  static setConditionScriptResourceValue(element: Element, value: string | undefined) {
    const modeling = getModeling()
    const prefix = getProcessEngine()
    modeling?.updateModdleProperties(element, this.getConditionExpression(element)!, {
      [`${prefix}:resource`]: value
    })
  }
}
/**
 * Id 工具类，包含处理 BPMN 元素 ID 相关的方法
 */
export class Id {
  /**
   * 验证 ID 是否有效
   * @param element - BPMN 元素
   * @param idValue - ID 值
   * @returns 错误消息或 undefined
   */
  static isIdValid(element: Element, idValue: string): string | undefined {
    const idAlreadyExists = getModeler()
      ?.get<ElementRegistry>('elementRegistry')
      ?.getAll()
      .filter(item => item !== element)
      .filter(item => item.id === idValue)
      .length !== 0
    console.log('idAlreadyExists',idAlreadyExists,getModeler()
      ?.get<ElementRegistry>('elementRegistry')
      ?.getAll()
      .filter(item => item !== element)
      .filter(item => item.id === idValue))
    if (!idValue) return 'ID 不能为空.';
    if (idAlreadyExists) return 'ID 必须是唯一的';
    if (/\s/.test(idValue)) return 'ID 不能包含空格';
    const ID_REGEX = /^[a-z_][\w-.]*$/i;
    const QNAME_REGEX = /^([a-z][\w-.]*:)?[a-z_][\w-.]*$/i;
    if (!ID_REGEX.test(idValue)) return 'ID 必须符合 BPMN 规范';
    if (!QNAME_REGEX.test(idValue)) return 'ID 不能包含前缀';
  }

  /**
   * 获取元素的 ID 值
   * @param element - BPMN 元素
   * @returns ID 值
   */
  static getIdValue(element: Element): string {
    return element.businessObject.id;
  }

  /**
   * 设置元素的 ID 值
   * @param element - BPMN 元素
   * @param value - ID 值
   */
  static setIdValue(element: Element, value: string) {
    const errorMsg = this.isIdValid(element, value);
    if (errorMsg && errorMsg.length) return message('warning', errorMsg);
    getModeling()?.updateProperties(element, { id: value });
  }
}
// 节点名称
export class Name {
  static getNameValue(element: Element | BpmnElement): string | undefined {
    if (isAny(element, ['bpmn:Collaboration', 'bpmn:DataAssociation', 'bpmn:Association'])) {
      return undefined
    }
    if (is(element, 'bpmn:TextAnnotation')) {
      return element.businessObject.text
    }
    if (is(element, 'bpmn:Group')) {
      const businessObject: Element = getBusinessObject(element),
        categoryValueRef = businessObject?.categoryValueRef
      return categoryValueRef?.value
    }
    return element?.businessObject.name
  }
  static setNameValue(element: Element, value: string): void {
    const modeling = getModeling()
    const bpmnFactory: BpmnFactory | undefined = getModeler()?.get('bpmnFactory')
    // 不支持Name的节点
    if (isAny(element, ['bpmn:Collaboration', 'bpmn:DataAssociation', 'bpmn:Association'])) {
      return undefined
    }
    // 文字注释，直接修改text
    if (is(element, 'bpmn:TextAnnotation')) {
      return modeling?.updateModdleProperties(element, element.businessObject, { text: value })
    }
    // 组
    if (is(element, 'bpmn:Group')) {
      const businessObject = getBusinessObject(element),
        categoryValueRef = businessObject.categoryValueRef
      if (!categoryValueRef) {
        const definitions = getBusinessObject(element?.getRootElement()).$parent
        businessObject.categoryValueRef = createCategoryValue(definitions, bpmnFactory)
      }
      return modeling?.updateLabel(element, value)
    }
    modeling?.updateModdleProperties(element, element.businessObject, { name: value })
  }
}
// 流程相关工具
export class Process{
  static getProcessVersionTag(element: Element): string {
    return element.businessObject.get('versionTag')
  }
  static setProcessVersionTag(element: Element, value: string) {
    getModeling()?.updateProperties(element, {
      versionTag: value
    })
  }
  static getProcessExecutable(element: Element): boolean {
    return element.businessObject.isExecutable
  }
  static setProcessExecutable(element: Element, value: boolean) {
    getModeling()?.updateProperties(element, {
      isExecutable: value
    })
  }
}
// 文档内容
export class Document {
  static getDocumentValue(element: Element): string {
    const businessObject = element?.businessObject
    const documentation = businessObject && this.findDocumentation(businessObject.get('documentation'))
    return documentation && documentation.text
  }

  static setDocumentValue(element: Element, value: string | undefined) {
    const bpmnFactory: BpmnFactory | undefined = getModeler()?.get('bpmnFactory')
    let modeling = getModeling()

    const businessObject = element.businessObject
    const documentation = this.findDocumentation(businessObject && businessObject.get('documentation'))
    // (1) 更新或者移除 原有 documentation
    if (documentation) {
      if (value) {
        return modeling?.updateModdleProperties(element, documentation, { text: value })
      } else {
        return modeling?.updateModdleProperties(element, businessObject, {
          documentation: without(businessObject.get('documentation'), documentation)
        })
      }
    }
    // (2) 创建新的 documentation
    if (value) {
      const newDocumentation = bpmnFactory?.create('bpmn:Documentation', {
        text: value
      })
      return modeling?.updateModdleProperties(element, businessObject, {
        documentation: [...businessObject.get('documentation'), newDocumentation]
      })
    }
  }
  static findDocumentation(docs: any[]) {
    const DOCUMENTATION_TEXT_FORMAT = 'text/plain'
    return docs.find(function (d) {
      return (d.textFormat || DOCUMENTATION_TEXT_FORMAT) === DOCUMENTATION_TEXT_FORMAT
    })
  }
}

/**
 * 开始节点
 */
export class Start{
  static getInitiatorValue(element: Element): string | undefined {
    const prefix = getProcessEngine()
    const businessObject = getBusinessObject(element)
    return businessObject.get(`${prefix}:initiator`)
  }
  static setInitiatorValue(element: Element, value: string | undefined) {
    const prefix = getProcessEngine()
    const businessObject = getBusinessObject(element)
    getModeling()?.updateModdleProperties(element, businessObject, {
      [`${prefix}:initiator`]: value
    })
  }
}
export function getListenersContainer(element: Element): ModdleElement {
  const businessObject = getBusinessObject(element)
  return businessObject?.get('processRef') || businessObject
}

/**
 * 监听器
 */
export class Listener{
  static addExecutionListener(element: Element, props: ExecutionListenerForm) {
    const prefix = getProcessEngine()
    const moddle = getModdle()
    const businessObject = getListenersContainer(element)
    const listener = moddle!.create(`${prefix}:ExecutionListener`, {})
    this.updateListenerProperty(element, listener, props)
    addExtensionElements(element, businessObject, listener)
  }
  static updateListenerProperty(
    element: Element,
    listener: ModdleElement,
    props: ExecutionListenerForm
  ) {
    const modeling = getModeling()
    const prefix = getProcessEngine()
    const { event, class: listenerClass, expression, delegateExpression,
      script, type, fields
    } = props
    const updateProperty = (key:any, value:any) =>
      modeling?.updateModdleProperties(element, listener, { [`${prefix}:${key}`]: value })

    event && updateProperty('event', event)
    listenerClass && updateProperty('class', listenerClass)
    expression && updateProperty('expression', expression)
    delegateExpression && updateProperty('delegateExpression', delegateExpression)

    if (script) {
      const bpmnScript = Script.createScript(script)
      modeling?.updateModdleProperties(element, listener, { script: bpmnScript })
    }
  }
  static updateExecutionListener(
    element: Element,
    props: ExecutionListenerForm,
    listener: ModdleElement
  ) {
    removeExtensionElements(element, getListenersContainer(element), listener)
    Listener.addExecutionListener(element, props)
  }
  static getExecutionListenerTypes(element: Element) {
    if (is(element, 'bpmn:SequenceFlow')) {
      return [{ label: 'Take', value: 'take' }]
    }
    return [
      { label: 'Start', value: 'start' },
      { label: 'End', value: 'end' }
    ]
  }
  static getExecutionListeners(element: Element): ModdleElement[] {
    const prefix = getProcessEngine()
    const businessObject = getListenersContainer(element)
    return getExtensionElementsList(businessObject, `${prefix}:ExecutionListener`)
  }
  static getDefaultEvent(element: Element) {
    return is(element, 'bpmn:SequenceFlow') ? 'take' : 'start'
  }
  static getExecutionListenerType(listener: ModdleElement): string {
    const prefix = getProcessEngine()
    if (isAny(listener, [`${prefix}:ExecutionListener`])) {
      if (listener.get(`${prefix}:class`)) return 'class'
      if (listener.get(`${prefix}:expression`)) return 'expression'
      if (listener.get(`${prefix}:delegateExpression`)) return 'delegateExpression'
      if (listener.get('script')) return 'script'
    }
    return ''
  }
  static removeExecutionListener(element: Element, listener: ModdleElement) {
    removeExtensionElements(element, getListenersContainer(element), listener)
  }
}
export class Script{

  static createScript(props: ScriptForm): ModdleElement {
    const prefix = getProcessEngine()
    const moddle = getModdle()
    const { scriptFormat, value, resource } = props
    return moddle!.create(`${prefix}:Script`, { scriptFormat, value, resource })
  }

  static getScriptType(script: ModdleElement & BpmnScript): string {
    if (script.get('resource')) {
      return 'External Resource'
    }
    if (script.get('value')) {
      return 'Inline Script'
    }
    return 'none'
  }

}
export class UserTaskListener{
  static getListeners(element: Element): TaskListener[]{
    if(!isUserTask(element)){
      return []
    }
    const businessObject = getBusinessObject(element);
    const extensionElements = businessObject.extensionElements;
    if (!extensionElements || !extensionElements.values) {
      return [];
    }
    return extensionElements.values
      .filter((el: any) => el.$type === 'bpmn:TaskListener')
      .map((listener: any) => ({
        event: listener.event,
        class: listener.class,
        ...listener
      }));
  }
  static setListener(element: Element,listeners: TaskListener[]){
    if(!isUserTask(element)){
      return
    }
    const businessObject = getBusinessObject(element);
    const extensionElements = businessObject.extensionElements || { values: [] };
    const newListeners = listeners.map(listener => ({
      $type: 'bpmn:TaskListener',
      ...listener
    }));
    extensionElements.values = extensionElements.values.filter((el: any) => el.$type !== 'bpmn:TaskListener');
    extensionElements.values.push(...newListeners);
    businessObject.extensionElements = extensionElements;


  }
}
