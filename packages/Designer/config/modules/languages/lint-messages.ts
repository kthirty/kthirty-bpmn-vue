/** bpmnlint 内置规则英文原文 → 中文 */
export const LINT_MESSAGES: Record<string, string> = {
  'Sequence flow is missing condition': '顺序流缺少条件表达式',
  'Process is missing end event': '流程缺少结束事件',
  'Sub process is missing end event': '子流程缺少结束事件',
  'Start event is missing event definition': '开始事件缺少事件定义',
  'Element is missing bpmndi': '元素缺少 BPMN 图形信息（bpmndi）',
  'Element is not connected': '元素未连接（无有效连线）',
  'SequenceFlow is a duplicate': '存在重复的顺序流',
  'Duplicate outgoing sequence flows': '存在重复的出线',
  'Duplicate incoming sequence flows': '存在重复的入线',
  'Gateway forks and joins': '网关同时分叉与汇合',
  'Flow splits implicitly': '存在隐式分叉',
  'Process has multiple blank start events': '流程存在多个空白开始事件',
  'Sub process has multiple blank start events': '子流程存在多个空白开始事件',
  'Event has multiple event definitions': '事件配置了多个事件定义',
  'Process is missing start event': '流程缺少开始事件',
  'Sub process is missing start event': '子流程缺少开始事件',
  'Start event must be blank': '嵌入式子流程的开始事件须为空白开始',
  'Gateway is superfluous. It only has one source and target.': '网关多余（仅一对进出）',
  'Incoming flows do not join': '入线未正确汇合',
  'Element is missing label/name': '元素缺少名称/标签',
  'Element is an implicit end': '元素为隐式结束',
  'Element is an implicit start': '元素为隐式开始',
  'Termination is superfluous.': '终止事件多余'
}

const DISALLOWED_TYPE = /^Element has disallowed type <([^>]+)>$/

let extraMessages: Record<string, string> = {}

export function mergeLintMessages(map: Record<string, string>) {
  extraMessages = { ...extraMessages, ...map }
}

export function translateLintMessage(message: string, perCall?: Record<string, string>): string {
  const map = { ...LINT_MESSAGES, ...extraMessages, ...perCall }
  if (map[message]) return map[message]
  const disallowed = DISALLOWED_TYPE.exec(message)
  if (disallowed) {
    const type = disallowed[1]
    if (type === 'bpmn:ComplexGateway') return '不允许使用复杂网关'
    if (type === 'bpmn:InclusiveGateway') return '不允许使用包容网关'
    return `不允许使用元素类型 <${type}>`
  }
  return message
}
