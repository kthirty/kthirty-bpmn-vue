import { Element } from 'diagram-js/lib/model/Types'
import { is } from 'bpmn-js/lib/util/ModelUtil'
// 条件类型
const defaultConditionTypeOptions: Record<string, string>[] = [
  { label: '无条件( None )', value: 'none' },
  { label: '默认路径( Default )', value: 'default' },
  { label: '条件表达式( Expression )', value: 'expression' },
  { label: '条件脚本( Script )', value: 'script' }
]
// 获取条件类型可选项
export function getConditionTypeOptions(element: Element): Record<string, string>[] {
  if (is(element, 'bpmn:SequenceFlow')) {
    return defaultConditionTypeOptions
  }
  return defaultConditionTypeOptions.filter((condition) => condition.value !== 'default')
}
