import modeler from '@/store/modeler'
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'
import { Connection,Element } from 'diagram-js/lib/model/Types'
import { createElement, message ,getEventDefinition} from './BpmnElementHelper'
import { getModdle, getModeling } from '@/components/utils/BpmnHolder'

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
    getModeling()?.updateProperties(element.source, { default: isDefault ? element : undefined });
  }

  /**
   * 获取条件事件定义
   * @param element - BPMN 元素
   * @returns 条件事件定义或 false
   */
  static getConditionalEventDefinition(element: Element): false | undefined {
    if (!is(element, 'bpmn:Event')) return false;
    return getEventDefinition(element, 'bpmn:ConditionalEventDefinition');
  }

  /**
   * 修改条件属性
   * @param element - BPMN 元素
   * @param condition - 条件表达式（可选）
   */
  static updateCondition(element: Element, condition?: string) {
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
      modeling.updateModdleProperties(element, eventDefinition, { variableName: value || '' });
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
      modeling.updateModdleProperties(element, eventDefinition, { variableEvents: value || '' });
    }
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
    const assigned = element.$model.ids.assigned(idValue);
    const idAlreadyExists = assigned && assigned !== element;
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
    getModeling().updateProperties(element, { id: value });
  }
}
